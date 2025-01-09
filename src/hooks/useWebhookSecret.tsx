'use client'

import { useEffect, useState } from "react"

const useWebhookSecret = (code: string) => {
  const [webhookSecret, setWebhookSecret] = useState<string|undefined|Error>()

  useEffect(() => {
    const fetchAccessToken = async () => {
      console.log('Checking webhook secret...')
      const access_token = await fetch('/api/twitch/webhook/secret', {
        method: 'POST',
        body: JSON.stringify({
          moduleCode: code
        })
      }).then(res => res.json())
        .then(res => {
          const { code, body, secret } = res
          if (code !== 200) throw new Error(body.message)
          console.log('Received webhook secret')
          setWebhookSecret(secret)
        })
        .catch(err => {
          console.error(err)
        })
      return access_token
    }
    fetchAccessToken()
  }, [code])

  return webhookSecret
}

export default useWebhookSecret