'use client'

import useTwitchStore, {
  fetchFollowers,
  // subscribeToFollowers
} from '@/store/useTwitchStore'
import { useSession } from 'next-auth/react'
import React, { useEffect } from 'react'

function TwitchLastFollower() {
  const { data: session } = useSession()
  const clientId = useTwitchStore((state) => state.client_id)
  const clientSecret = useTwitchStore((state) => state.client_secret)
  const lastFollower = useTwitchStore((state) => state.lastFollower)

  useEffect(() => {
    if (!session) return
    const twitchSession = session as TwitchSession
    fetchFollowers(twitchSession)
    // subscribeToFollowers(clientId, clientSecret)
    // fetch(`/api/twitch/get-bearer-token`, {
    //   method: "POST",
    //   body: JSON.stringify({
    //     code: twitchSession.accessToken
    //   })
    // })
  }, [session, clientId, clientSecret])

  useEffect(() => {
    // fetch(`/api/twitch/websocket`, {
    //   method: 'GET',
    // }).then(res => res.json())
    //   .then(({ code, body }) => {
    //     console.log(code)
    //     console.log(body)
    //   })
    //   .catch(err => {
    //     console.error(err)
    //   })
  }, [])
  
  
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