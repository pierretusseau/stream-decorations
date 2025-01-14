'use client'

import { createSupaClient } from "@/lib/supabase-service-decorations"
import { addAlert } from "@/store/useAlertStore"

export const subscribeToFollower = async (serviceKey: string) => {
  const supabase = await createSupaClient(serviceKey)
  return supabase
    .channel('followers')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'followers' },
      (payload) => {
        console.log('=> Received new follower:', payload)
        return addAlert({
          created_at: new Date().getTime(),
          type: 'follower',
          user_name: payload.new.user_name
        })
      }
    )
    .subscribe()
}
export const subscribeToSubs = async (serviceKey: string) => {
  const supabase = await createSupaClient(serviceKey)
  return supabase
    .channel('subs')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'subs' },
      (payload) => {
        console.log('=> Received new sub:', payload)
        addAlert({
          created_at: new Date().getTime(),
          type: 'sub',
          user_name: payload.new.chatter_user_name,
          notice_type: payload.new.notice_type,
          sub: payload.new.sub,
          resub: payload.new.resub,
          community_sub_gift: payload.new.community_sub_gift,
        })
      }
    )
    .subscribe()
}
export const subscribeToRaids = async (serviceKey: string) => {
  const supabase = await createSupaClient(serviceKey)
  return supabase
    .channel('raids')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'raids' },
      (payload) => {
        console.log('=> Received new sub:', payload)
        addAlert({
          created_at: new Date().getTime(),
          type: 'raid',
          user_name: payload.new.raider_user_name,
          viewers: payload.new.viewers,
        })
      }
    )
    .subscribe()
}