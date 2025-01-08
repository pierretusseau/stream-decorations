import { create } from "zustand"
import {
  persist,
  // createJSONStorage
} from 'zustand/middleware'
// import supabase from '@//lib/supabase-browser'

// Types
/*----------------------------------------------------*/
declare global {
  type TwitchBearerToken = {
    access_token: string
    expires_in: number
    token_type: "bearer"
  } | null
  type Follower = {
    followed_at: string
    user_id: string
    user_login: string
    user_name: string
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
      bearer_token: null as TwitchBearerToken,
      followers: [] as Follower[],
      totalFollowers: 0,
      lastFollower: null as Follower | null,
      twitch_auth_state: ''
    }),
    {
      name: 'twitch-api', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
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
export const setTwitchBearerToken = (bearer_token: TwitchBearerToken) => {
  useTwitchStore.setState(() => ({ bearer_token: bearer_token }))
}
export const setTwitchAuthState = (state: string) => {
  useTwitchStore.setState(() => ({ twitch_auth_state: state }))
}

// Followers
/*----------------------------------------------------*/
export const fetchFollowers = async (accessToken: string) => {
  console.log('Fetching followers...')
  fetch('https://api.twitch.tv/helix/channels/followers?broadcaster_id=52532305', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${accessToken}`,
      'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!
    }
  }).then(res => res.json())
    .then((res) => {
      // console.log(res)
      const { data: followers } = res
      console.log(followers)
      setFollowers(followers)
      setTotalFollowers(followers)
      setLastFollowers(followers)
    })
    .catch(err => {
      console.error('Error while fetching follower')
      console.log(err)
    })
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