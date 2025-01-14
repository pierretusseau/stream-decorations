import { create } from "zustand"
import {
  persist,
  // createJSONStorage
} from 'zustand/middleware'
// import supabase from '@//lib/supabase-browser'

declare global {
  type AlertBase = {
    created_at?: number
    user_name: string
  }
  type FollowAlert = {
    type: 'follower'
  }
  type SubAlertBase = {
    type: 'sub'
  }
  type SubAlert = {
    notice_type: 'sub'
    sub: TwitchSub
  } & SubAlertBase
  type ResubAlert = {
    notice_type: 'resub'
    resub: TwitchResub
  } & SubAlertBase
  type CommunitySubGiftAlert = {
    notice_type: 'community_sub_gift'
    community_sub_gift: TwitchCommunitySubGift
  } & SubAlertBase
  type Alert = AlertBase & (FollowAlert | SubAlert | ResubAlert | CommunitySubGiftAlert)
}


// Store creation
/*----------------------------------------------------*/
const useAlertStore = create(
  persist(
    // (set, get) => ({
    () => ({
      alerts: [] as Alert[]
    }),
    {
      name: 'alerts', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)

export default useAlertStore

// Store manipulation methods
/*----------------------------------------------------*/
export const resetAlerts = () => {
  useAlertStore.setState(() => ({ alerts: [] }))
}
export const addAlert = (alert: Alert) => {
  useAlertStore.setState((state) => ({ alerts: [
    ...state.alerts,
    alert
  ]}))
}
export const removeAlert = (timestamp: number) => {
  useAlertStore.setState((state) => {
    const newAlerts = state.alerts.filter(alert => alert.created_at !== timestamp)
    return { alerts: newAlerts }
  })
}