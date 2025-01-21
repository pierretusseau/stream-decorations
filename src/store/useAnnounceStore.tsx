
import { create } from "zustand"
import {
  persist,
  // createJSONStorage
} from 'zustand/middleware'
// import supabase from '@//lib/supabase-browser'
import supabase from "@/lib/supabase-browser-decorations"

// Store creation
/*----------------------------------------------------*/
const useAnnouncesStore = create(
  persist(
    // (set, get) => ({
    () => ({
      announces: [] as Announce[]
    }),
    {
      name: 'announces', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)

export default useAnnouncesStore

// Store manipulation methods
/*----------------------------------------------------*/
export const initAnnounces = async () => {
  const { data, error } = await supabase
    .from('announces')
    .select()
  if (error) {
    console.warn('Error while fetching announces')
    console.error(error)
  }
  if (data) {
    useAnnouncesStore.setState(() => ({ announces: data }))
  }
}
export const setAnnounces = (announces: Announce[]) => {
  useAnnouncesStore.setState(() => ({ announces: announces }))
}