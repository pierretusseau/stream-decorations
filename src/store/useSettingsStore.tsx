import { create } from "zustand"
import {
  persist,
  // createJSONStorage
} from 'zustand/middleware'
// import supabase from '@//lib/supabase-browser'

// Store creation
/*----------------------------------------------------*/

const useSettingsStore = create(
  persist(
    // (set, get) => ({
    () => ({
      supabase_service_key: '',
      supabase_decorations_service_key: '',
    }),
    {
      name: 'amaw-settings', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)

export default useSettingsStore

// Store manipulation methods
/*----------------------------------------------------*/
export const editSupabaseServiceKey = (key: string) => {
  useSettingsStore.setState(() => ({ supabase_service_key: key }))
}
export const editSupabaseDecorationsServiceKey = (key: string) => {
  useSettingsStore.setState(() => ({ supabase_decorations_service_key: key }))
}