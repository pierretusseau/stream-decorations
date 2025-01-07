import { create } from "zustand"
import {
  persist,
  // createJSONStorage
} from 'zustand/middleware'
// import supabase from '@//lib/supabase-browser'

// Store creation
/*----------------------------------------------------*/

const useDecorationsStore = create(
  persist(
    // (set, get) => ({
    () => ({
      decorations: [] as Decoration[]
    }),
    {
      name: 'decorations', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)

export default useDecorationsStore

// Store manipulation methods
/*----------------------------------------------------*/
export const setDecorations = async (decorations: Decoration[]) => {
  useDecorationsStore.setState(() => ({ decorations: decorations }))
}