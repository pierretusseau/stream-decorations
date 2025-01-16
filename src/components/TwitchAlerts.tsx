'use client'

import React, { useEffect, useState } from 'react'
import Alert from '@/components/Twitch/Alert'
import useAlertStore, {
  resumeAlerts,
  subscribeToAllTables
} from '@/store/useAlertStore'

function TwitchAlerts({
  code
}: {
  code: string
}) {
  const alerts = useAlertStore((state) => state.alerts)
  const pause = useAlertStore((state) => state.pause)
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
    subscribeToAllTables(serviceKey)
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

  useEffect(() => {
    if (!pause) return
    const pauseTimer = setTimeout(() => {
      resumeAlerts()
    }, 1000);
  
    return () => clearTimeout(pauseTimer)
  }, [pause])
  
  if (!serviceKey) return <div className="text-[200px]">LOADING SERVICE KEY</div>
  return (
    <div>
      {currentAlert && !pause && <Alert
        alert={currentAlert}
      />}
    </div>
  )
}

export default TwitchAlerts