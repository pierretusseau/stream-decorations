import { createSupaClient } from "@/lib/supabase-service-decorations"

type FollowerEvent = {
  broadcaster_user_id: string
  broadcaster_user_login: string
  broadcaster_user_name: string
} & TwitchFollower

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

  if (type === 'channel.follow') {
    const followerEvent = event as FollowerEvent
    const newFollower = {
      user_id: parseInt(followerEvent.user_id),
      user_login: followerEvent.user_login,
      user_name: followerEvent.user_name,
      followed_at: followerEvent.followed_at
    }
    // const newFollower = event as Follower
    const { data, error } = await supabase
      .from('followers')
      .upsert(newFollower)
    if (error) console.error(error)
    if (data) console.log('New follower added to supabase :', newFollower)
  }
}

export default TwitchWebhookParser