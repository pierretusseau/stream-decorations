'use client'

import React, { useCallback, useEffect, useState } from 'react'
import { createSupaClient } from '@/lib/supabase-service-decorations'
import { SupabaseClient } from '@supabase/supabase-js'
import Alert from '@/components/Twitch/Alert'

type Alert = {
  created_at: number
  type: 'follower'
  content: string
  animationOver: boolean
}

function TwitchAlerts({
  code
}: {
  code: string
}) {
  const [alerts, setAlerts] = useState<Alert[]>([])
  const [currentAlert, setCurrentAlert] = useState<Alert>()
  const [serviceKey, setServiceKey] = useState()
  const [supabase, setSupabase] = useState<SupabaseClient|undefined>()

  const handleAnimationFinished = useCallback((created_at: number) => {
    const newAlerts = alerts.map(alert => {
      if (alert.created_at === created_at) {
        return {...alert, animationOver: true}
      }
      return alert
    })
    setAlerts(newAlerts)
  }, [alerts])

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

  const handleNewAlert = useCallback((event: Alert) => {
    setAlerts([
      ...alerts,
      event
    ])
  }, [alerts])

  useEffect(() => {
    console.log('alerts', alerts)
    if (alerts.length) {
      const hasMoreAlerts = alerts.some(alert => !alert.animationOver)
      if (!hasMoreAlerts) setAlerts([])
    }
  }, [alerts])

  useEffect(() => {
    if (!serviceKey) return
    if (supabase) return
    const subscribeToFollowers = async () => {
      const supabase = await createSupaClient(serviceKey)
      setSupabase(supabase)
      return supabase
        .channel('followers')
        .on('postgres_changes', { event: 'INSERT', schema: 'public', table: 'followers' },
          (payload) => handleNewAlert({
            created_at: new Date().getTime(),
            type: 'follower',
            content: payload.new.user_name,
            animationOver: false
          })
        )
        .subscribe()
      }
    subscribeToFollowers()
  }, [serviceKey, handleNewAlert, supabase])
  
  useEffect(() => {
    const animationsToDo = alerts
      .sort((a, b) => a.created_at - b.created_at)
      .filter(alert => !alert.animationOver)
    setCurrentAlert(animationsToDo[0])
  }, [alerts])
  
  return (
    <div>
      {currentAlert && <Alert
        type={currentAlert.type}
        content={currentAlert.content}
        timestamp={currentAlert.created_at}
        animationFinished={handleAnimationFinished}
      />}
    </div>
  )
}

export default TwitchAlerts