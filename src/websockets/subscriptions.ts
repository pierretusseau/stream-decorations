export const ChannelFollowSubscription = async (
  access_token: string,
  session: Payload['session']
) => {
  const subscription = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "type": "channel.follow",
      "version": "2",
      "condition": {
          "broadcaster_user_id": process.env.NEXT_PUBLIC_BROADCASTER_ID,
          "moderator_user_id": process.env.NEXT_PUBLIC_BROADCASTER_ID
      },
      "transport": {
          "method": "websocket",
          "session_id": session.id
      }
    })
  }).then(res => res.json())
    .then(res => {
      const { data } = res
      if (!data) throw new Error('Error while subscribing to channel.follow')
      console.log('Subscribed to channel.follow')
      return res
    })
    .catch(err => {
      console.log(err)
    })
  
  return subscription
}

export const UserWhisperMessageSubscription = async (
  access_token: string,
  session: Payload['session']
) => {
  const subscription = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "type": "user.whisper.message",
      "version": "1",
      "condition": {
          "user_id": process.env.NEXT_PUBLIC_BROADCASTER_ID
      },
      "transport": {
          "method": "websocket",
          "session_id": session.id
      }
    })
  }).then(res => res.json())
    .then(res => {
      const { data } = res
      if (!data) throw new Error('Error while subscribing to user.whisper.message')
      console.log('Subscribed to user.whisper.message')
      return res
    })
    .catch(err => {
      console.log(err)
    })
  
  return subscription
}

export const ChannelUpdateSubscription = async (
  access_token: string,
  session: Payload['session']
) => {
  const subscription = await fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'POST',
    headers: {
      'Authorization': `Bearer ${access_token}`,
      'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      "type": "channel.update",
      "version": "1",
      "condition": {
          "broadcaster_user_id": process.env.NEXT_PUBLIC_BROADCASTER_ID
      },
      "transport": {
          "method": "websocket",
          "session_id": session.id
      }
    })
  }).then(res => res.json())
    .then(res => {
      const { data } = res
      if (!data) throw new Error('Error while subscribing to channel.update')
      console.log('Subscribed to channel.update')
      return res
    })
    .catch(err => {
      console.log(err)
    })
  
  return subscription
}