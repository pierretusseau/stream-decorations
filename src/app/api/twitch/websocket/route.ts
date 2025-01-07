'server only'

import {
  NextRequest,
  NextResponse
} from 'next/server'
import WebSocket from 'ws';
import { createSupaClient } from '@/lib/supabase-service-decorations'

export async function GET(
  req: NextRequest,
) {
  console.log('Connecting to WebSocket server...')
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')

  if (code !== process.env.TWITCH_FOLLOWERS_CODE) return NextResponse.json({
    code: 403,
    body: { message: 'Unauthorized' }
  })

  if (!process.env.SUPABASE_DECORATION_SERVICE_KEY) return NextResponse.json({
    code: 500,
    body: { message: 'Missing SUPABASE_DECORATION_SERVICE_KEY env variable' }
  })

  const supabase = await createSupaClient(process.env.SUPABASE_DECORATION_SERVICE_KEY)
  const { data: tokensData, error: tokensError } = await supabase
    .from('twitch_tokens')
    .select('access_token')
    .single()

  if (tokensError) {
    console.log(tokensError)
    return NextResponse.json({
      code: 500,
      body: { message: 'Error while getting Supabase token' }
    })
  } else {
    console.log(tokensData)
  }

  const twitchWSServerURI = 'wss://eventsub.wss.twitch.tv/ws'
  const keepalive_timeout_seconds = 600
  const wss = new WebSocket(`${twitchWSServerURI}?keepalive_timeout_seconds=${keepalive_timeout_seconds || 10}`)
  // console.log(wss)
  wss.on('message', (message) => {
    const jsonString = message.toString('utf8')
    const jsonObject = JSON.parse(jsonString)
    const { metadata, payload } = jsonObject
    console.log(metadata.message_type)
    if (metadata.message_type === 'session_welcome') {
      const { session } = payload
  
      fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokensData.access_token}`,
          'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          // "type": "user.update",
          "type": "user.whisper.message",
          "version": "1",
          "condition": {
              "user_id": process.env.NEXT_PUBLIC_BROADCASTER_ID
          },
          "transport": {
              "method": "websocket",
              "session_id": session.id
          }
        })
      }).then(res => res.json())
        .then(res => {
          console.log('Response from Websocket subscription')
          console.log(res)
        })
      fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokensData.access_token}`,
          'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "type": "channel.follow",
          "version": "2",
          "condition": {
              "broadcaster_user_id": process.env.NEXT_PUBLIC_BROADCASTER_ID,
              "moderator_user_id": process.env.NEXT_PUBLIC_BROADCASTER_ID
          },
          "transport": {
              "method": "websocket",
              "session_id": session.id
          }
        })
      }).then(res => res.json())
        .then(res => {
          console.log('Response from Websocket subscription')
          console.log(res)
        })
      fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${tokensData.access_token}`,
          'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
          'Content-Type': 'application/json'
        },
        body: JSON.stringify({
          "type": "channel.update",
          "version": "1",
          "condition": {
              "broadcaster_user_id": process.env.NEXT_PUBLIC_BROADCASTER_ID
          },
          "transport": {
              "method": "websocket",
              "session_id": session.id
          }
        })
      }).then(res => res.json())
        .then(res => {
          console.log('Response from Websocket subscription')
          console.log(res)
        })
    } else {
      console.log(jsonObject)
    }
  })

  return NextResponse.json({
    code: 200,
    body: { message: 'Connected to Websocket' }
  })
}