import { create } from "zustand"
import supabase from '@/app/lib/supabase-browser'

// Store creation
/*----------------------------------------------------*/
const useHuntStore = create(() => ({
  hunts: [] as Hunt[]
}))

export default useHuntStore

export const fetchHunts = async () => {
  console.log('initializing hunts')
  const { data } = await supabase
    .from('hunts')
    .select()
    .order('id')
  const hunts = data as Hunt[]
  useHuntStore.setState(() => ({ hunts: hunts }))
}

export const subscribeToHunts = () => {
  console.log('Subscribing to hunts...')
  return supabase
    .channel('hunts')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'hunts' },
      // @ts-expect-error : Need to find proper type
      (payload) => addHunt(payload.new)
    )
    .on(
      'postgres_changes',
      { event: 'DELETE', schema: 'public', table: 'hunts' },
      (payload) => removeHunt(payload.old.id)
    )
    .on(
      'postgres_changes',
      { event: 'UPDATE', schema: 'public', table: 'hunts' },
      // @ts-expect-error : Need to find proper type
      (payload) => editHunt(payload.new)
    )
    .subscribe()
}

export const addHunt = (hunt: Hunt) => {
  useHuntStore.setState((state) => ({ hunts: [...state.hunts, hunt] }))
}

export const removeHunt = (id: Hunt['id']) => {
  useHuntStore.setState((state) => {
    return {
      hunts: state.hunts.filter(h => h.id !== id)
    }
  })
}

export const editHunt = (hunt: Hunt) => {
  useHuntStore.setState((state) => {
    return {
      hunts: state.hunts.map(h => {
        if (h.id === hunt.id) {
          return hunt
        } else {
          return h
        }
      })
    }
  })
}