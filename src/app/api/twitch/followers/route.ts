'server-only'

import { createSupaClient } from '@/lib/supabase-service-decorations'
import { refreshToken } from '@/utils/twitch'

import {
  NextRequest,
  NextResponse
} from 'next/server'

export async function GET(
  req: NextRequest,
) {
  console.log('Fetching twitch followers...')
  const { searchParams } = new URL(req.url)

  const code = searchParams.get('code')
  if (code !== process.env.TWITCH_FOLLOWERS_CODE) return NextResponse.json({
    code: 403,
    body: { message: 'Unauthorized' }
  })

  if (!process.env.SUPABASE_DECORATION_SERVICE_KEY) return NextResponse.json({
    code: 500,
    body: { message: 'Supabase Service Key not setup in env variables' }
  })
  if (!process.env.NEXT_PUBLIC_BROADCASTER_ID) return NextResponse.json({
    code: 500,
    body: { message: 'Twitch Broadcaster ID isn\'t defined in env variables' }
  })
  if (!process.env.NEXT_PUBLIC_AUTH_TWITCH_ID) return NextResponse.json({
    code: 500,
    body: { message: 'Twitch App ID missing in env variables' }
  })

  // Ask DB for the Access Token
  const supabase = await createSupaClient(process.env.SUPABASE_DECORATION_SERVICE_KEY)
  const { data: tokens, error: access_token_error } = await supabase
    .from('twitch_tokens')
    .select('access_token, refresh_token')
    .single()
  
  if (access_token_error) return NextResponse.json({
    code: 500,
    body: { message: 'Failed to get access token from Supabase' }
  })
  if (!tokens) return NextResponse.json({
    code: 500,
    body: { message: 'Empty Supabase token' }
  })

  if (!process.env.NEXT_PUBLIC_BROADCASTER_ID) return NextResponse.json({
    code: 500,
    body: { message: 'Missing Broadcaster ID in env variables' }
  })

  const twitchFollowerBaseURI = 'https://api.twitch.tv/helix/channels/followers'
  const twitchFetchURI = `${twitchFollowerBaseURI}?broadcaster_id=${process.env.NEXT_PUBLIC_BROADCASTER_ID}`
  const followers = await fetch(twitchFetchURI, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
      'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID
    }
  }).then(res => {
    console.log('Asking for Twitch list of followers...')
    if (res.status === 401) {
      console.log('Access token no more valid')
      console.log(res)
      refreshToken(tokens, supabase)
    }
    return res.json()
  }).then(res => {
    return res.data
  }).catch(err => NextResponse.json({
    code: 500,
    body: { message: err }
  }))

  console.log(followers.length, 'followers found')

  return NextResponse.json({
    code: 200,
    followers: followers as Follower[],
    body: { message: 'Fetched twitch followers with success' }
  })
}