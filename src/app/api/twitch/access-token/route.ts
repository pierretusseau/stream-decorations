'server-only'

import { refreshToken } from '@/utils/twitch'
import { createSupaClient } from '@/lib/supabase-service-decorations'

import {
  NextRequest,
  NextResponse
} from 'next/server'

export async function POST(
  req: NextRequest,
) {
  console.log('Fetching access token...')
  const { moduleCode } = await req.json()

  if (!moduleCode) return NextResponse.json({
    code: 500,
    body: { message: 'You didn\'t provide a module code' }
  })

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

  // Accessing DB
  const supabase = await createSupaClient(serviceKey as string)
  const { data: foundModules, error } = await supabase
    .from('modules')
    .select('code, type')
    .eq('code', moduleCode)
    // .single()

  if (error) return NextResponse.json({
    code: 500,
    body: { message: 'Error while getting modules list from Supabase' }
  })
  
  console.log('Module found :', foundModules)

  // Verify if module exists
  if (!foundModules.length) return NextResponse.json({
    code: 403,
    body: { message: 'Module code is invalid' }
  })

  // Ask DB for the Access Token
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

  // Query Followers to test the access token
  // We know for sure followers require a valid access token
  // If access token is not valid, we'll get a 401 to use to refresh the token
  const twitchFollowerBaseURI = 'https://api.twitch.tv/helix/channels/followers'
  const twitchFetchURI = `${twitchFollowerBaseURI}?broadcaster_id=${broadcasterID}`
  const access_token = await fetch(twitchFetchURI, {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${tokens.access_token}`,
      'Client-Id': twitchAppID
    }
  }).then(res => res.json())
    .then(async (res) => {
      console.log('Testing access token...')
      if (res.status === 401) {
        console.log('Access token no more valid')
        console.log(res)
        const access_token = await refreshToken(tokens, supabase)
        return access_token
      } else {
        return tokens.access_token
      }
  }).catch(err => NextResponse.json({
    code: 500,
    body: { message: err }
  }))

  console.log('Found valid access_token :', access_token)

  return NextResponse.json({
    code: 200,
    access_token,
    body: { message: 'Got access token' }
  })
}