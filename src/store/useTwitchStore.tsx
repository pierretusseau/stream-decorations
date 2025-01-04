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