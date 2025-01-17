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
  type ChatNotificationMetadata = {
    message_id: string
    message_timestamp: string
    message_type: string
    subscriptions_type: string
    subscription_version: string
  }
  type ChatNotificationPayload = {
    "subscription": {
      "id": string,
      "status": string,
      "type": string,
      "version": string,
      "condition": {
        "broadcaster_user_id": string,
        "user_id": string
      },
      "transport": {
        "method": "websocket" | "webhook",
        "session_id": string
      },
      "created_at": string,
      "cost": number
    },
    "event": {
      "broadcaster_user_id": string,
      "broadcaster_user_login": string,
      "broadcaster_user_name": string,
      "chatter_user_id": string,
      "chatter_user_login": string,
      "chatter_user_name": string,
      "chatter_is_anonymous": boolean,
      "color": string,
      "badges": never[],
      "system_message": string,
      "message_id": string,
      "message": {
        "text": string,
        "fragments": never[]
      },
      "notice_type": string,
      "sub": null | unknown,
      "resub": {
        "cumulative_months": number,
        "duration_months": number,
        "streak_months": null | unknown,
        "sub_plan": string,
        "is_gift": boolean,
        "gifter_is_anonymous": null | unknown,
        "gifter_user_id": null | unknown,
        "gifter_user_name": null | unknown,
        "gifter_user_login": null | unknown
      },
      "sub_gift": null | unknown,
      "community_sub_gift": null | unknown,
      "gift_paid_upgrade": null | unknown,
      "prime_paid_upgrade": null | unknown,
      "pay_it_forward": null | unknown,
      "raid": null | unknown,
      "unraid": null | unknown,
      "announcement": null | unknown,
      "bits_badge_tier": null | unknown,
      "charity_donation": null | unknown,
      "shared_chat_sub": null | unknown,
      "shared_chat_resub": null | unknown,
      "shared_chat_sub_gift": null | unknown,
      "shared_chat_community_sub_gift": null | unknown,
      "shared_chat_gift_paid_upgrade": null | unknown,
      "shared_chat_prime_paid_upgrade": null | unknown,
      "shared_chat_pay_it_forward": null | unknown,
      "shared_chat_raid": null | unknown,
      "shared_chat_announcement": null | unknown,
      "source_broadcaster_user_id": null | unknown,
      "source_broadcaster_user_login": null | unknown,
      "source_broadcaster_user_name": null | unknown,
      "source_message_id": null | unknown,
      "source_badges": null | unknown
    }
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
      debugChatNotificationPayload: [] as ChatNotificationPayload[],
      addDebugChatNotificationPayloadPersonal: [] as ChatNotificationPayload[]
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
export const addDebugChatNotificationPayload = (payload: ChatNotificationPayload) => {
  useTwitchStore.setState((state) => {
    if (payload.event.broadcaster_user_id === process.env.NEXT_PUBLIC_BROADCASTER_ID) {
      return {
        addDebugChatNotificationPayloadPersonal: [
          ...state.debugChatNotificationPayload,
          payload
        ]
      }
    } else {
      return {
        debugChatNotificationPayload: [
          ...state.debugChatNotificationPayload,
          payload
        ]
      }
    }
  }
  )
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