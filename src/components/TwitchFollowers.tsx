'use client'

import React, { useEffect, useState } from 'react'
import useAccessToken from '@/hooks/useAccessToken'
import useWebhookSecret from '@/hooks/useWebhookSecret'

function TwitchFollowers({
  code
}: {
  code: string
}) {
  const accessToken = useAccessToken(code)
  const webhookSecret = useWebhookSecret(code)
  const [followers, setFollowers] = useState<Follower[]>([])

  useEffect(() => {
    if (!accessToken) return
    
    console.log('Fetching followers...')
    fetch(`/api/twitch/followers`, {
      method: 'POST',
      body: JSON.stringify({ access_token: accessToken })
    }).then(res => res.json())
      .then(res => {
        const { code: statusCode, body, followers: resFollowers } = res
        if (statusCode !== 200) throw new Error(body.message)
        setFollowers(resFollowers)
      })
      .catch(err => {
        console.log('Error while fetching follower')
        console.error(err)
      })
  }, [accessToken])

  useEffect(() => {
    if (!followers.length) return

    console.log(followers)
  }, [followers, accessToken, webhookSecret])

  return (
    <div
      className="flex flex-col gap-2 items-start"
    >
      {!accessToken
        ? <div>Loading followers...</div>
        : followers.map(follower => <div
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