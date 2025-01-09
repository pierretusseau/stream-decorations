'server-only'

import { createSupaClient } from '@/lib/supabase-service-decorations'

import {
  NextRequest,
  NextResponse
} from 'next/server'

export async function POST(
  req: NextRequest,
) {
  console.log('Fetching twitch followers...')
  const { access_token } = await req.json()

  // Env variable checks
  const serviceKey = process.env.SUPABASE_DECORATION_SERVICE_KEY
  const broadcasterID = process.env.NEXT_PUBLIC_BROADCASTER_ID
  const twitchAppID = process.env.NEXT_PUBLIC_AUTH_TWITCH_ID

  if (!serviceKey) return NextResponse.json({
    code: 500,
    body: { message: 'Supabase Service Key not setup in env variables' }
  })
  if (!broadcasterID) return NextResponse.json({
    code: 500,
    body: { message: 'Twitch Broadcaster ID isn\'t defined in env variables' }
  })
  if (!twitchAppID) return NextResponse.json({
    code: 500,
    body: { message: 'Twitch App ID missing in env variables' }
  })

  // Ask DB for the Access Token
  const supabase = await createSupaClient(serviceKey)
  const { data: token, error: access_token_error } = await supabase
    .from('twitch_tokens')
    .select('access_token')
    .single()
  
  if (access_token_error) return NextResponse.json({
    code: 500,
    body: { message: 'Failed to get access token from Supabase' }
  })
  if (token.access_token !== access_token) return NextResponse.json({
    code: 403,
    body: { message: 'Wrong access token' }
  })

  const twitchFollowerBaseURI = 'https://api.twitch.tv/helix/channels/followers'
  const twitchFetchURI = `${twitchFollowerBaseURI}?broadcaster_id=${broadcasterID}`
  const followers = await fetch(twitchFetchURI, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Client-Id': twitchAppID
    }
  }).then(res => {
    console.log('Asking for Twitch list of followers...')
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