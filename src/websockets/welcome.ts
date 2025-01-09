// import ChannelFollowSubscription from "./subscriptions/ChannelFollow"
// import UserWhisperMessageSubscription from "./subscriptions/UserWhisperMessage"

// DOC : https://dev.twitch.tv/docs/eventsub/handling-websocket-events

const welcomeSession = async (
  payload: Payload,
  access_token: string,
  subscribeEvents: Record<string, SubscriptionHandler>
) => {
  console.log('Opened Websocket session with success')
  const { session } = payload

  // Get already done subscriptions
  const {
    // total,
    data,
    // total_cost,
    // max_total_cost,
    // pagination,
   } = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
    },
  }).then(res => res.json())
    .then(res => {
      return res as TwitchSubscriptionBody
    })

  if (Array.isArray(data)) {
    // Filter enabled subscriptions
    const enabledSubscriptions = data.filter(subscription => subscription.status === 'enabled')
    // For each subscription required, find if it's required to start a new one
    console.log('Subscribed services ======================')
    Object.keys(subscribeEvents).forEach(subscription => {
      const hasSubscription = enabledSubscriptions.some(sub => sub.type === subscription)
      console.log(subscription, hasSubscription ? '.....OK' : '.....X')
      if (!hasSubscription) subscribeEvents[subscription](access_token, session)
    })
    console.log('==========================================')
  }

  return subscribeEvents
}

export default welcomeSession
