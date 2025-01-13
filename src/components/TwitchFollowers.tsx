'use client'

import React, { useEffect, useState } from 'react'
import useAccessToken from '@/hooks/useAccessToken'
import useTwitchStore, {
  setFollowers,
  subscribeToFollowers
} from '@/store/useTwitchStore'

function TwitchFollowers({
  code
}: {
  code: string
}) {
  const accessToken = useAccessToken(code)
  const [serviceKey, setServiceKey] = useState()
  const followers = useTwitchStore((state) => state.followers)
  // const [followers, setFollowers] = useState<Follower[]>([])

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
    subscribeToFollowers(serviceKey)
  }, [serviceKey])
  
  useEffect(() => {
    if (!accessToken) return
    
    console.log('Fetching followers...')
    fetch(`/api/twitch/followers`, {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken })
    }).then(res => res.json())
      .then(res => {
        const { status, body, followers: resFollowers } = res
        if (status !== 200) throw new Error(body.message)
        setFollowers(resFollowers)
      })
      .catch(err => {
        console.log('Error while fetching follower')
        console.error(err)
      })
  }, [accessToken])

  const orderedFollowers = followers.sort((a, b) => {
    const aTime = new Date(a.followed_at).getTime()
    const bTime = new Date(b.followed_at).getTime()
    return Math.floor(bTime / 100) - Math.floor(aTime / 100)
  })

  return (
    <div
      className="flex flex-col gap-2 items-start"
    >
      {!accessToken
        ? <div>Loading followers...</div>
        : orderedFollowers.map(follower => <div
          key={follower.user_id}
          className="bg-neutral-900 px-6 py-2 rounded-lg"
        >
          <div>{follower.user_name}</div>
          <div>{follower.followed_at}</div>
        </div>)
      }
    </div>
  )
}

export default TwitchFollowers