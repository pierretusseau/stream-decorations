'use client'

import React, { useEffect, useState } from 'react'

function TwitchFollowers({
  code
}: {
  code: string
}) {
  const [followers, setFollowers] = useState<Follower[]>([])
  
  const baseReqURI = '/api/twitch/followers'

  useEffect(() => {
    console.log('Fetching followers...')
    fetch(`${baseReqURI}?code=${code}`, {
      method: 'GET'
    }).then(res => res.json())
      .then(res => {
        const { code: statusCode, body, followers: resFollowers } = res
        if (statusCode !== 200) throw new Error(body.message)
        setFollowers(resFollowers)

        fetch(`/api/twitch/websocket?code=${code}`, {
          method: 'GET',
        }).then(res => res.json())
          .then(res => {
            console.log(res)
          })
      })
      .catch(err => {
        console.log('Error while fetching follower')
        console.error(err)
      })
  }, [code])
  
  return (
    <div
      className="flex flex-col gap-2 items-start"
    >
      {followers.map(follower => <div
        key={follower.user_id}
        className="bg-neutral-900 px-6 py-2 rounded-lg"
      >
        <div>{follower.user_name}</div>
        <div>{follower.followed_at}</div>
      </div>)}
    </div>
  )
}

export default TwitchFollowers