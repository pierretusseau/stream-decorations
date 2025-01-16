import type { SupabaseClient } from '@supabase/supabase-js'
import { createSupaClient } from "@/lib/supabase-service-decorations"

type FollowerEvent = {
  broadcaster_user_id: string
  broadcaster_user_login: string
  broadcaster_user_name: string
} & TwitchFollower

declare global {
  type TwitchSub = {
    duration_months: number,
    sub_tier: "1000" | "2000" | "3000",
    is_prime: boolean,
  }
  type TwitchResub = {
    cumulative_months: number,
    duration_months: number,
    streak_months: number,
    sub_tier: "1000" | "2000" | "3000",
    is_prime: boolean,
    is_gift: boolean,
    gifter_is_anonymous: boolean | null,
    gifter_user_id: string | null,
    gifter_user_name: string | null,
    gifter_user_login: string | null,
  }
  type TwitchCommunitySubGift = {
    id: string,
    total: number,
    cumulative_total: number,
    sub_tier: "1000" | "2000" | "3000",
  }
}

type SubEventBase = {
  notice_type: 'sub' | 'resub' | 'community_sub_gift'
  sub: TwitchSub | null
  resub: TwitchResub | null
  community_sub_gift: TwitchCommunitySubGift | null
}

type AnonymousSubEvent = {
  chatter_is_anonymous: true
  chatter_user_id: null,
  chatter_user_login: null,
  chatter_user_name: null,
}
type UserSubEvent = {
  chatter_is_anonymous: false
  chatter_user_id: string
  chatter_user_login: string
  chatter_user_name: string
}

type SubEvent = SubEventBase & (AnonymousSubEvent | UserSubEvent)

type RaidEvent = {
  from_broadcaster_user_id: string,
  from_broadcaster_user_login: string,
  from_broadcaster_user_name: string,
  viewers: number,
}

const TwitchWebhookParser = async ({
  type,
  event,
  serviceKey
}: {
  type: string,
  event: unknown
  serviceKey: string
}) => {
  console.log('=> Received event :', type)
  console.log(event)
  console.log('=========================================')
  const supabase = await createSupaClient(serviceKey)

  if (type === 'channel.follow') addSupaFollower(supabase, event as FollowerEvent)
  if (type === 'channel.chat.notification') addSupaSub(supabase, event as SubEvent)
  if (type === 'channel.raid') addSupaRaid(supabase, event as RaidEvent)
}

export default TwitchWebhookParser

const addSupaFollower = async (supabase: SupabaseClient, event: FollowerEvent) => {
  const newFollower = {
    user_id: parseInt(event.user_id),
    user_login: event.user_login,
    user_name: event.user_name,
    followed_at: event.followed_at
  }
  // const newFollower = event as Follower
  const { error } = await supabase
    .from('followers')
    .upsert(newFollower)
  if (error) console.error(error)
}

const addSupaSub = async (supabase: SupabaseClient, event: SubEvent) => {
  const newSub = {
    chatter_user_id: event.chatter_user_id ? parseInt(event.chatter_user_id) : null,
    chatter_user_login: event.chatter_user_login,
    chatter_user_name: event.chatter_user_name,
    notice_type: event.notice_type,
    sub: event.sub,
    resub: event.resub,
    community_sub_gift: event.community_sub_gift
  }
  const { error } = await supabase
    .from('subs')
    .insert(newSub)
  if (error) console.error(error)
}

const addSupaRaid = async (supabase: SupabaseClient, event: RaidEvent) => {
  console.log('Trying to add raid to supabase...')
  const newRaid = {
    from_broadcaster_user_id: event.from_broadcaster_user_id,
    from_broadcaster_user_login: event.from_broadcaster_user_login,
    from_broadcaster_user_name: event.from_broadcaster_user_name,
    viewers: event.viewers,
  }
  console.log('Debug newRaid ⬇️')
  console.log(newRaid)
  const { error } = await supabase
    .from('raids')
    .insert(newRaid)
  if (error) {
    console.log('Error adding raid to supabase')
    console.error(error)
  }
}