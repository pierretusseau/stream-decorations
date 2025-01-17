'use client'

import React, { useEffect, useState } from 'react'
import useSettingsStore from '@/store/useSettingsStore'
import useTwitchStore, {
  addDebugChatNotificationPayload
} from '@/store/useTwitchStore'
import Header from '@/components/Header'
import { Box, Tab, Tabs } from '@mui/material'
// import WebSocket from 'ws'

type WSSession = {
  id: string
}
  
const twitchWSServerURI = 'wss://eventsub.wss.twitch.tv/ws'
const keepalive_timeout_seconds = 10

function ChatNotifications() {
  const userAccessToken = useSettingsStore((state) => state.user_access_token)
  const debug = useTwitchStore((state) => state.debugChatNotificationPayload)
  const selfDebug = useTwitchStore((state) => state.addDebugChatNotificationPayloadPersonal)
  const [session, setSession] = useState<WSSession|null>()
  const [tabValue, setTabValue] = useState(0)
  
  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }
  
  useEffect(() => {
    if (!userAccessToken) return
    const wss = new WebSocket(`${twitchWSServerURI}?keepalive_timeout_seconds=${keepalive_timeout_seconds || 10}`)
    wss.addEventListener('message', (message) => {
      const jsonString = message.data.toString('utf8')
      const jsonObject = JSON.parse(jsonString)
      const { metadata, payload } = jsonObject
      const session = payload.session as WSSession
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
      } else if (metadata.message_type === 'session_keepalive') {
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
            "broadcaster_user_id": process.env.NEXT_PUBLIC_BROADCASTER_ID,
            // "broadcaster_user_id": "117011503", // Jean Massiet
            // "broadcaster_user_id": "89132304", // sasavot
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
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Myself (52532305)" id={`simple-tab-0`}/>
          <Tab label="sasavot (89132304)" id={`simple-tab-1`}/>
        </Tabs>
      </Box>
      <div role="tabpanel" hidden={tabValue !== 0}>
        {selfDebug.map((payload, i) => {
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
        })}
      </div>
      <div role="tabpanel" hidden={tabValue !== 1}>
        {debug.map((payload, i) => {
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
        })}
      </div>
    </main>
  )
}

export default ChatNotifications