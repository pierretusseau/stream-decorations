import { createSupaClient } from "@/lib/supabase-service-decorations"
import { create } from "zustand"
import {
  persist,
  // createJSONStorage
} from 'zustand/middleware'

// Types
/*----------------------------------------------------*/
declare global {
  type TwitchAppToken = {
    access_token: string
    expires_in: number
    expiration_date?: string
    token_type: "bearer"
  } | null
  type Subscriptions = {
    total: number
    data: Subscription[]
    max_total_cost: 10000
    total_cost: 0,
    pagination?: unknown // TODO : Eventually pass a correct pagination
  }
  type Subscription = {
    id: string,
    status: string,
    type: string,
    version: string,
    condition: {
        user_id: string
    },
    created_at: string,
    transport: {
        method: string,
        callback: string
    },
    cost: 0
  }
}

// Store creation
/*----------------------------------------------------*/
const useTwitchStore = create(
  persist(
    // (set, get) => ({
    () => ({
      client_id: '',
      client_secret: '',
      app_token: null as TwitchAppToken,
      followers: [] as Follower[],
      totalFollowers: 0,
      lastFollower: null as Follower | null,
      twitch_auth_state: '',
      subscriptions: null as Subscriptions | null,
    }),
    {
      name: 'twitch-api', // name of the item in the storage (must be unique)
      // storae: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
      // version: 2
    },
  ),
)

export default useTwitchStore

// Store manipulation methods
/*----------------------------------------------------*/
export const setTwitchClientId = (client_id: string) => {
  useTwitchStore.setState(() => ({ client_id: client_id }))
}
export const setTwitchClientSecret = (client_secret: string) => {
  useTwitchStore.setState(() => ({ client_secret: client_secret }))
}
export const setTwitchAppToken = (app_token: TwitchAppToken) => {
  useTwitchStore.setState(() => ({ app_token: app_token }))
}
export const setTwitchAuthState = (state: string) => {
  useTwitchStore.setState(() => ({ twitch_auth_state: state }))
}
export const setSubscriptions = (subscriptions: Subscriptions) => {
  useTwitchStore.setState(() => ({ subscriptions: subscriptions }))
}

// Followers
/*----------------------------------------------------*/
// export const fetchFollowers = async (accessToken: string) => {
//   console.log('Fetching followers...')
//   fetch('https://api.twitch.tv/helix/channels/followers?broadcaster_id=52532305', {
//     method: 'GET',
//     headers: {
//       'Authorization': `Bearer ${accessToken}`,
//       'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!
//     }
//   }).then(res => res.json())
//     .then((res) => {
//       // console.log(res)
//       const { data: followers } = res
//       console.log(followers)
//       setFollowers(followers)
//       setTotalFollowers(followers)
//       setLastFollowers(followers)
//     })
//     .catch(err => {
//       console.error('Error while fetching follower')
//       console.log(err)
//     })
// }

export const subscribeToFollowers = async (serviceKey:  string) => {
  console.log('Subscribing to followers...')
  const supabase = await createSupaClient(serviceKey)
  return supabase
    .channel('followers')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'followers' },
      // @ts-expect-error : Need to find proper type
      (payload) => addFollower(payload.new)
    )
    .subscribe()
}

export const setFollowers = (followers: Follower[]) => {
  useTwitchStore.setState(() => ({ followers: followers }))
}
export const setTotalFollowers = (followers: Follower[]) => {
  useTwitchStore.setState(() => ({ totalFollowers: followers.length }))
}
export const setLastFollowers = (followers: Follower[]) => {
  useTwitchStore.setState(() => ({ lastFollower: followers[0] || null }))
}
export const addFollower = (newFollower: Follower) => {
  console.log('Received new realtime follower')
  useTwitchStore.setState((state) => ({
    followers: [
      ...state.followers,
      newFollower
    ]
  }))
}