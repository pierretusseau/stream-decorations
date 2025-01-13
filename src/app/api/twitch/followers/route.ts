'server-only'

import { createSupaClient } from '@/lib/supabase-service-decorations'

import {
  NextRequest,
  NextResponse
} from 'next/server'

declare global {
  type TwitchFollower = {
    user_id: string
  } & Follower
}

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
    status: 500,
    body: { message: 'Supabase Service Key not setup in env variables' }
  })
  if (!broadcasterID) return NextResponse.json({
    status: 500,
    body: { message: 'Twitch Broadcaster ID isn\'t defined in env variables' }
  })
  if (!twitchAppID) return NextResponse.json({
    status: 500,
    body: { message: 'Twitch App ID missing in env variables' }
  })

  // Ask DB for the Access Token
  const supabase = await createSupaClient(serviceKey)
  const { data: token, error: access_token_error } = await supabase
    .from('twitch_tokens')
    .select('access_token')
    .single()
  
  if (access_token_error) return NextResponse.json({
    status: 500,
    body: { message: 'Failed to get access token from Supabase' }
  })
  if (token.access_token !== access_token) return NextResponse.json({
    status: 403,
    body: { message: 'Wrong access token' }
  })

  const { data: supaFollowers, error: supaFollowersError } = await supabase
    .from('followers')
    .select()
    .order('followed_at', { ascending: false })

  if (supaFollowersError) {
    console.error('supaFollowersError', supaFollowersError)
    return NextResponse.json({
      message: 'Error while fetching supabase followers'
    }, {
      status: 500,
    })
  }

  const twitchFollowerBaseURI = 'https://api.twitch.tv/helix/channels/followers'
  const twitchFetchURI = `${twitchFollowerBaseURI}?broadcaster_id=${broadcasterID}`
  const options = {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${token.access_token}`,
      'Client-Id': twitchAppID
    }
  }
  const fetchTotal = await fetch(`${twitchFetchURI}&first=1`, options)
    .then(res => res.json())
    .then(res => res.total)
  if (fetchTotal !== supaFollowers.length) {

  }
  const fetchFollowers = async (
    pagination: string
  ) => {
    const fullTwitchFetchURL = `${twitchFetchURI}&first=100${pagination.length ? `&after=${pagination}` : ''}` 
    return await fetch(fullTwitchFetchURL, options).then(res => {
      console.log('Asking for Twitch list of followers...')
      return res.json()
    }).then(res => {
      return res
    }).catch(err => NextResponse.json({
      status: 500,
      body: { message: err }
    }))
  }
  
  const fetchAllFollowers = async () => {
    let pagination = ''
    let allFollowers = [] as TwitchFollower[]

    do {
      const response = await fetchFollowers(pagination)
      if (response.data && response.data.length > 0) {
        allFollowers = [...allFollowers, ...response.data]
      }
      pagination = response.pagination.cursor || ''
    } while (pagination)
    
    return allFollowers
  }

  const allFollowers = await fetchAllFollowers()
  // Check simply a DB size difference
  const differenceBetweenDBSize = supaFollowers.length !== allFollowers.length
  const lastSupaFollower = supaFollowers[0]
  const lastTwitchFollower = allFollowers[0]
  // Also check if last follower has different followed_at time
  const lastSupaFollowerDate = new Date(lastSupaFollower.followed_at).getTime() / 1000
  const lastTwitchFollowerDate = new Date(lastTwitchFollower.followed_at).getTime() / 1000
  const differenceBetweenLastFollower = Math.floor(lastSupaFollowerDate) !== Math.floor(lastTwitchFollowerDate)
  // If any of those condition trigger, update the Supabase DB
  if (differenceBetweenDBSize || differenceBetweenLastFollower) {
    console.warn('Difference between Supabase and Twitch response')
    // Delete missing followers from Supabase
    const listOfDeletions = supaFollowers.filter(twitchFollower => {
      return !allFollowers.some(f => parseInt(f.user_id) === twitchFollower.user_id)
    }).map(f => f.user_id)
    if (listOfDeletions.length) {
      const responseDeletion = await supabase
        .from('followers')
        .delete()
        .in('user_id', listOfDeletions)
      if (responseDeletion.status === 204) {
        console.log('Deleted', listOfDeletions.length, 'followers with success')
      }
    }

    const { data, error } = await supabase
      .from('followers')
      .upsert(allFollowers.map(f => ({
        ...f,
        user_id: parseInt(f.user_id),
      })))
      .select()
    
    if (error) return NextResponse.json({
      status: 500,
      body: { message: 'Error while upserting new followers into Supabase' }
    })
    return NextResponse.json({
      status: 200,
      followers: data,
      body: { message: 'Upserted list of followers with success' }
    })
  }

  return NextResponse.json({
    status: 200,
    followers: allFollowers as Follower[],
    body: { message: 'Fetched twitch followers with success' }
  })
}