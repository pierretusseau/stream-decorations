'use client'

import { useEffect, useState } from "react"

const useAccessToken = (code: string) => {
  const [accessToken, setAccessToken] = useState<string|undefined|Error>()

  useEffect(() => {
    const fetchAccessToken = async () => {
      console.log('Checking access token...')
      const access_token = await fetch('/api/twitch/access-token', {
        method: 'POST',
        body: JSON.stringify({
          moduleCode: code
        })
      }).then(res => res.json())
        .then(res => {
          const { code, body, access_token } = res
          if (code !== 200) throw new Error(body.message)
          console.log('Received access token')
          setAccessToken(access_token)
        })
        .catch(err => {
          console.error(err)
        })
      return access_token
    }
    fetchAccessToken()
  }, [code])

  return accessToken
}

export default useAccessToken