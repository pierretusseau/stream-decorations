'use client'

import React, { useEffect, useState } from 'react'
import useSettingsStore from '@/store/useSettingsStore'
import useTwitchStore, {
  addDebugChatNotificationPayload
} from '@/store/useTwitchStore'
import Header from '@/components/Header'
// import WebSocket from 'ws'

type WSSession = {
  id: string
}

function ChatNotifications() {
  const userAccessToken = useSettingsStore((state) => state.user_access_token)
  const debug = useTwitchStore((state) => state.debugChatNotificationPayload)
  const [session, setSession] = useState<WSSession|null>()

  // useEffect(() => {
  //   fetch('api/twitch/websocket', {
  //     method: 'POST',
  //     body: JSON.stringify({ access_token: userAccessToken })
  //   }).then(res => res.json())
  //     .then(res => {
  //       const { websocket } = res
  //       console.log(res)
  //       setWebsocket(websocket)
  //     })
  // }, [userAccessToken])
  
  const twitchWSServerURI = 'wss://eventsub.wss.twitch.tv/ws'
  const keepalive_timeout_seconds = 10
  // let keepAlive: number
  
  useEffect(() => {
    if (!userAccessToken) return
    const wss = new WebSocket(`${twitchWSServerURI}?keepalive_timeout_seconds=${keepalive_timeout_seconds || 10}`)
    wss.addEventListener('message', (message) => {

    // })
    // wss.on('message', (message) => {
      const jsonString = message.data.toString('utf8')
      const jsonObject = JSON.parse(jsonString)
      const { metadata, payload } = jsonObject
      const session = payload.session as WSSession
      // console.log('[WSS] NEW Message :', metadata.message_type)
      if (metadata.message_type === 'session_welcome') {
        console.log(jsonObject)
        console.log('userAccessToken', userAccessToken)
        // Subscribe to events
        fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
          method: 'GET',
          headers: {
            'Authorization': `Bearer ${userAccessToken}`,
            'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
          },
        }).then(res => res.json())
          .then(res => {
            console.log('Res connection', res)
            setSession(session)
            // return res as TwitchSubscriptionBody
            return res
          })
        // wss.send('connection')
        // wss.emit('connection')
        // wss.
      } else if (metadata.message_type === 'session_keepalive') {
        // Keep alive message
        // if (!keepAlive) {
        //   keepAlive = 0
        //   console.log(jsonObject)
        // }
        // keepAlive++
        console.count('session_keepalive')
      } else {
        // Unknown events
        const typedPayload = payload as ChatNotificationPayload
        console.log('+ New', payload.subscription.type)
        console.log(payload)
        addDebugChatNotificationPayload(typedPayload)
      }
    })

    return () => wss.close()
  }, [userAccessToken])
  
  useEffect(() => {
    if (!session) return
    fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${userAccessToken}`,
        'Client-Id': process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
        'Content-Type': 'application/json'
      },
      body: JSON.stringify({
        "type": "channel.chat.notification",
        "version": "1",
        "condition": {
            // "broadcaster_user_id": "117011503", // Jean Massiet
            "broadcaster_user_id": "89132304", // sasavot
            "user_id": process.env.NEXT_PUBLIC_BROADCASTER_ID
        },
        "transport": {
            "method": "websocket",
            "session_id": session.id
        }
      })
    }).then(res => res.json())
      .then(res => {
        console.log(res)
        const { data } = res
        if (!data) throw new Error('Error while subscribing to channel.chat.notification')
        console.log('Subscribed to channel.chat.notification')
        return res
      })
      .catch(err => {
        console.log(err)
      })
  }, [session, userAccessToken])
  

  return (
    <main className="bg-neutral-900 min-h-screen">
      <Header />
      <div>{debug.map((payload, i) => {
        return <div
          key={`data-${i}`}
        >
          <hr/>
          {payload.subscription.type}
          {payload.event.system_message}
          <pre className="text-xs">
            {JSON.stringify(payload.event, null, 2)}
          </pre>
        </div>
      })}</div>
    </main>
  )
}

export default ChatNotifications