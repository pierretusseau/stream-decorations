import { create } from "zustand"
import {
  // persist,
  // createJSONStorage
} from 'zustand/middleware'
// import supabase from '@//lib/supabase-browser'
import { createSupaClient } from '@/lib/supabase-service-decorations'

declare global {
  type TwitchEvent = {} & Alert
}

// Store creation
/*----------------------------------------------------*/
const useEventStore = create(() => ({
    events: [] as TwitchEvent[],
    followers: [] as Follower[],
    subs: [] as Sub[],
    raids: [] as Raid[],
    pause: false
  }),
)

export default useEventStore

// Store manipulation methods
/*----------------------------------------------------*/
export const resetEvents = () => {
  useEventStore.setState(() => ({ events: [] }))
}
export const addEvent = (event: TwitchEvent) => {
  useEventStore.setState((state) => ({ events: [
    ...state.events,
    event
  ].sort((a, b) => {
    if (!a.created_at || !b.created_at) return 0
    return b.created_at - a.created_at
  })}))
}
export const removeEvent = (timestamp: number) => {
  useEventStore.setState((state) => {
    const newEvents = state.events.filter(event => event.created_at !== timestamp)
    return { events: newEvents }
  })
}
export const pauseEvents = () => {
  useEventStore.setState(() => ({ pause: true }))
}
export const resumeEvents = () => {
  useEventStore.setState(() => ({ pause: false }))
}

export const fetchAllTables = async (serviceKey: string) => {
  const supabase = await createSupaClient(serviceKey)
  console.log('Fetch Followers...')
  const { data: followers, error: followersError } = await supabase
    .from('followers')
    .select()
    .order('followed_at', { ascending: false })
    .limit(10)
  if (followersError) console.log('Error while fecthing followers', followersError)
  if (followers) useEventStore.setState(() => ({ followers: followers }))
    
  console.log('Fetch Subs...')
  const { data: subs, error: subsError } = await supabase
    .from('subs')
    .select()
    .limit(10)
  if (subsError) console.log('Error while fecthing subs', subsError)
  if (subs) useEventStore.setState(() => ({ subs: subs }))

  console.log('Fetch Raids...')
  const { data: raids, error: raidsError } = await supabase
    .from('raids')
    .select()
    .limit(10)
  if (raidsError) console.log('Error while fecthing raids', raidsError)
  if (raids) useEventStore.setState(() => ({ raids: raids }))

  if (Array.isArray(followers) && Array.isArray(subs) && Array.isArray(raids)) {
    const eventsFollower = followers.map(follower => ({
      created_at: new Date(follower.followed_at).getTime(),
      user_name: follower.user_name,
      type: 'follower',
    }))
    const eventsSubs = subs.map(sub => ({
      created_at: new Date(sub.created_at).getTime(),
      user_name: sub.chatter_user_name || 'Anonymous',
      type: 'sub',
      notice_type: sub.notice_type,
      sub: sub.sub,
      resub: sub.resub,
      community_sub_gift: sub.community_sub_gift
    }))
    const eventsRaids = raids.map(raid => ({
      created_at: new Date(raid.created_at).getTime(),
      user_name: raid.from_broadcaster_user_name,
      type: 'raid',
      viewers: raid.viewers
    }))
    const newEvents = [
      ...eventsFollower,
      ...eventsSubs,
      ...eventsRaids,
    ].sort((a, b) => {
      // I hate Typescript, especially the Friday
      if (!a.created_at || !b.created_at) return 0
      return b.created_at - a.created_at
    }) as TwitchEvent[]

    useEventStore.setState(() => ({ events: newEvents }))
  }
}

export const subscribeToAllTables = async (serviceKey: string) => {
  console.log('Subscribing to Followers...')
  const supabase = await createSupaClient(serviceKey)
  supabase
    .channel('followers')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'followers' },
      (payload) => {
        console.log('=> New Follow')
        addEvent({
          created_at: new Date(payload.new.followed_at).getTime(),
          type: 'follower',
          user_name: payload.new.user_name
        })
      }
    )
    .subscribe()
    
  console.log('Subscribing to Subs...')
  supabase
    .channel('subs')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'subs' },
      (payload) => addEvent({
        created_at: new Date(payload.new.created_at).getTime(),
        type: 'sub',
        user_name: payload.new.chatter_user_name,
        notice_type: payload.new.notice_type,
        sub: payload.new.sub,
        resub: payload.new.resub,
        community_sub_gift: payload.new.community_sub_gift,
      })
    )
    .subscribe()
    
  console.log('Subscribing to Raids...')
  supabase
    .channel('raids')
    .on(
      'postgres_changes',
      { event: 'INSERT', schema: 'public', table: 'raids' },
      (payload) => addEvent({
        created_at: new Date(payload.new.created_at).getTime(),
        type: 'raid',
        user_name: payload.new.from_broadcaster_user_name,
        viewers: payload.new.viewers,
      })
    )
    .subscribe()
}