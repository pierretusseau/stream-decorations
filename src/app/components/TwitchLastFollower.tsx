'use client'

import useTwitchStore, { fetchFollowers, subscribeToFollowers } from '@/store/useTwitchStore'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

function TwitchLastFollower() {
  const { data: session } = useSession()
  const clientId = useTwitchStore((state) => state.client_id)
  const clientSecret = useTwitchStore((state) => state.client_secret)
  const lastFollower = useTwitchStore((state) => state.lastFollower)

  useEffect(() => {
    if (!session) return
    fetchFollowers(session as TwitchSession)
    // subscribeToFollowers(clientId, clientSecret)
  }, [session, clientId, clientSecret])
  
  return (
    <div className="flex flex-col gap-2">
      {/* <p>TwitchLastFollower</p> */}
      <div>
        {lastFollower?.user_name}
      </div>
    </div>
  )
}

export default TwitchLastFollower