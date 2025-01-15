import { create } from "zustand"
import { persist } from "zustand/middleware"
import supabase from '@/lib/supabase-browser-amaw'

// Store creation
/*----------------------------------------------------*/
const useWeaponsStore = create(
  persist(
    // (set, get) => ({
    () => ({
      weapons: [] as Weapon[]
    }),
    {
      name: 'amaw-weapons', // name of the item in the storage (must be unique)
      // storage: createJSONStorage(() => sessionStorage), // (optional) by default, 'localStorage' is used
    },
  ),
)

export default useWeaponsStore

// Supabase
/*----------------------------------------------------*/
export const fetchWeapons = async () => {
  console.log('initializing weapons...')
  const { data } = await supabase
    .from('weapons')
    .select()
    .order('id')
  const weapons = data as Weapon[]
  useWeaponsStore.setState(() => ({ weapons: weapons }))
}

export const subscribeToWeapons = () => {
  console.log('Subscribing to weapons...')
  return supabase
    .channel('weapons')
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'weapons' },
      // @ts-expect-error : Need to find proper type
      (payload) => editWeapon(payload.new)
    )
    .subscribe()
}

// Store manipulation methods
/*----------------------------------------------------*/
export const editWeapon = (weapon: Weapon) => {
  useWeaponsStore.setState((state) => {
    return {
      weapons: state.weapons.map(m => {
        if (m.id === weapon.id) {
          return weapon
        } else {
          return m
        }
      })
    }
  })
}