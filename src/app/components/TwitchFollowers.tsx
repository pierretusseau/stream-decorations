'use client'

import React, { useEffect } from 'react'

function TwitchFollowers({
  code
}: {
  code: string
}) {
  const baseReqURI = '/api/twitch/followers'

  useEffect(() => {
    console.log('Fetching followers...')
    fetch(`${baseReqURI}?code=${code}`, {
      method: 'GET'
    }).then(res => res.json())
      .then(res => {
        const { code, body, followers } = res
        if (code !== 200) throw new Error(body.message)
        console.log(followers)
      })
      .catch(err => {
        console.log('Error while fetching follower')
        console.error(err)
      })
  }, [code])
  
  return (
    <div>TwitchFollower : {code}</div>
  )
}

export default TwitchFollowers