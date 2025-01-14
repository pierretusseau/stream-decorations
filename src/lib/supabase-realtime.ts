'use client'

import { createSupaClient } from "@/lib/supabase-service-decorations"
import { addAlert } from "@/store/useAlertStore"

export const subscribeToFollower = async (serviceKey: string) => {
  const supabase = await createSupaClient(serviceKey)
  return supabase
    .channel('followers')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'followers' },
      (payload) => addAlert({
        created_at: new Date().getTime(),
        type: 'follower',
        user_name: payload.new.user_name
      })
    )
    .subscribe()
}
export const subscribeToSubs = async (serviceKey: string) => {
  const supabase = await createSupaClient(serviceKey)
  return supabase
    .channel('subs')
    .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'followers' },
      (payload) => {
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