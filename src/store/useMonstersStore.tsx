import { create } from "zustand"
import { persist } from "zustand/middleware"
import supabase from '@//lib/supabase-browser'

// Store creation
/*----------------------------------------------------*/
const useMonstersStore = create(
  persist(
    // (set, get) => ({
    () => ({
      monsters: [] as Monster[]
    }),
    {
      name: 'amaw-hunts', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)

export default useMonstersStore

// Supabase
/*----------------------------------------------------*/
export const fetchMonsters = async () => {
  console.log('initializing monsters...')
  const { data } = await supabase
    .from('monsters')
    .select()
    .order('id')
  const monsters = data as Monster[]
  useMonstersStore.setState(() => ({ monsters: monsters }))
}

export const subscribeToMonsters = () => {
  console.log('Subscribing to monsters...')
  return supabase
    .channel('monsters')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'monsters' },
      // @ts-expect-error : Need to find proper type
      (payload) => editMonster(payload.new)
    )
    .subscribe()
}

// Store manipulation methods
/*----------------------------------------------------*/
export const editMonster = (monster: Monster) => {
  useMonstersStore.setState((state) => {
    return {
      monsters: state.monsters.map(m => {
        if (m.id === monster.id) {
          return monster
        } else {
          return m
        }
      })
    }
  })
}