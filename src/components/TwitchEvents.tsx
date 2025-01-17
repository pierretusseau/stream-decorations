'use client'

import React, { useEffect, useState } from 'react'
import useEventStore, {
  fetchAllTables,
  subscribeToAllTables
} from '@/store/useEventStore'
import { Box, CircularProgress } from '@mui/material'
import Event from '@/components/Twitch/Event'

function TwitchEvents({
  code
}: {
  code: string
}) {
  const events = useEventStore((state) => state.events)
  const [currentEvents, setCurrentEvents] = useState<TwitchEvent[]>([])
  const [serviceKey, setServiceKey] = useState()

  if (events.length > 0) {
    console.log(events)
    const lastEvents = events.slice(0, 10)
    if (currentEvents.length === 0 || lastEvents[0].created_at !== currentEvents[0].created_at) {
      setCurrentEvents(lastEvents)
    }
  }

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
    fetchAllTables(serviceKey)
    subscribeToAllTables(serviceKey)
  }, [serviceKey])

  if (!serviceKey) {
    return <Box
      className="flex min-h-screen items-center justify-center"
    >
      <div className="w-[40px] h-[40px] scale-[5]">
        <CircularProgress />
      </div>
    </Box>
  } else {
    return (
      <div className="flex flex-col gap-2 w-full">
        {currentEvents.map((event, index) => <Event
         key={`event-${index}`}
          event={event}
        />)}
      </div>
    )
  }
}

export default TwitchEvents