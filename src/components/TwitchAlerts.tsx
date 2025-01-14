'use client'

import React, { useEffect, useState } from 'react'
import Alert from '@/components/Twitch/Alert'
import useAlertStore from '@/store/useAlertStore'
import {
  subscribeToFollower,
  subscribeToSubs
} from '@/lib/supabase-realtime'
import type { RealtimeChannel } from '@supabase/supabase-js'

type WebhookSubscriptionHandler = (serviceKey: string) => Promise<RealtimeChannel>

const subscriptions: Record<string, WebhookSubscriptionHandler> = {
  'follower': subscribeToFollower,
  'sub': subscribeToSubs
}

function TwitchAlerts({
  code
}: {
  code: string
}) {
  const alerts = useAlertStore((state) => state.alerts)
  const [currentAlert, setCurrentAlert] = useState<Alert>()
  const [serviceKey, setServiceKey] = useState()

  useEffect(() => {
    fetch('/api/decorations/service-key', {
      method: 'POST',
      body: JSON.stringify({code})
    }).then(res => res.json())
      .then(res => {
        const { status, ok, service_key, body } = res
        if (status !== 200 || !ok) throw new Error(body.message)
        setServiceKey(service_key)
      })
      .catch(err => console.error(err))
  }, [code])

  useEffect(() => {
    if (!serviceKey) return
    Object.keys(subscriptions).forEach(subscription => {
      subscriptions[subscription](serviceKey)
    })
  }, [serviceKey])
  
  useEffect(() => {
    const animationsToDo = alerts
      .sort((a, b) => {
        // I hate Typescript, especially the Monday
        if (!a.created_at || !b.created_at) return 0
        return a.created_at - b.created_at
      })
    setCurrentAlert(animationsToDo[0])
  }, [alerts])
  
  return (
    <div>
      {currentAlert && <Alert
        alert={currentAlert}
      />}
    </div>
  )
}

export default TwitchAlerts