import { create } from "zustand"
import {
  persist,
  // createJSONStorage
} from 'zustand/middleware'
// import supabase from '@//lib/supabase-browser'
// @ts-expect-error : Not a TS lib 😡
// import TES from 'tesjs'

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
      lastFollower: null as Follower | null
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

// Followers
/*----------------------------------------------------*/
export const fetchFollowers = async (session: TwitchSession) => {
  console.log('Fetching followers...')
  fetch('https://api.twitch.tv/helix/channels/followers?broadcaster_id=52532305', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${session.accessToken}`,
      'Client-Id': '0xkv8lvr9f0ojilv88ot991h589hxl'
    }
  }).then(res => res.json())
    .then(({ data: followers }) => {
      setFollowers(followers)
      setTotalFollowers(followers)
      setLastFollowers(followers)
    })
}

export const subscribeToFollowers = (
  clientId: string,
  clientSecret: string
) => {
  console.log('Subscribing to followers...')
  const tes = new TES({
    identity: {
      identity: clientId,
      secret: clientSecret
    },
    listener: {
      type: "webhook",
      baseURL: "https://localhost:3000", // TODO : Make dynamic
      // secret: webhookSecret
    }
  })

  tes.on("channel.update", (event: { broadcaster_user_name: string; title: string }) => {
    console.log(`${event.broadcaster_user_name}'s new title is ${event.title}`);
});
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