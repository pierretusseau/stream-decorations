import { useCallback, useEffect } from 'react'
import useTwitchStore, { setSubscriptions } from '@/store/useTwitchStore'

const clientID = process.env.NEXT_PUBLIC_AUTH_TWITCH_ID

const getSubscriptionsList = (
  appToken: TwitchAppToken,
  clientID: string,
  // setSubscriptions: (value: React.SetStateAction<Subscriptions | undefined>) => void
) => {
  if (!appToken) return
  fetch('https://api.twitch.tv/helix/eventsub/subscriptions', {
    method: 'GET',
    headers: {
      'Authorization': `Bearer ${appToken.access_token}`,
      'Client-Id': clientID
    }
  }).then(res => res.json())
    .then(res => {
      setSubscriptions(res)
    })
    .catch(err => console.error(err))
}

function useTwitchSubscriptions() {
  const appToken = useTwitchStore((state) => state.app_token)
  const subscriptions = useTwitchStore((state) => state.subscriptions)

  const refreshSubscriptions = useCallback(() => {
    console.log('Calling refresh')
    if (!clientID) throw new Error('Missing Client ID')
    getSubscriptionsList(appToken, clientID)
  }, [appToken])

  useEffect(() => {
    if (!clientID) console.error('Client ID not found')
    if (appToken && clientID) {
      getSubscriptionsList(appToken, clientID)
    } else {
      return
    }
  }, [appToken])
  
  return {
    subscriptions,
    refreshSubscriptions
  }
}

export default useTwitchSubscriptions