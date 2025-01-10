import { useCallback, useEffect, useState } from 'react'
import useTwitchStore, { setTwitchAppToken } from '@/store/useTwitchStore'

const getAppAccessToken = async (
  twitchAuthState: string,
  setToken: React.Dispatch<React.SetStateAction<TwitchAppToken|undefined>>
) => {
  fetch('/api/twitch/app-token', {
    method: "POST",
    body: JSON.stringify({
      state: twitchAuthState
    })
  }).then(res => res.json())
    .then(res => {
      const { status, token, body } = res
      if (status !== 200) throw new Error(body.message)
      setToken(token)
      setTwitchAppToken(token)
    })
}

function useTwitchAppToken() {
  const appToken = useTwitchStore((state) => state.app_token)
  const twitchAuthState = useTwitchStore((state) => state.twitch_auth_state)
  const [token, setToken] = useState<TwitchAppToken|undefined>()

  const regenerateToken = useCallback(() => {
    getAppAccessToken(twitchAuthState, setToken)
  }, [twitchAuthState])

  useEffect(() => {
    if (twitchAuthState) {
      if (appToken) {
        setToken(appToken)
      } else {
        getAppAccessToken(twitchAuthState, setToken)
      }
    } else {
      return
    }
  }, [twitchAuthState, appToken])
  
  // if (!twitchAuthState) return null
  return { token, regenerateToken }
}

export default useTwitchAppToken