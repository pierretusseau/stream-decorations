'server only'

import {
  NextRequest,
  NextResponse
} from 'next/server'
import WebSocket from 'ws';
import { createSupaClient } from '@/lib/supabase-service-decorations'
import welcomeSession from '@/websockets/welcome';

import {
  ChannelFollowSubscription,
  // ChannelUpdateSubscription,
  // UserWhisperMessageSubscription,
  ChannelChatNotificationSubscription,
} from '@/websockets/subscriptions'

export const dynamic = 'force-dynamic'

declare global {
  type Payload = {
    session: {
      id: string
      status: string
      connected_at: string
      keepalive_timeout_seconds: number
      reconnect_url: null
    }
  }
  type SubscriptionHandler = (access_token: string, session: Payload['session']) => void | Promise<void>
  type TwitchSubscriptionBodyData = {
    id: string
    status: string
    type: string
    version: string
    condition: unknown
    created_at: string
    transport: {
      method: string
      callback?: string // Only if webhook
      session_id ?: string // Only if websocket
    }
    cost: number
  }
  type TwitchSubscriptionBody = {
    data: TwitchSubscriptionBodyData | TwitchSubscriptionBodyData[]
    // connected_at?: {
    //   conduit_id?: string
    // }
    total: number
    total_cost: number
    max_total_cost: number
  }
}

const subscribeEvents: Record<string, SubscriptionHandler> = {
  // 'user.whisper.message': UserWhisperMessageSubscription,
  'channel.follow': ChannelFollowSubscription,
  // 'channel.update': ChannelUpdateSubscription,
  'channel.chat.notification': ChannelChatNotificationSubscription,
}

export async function POST(
  req: NextRequest,
) {
  console.log('Connecting to WebSocket server...')
  const { access_token } = await req.json()

  const serviceKey = process.env.SUPABASE_DECORATION_SERVICE_KEY
  if (!serviceKey) return NextResponse.json({
    code: 500,
    body: { message: 'Missing SUPABASE_DECORATION_SERVICE_KEY env variable' }
  })

  const supabase = await createSupaClient(serviceKey)
  const { data: token, error: tokenError } = await supabase
    .from('twitch_tokens')
    .select('access_token')
    .single()

  if (tokenError) {
    return NextResponse.json({
      code: 500,
      body: { message: 'Error while getting Supabase token' }
    })
  }
  if (token.access_token !== access_token) return NextResponse.json({
    code: 403,
    body: { message: 'Wrong access token' }
  })

  const twitchWSServerURI = 'wss://eventsub.wss.twitch.tv/ws'
  const keepalive_timeout_seconds = 10
  let keepAlive: number
  const wss = new WebSocket(`${twitchWSServerURI}?keepalive_timeout_seconds=${keepalive_timeout_seconds || 10}`)
  // console.log(wss)
  wss.on('message', (message) => {
    const jsonString = message.toString('utf8')
    const jsonObject = JSON.parse(jsonString)
    const { metadata, payload } = jsonObject
    console.log('[WSS] NEW Message :', metadata.message_type)
    if (metadata.message_type === 'session_welcome') {
      console.log(jsonObject)
      // Subscribe to events
      welcomeSession(payload, access_token, subscribeEvents)
      wss.emit('connection')
      // wss.
    } else if (metadata.message_type === 'session_keepalive') {
      // Keep alive message
      if (!keepAlive) {
        keepAlive = 0
        console.log(jsonObject)
      }
      keepAlive++
      console.log('session_keepalive', keepAlive)
    } else if (Object.keys(subscribeEvents).some(key => key === payload.subscription.type)) {
      // Known event
      console.log('+ New', payload.subscription.type)
      console.log(jsonObject)
    } else {
      // Unknown events
      console.log('Unknown notification !')
      console.log(jsonObject)
    }
  })

  return NextResponse.json({
    code: 200,
    websocket: wss,
    body: { message: 'Connected to Websocket' }
  })
}