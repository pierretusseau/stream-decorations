import React, {
  // useCallback,
  // useEffect,
  useState
} from 'react'
import useTwitchStore, {
  setTwitchAppToken,
  setTwitchClientId,
  setTwitchClientSecret
} from '@/store/useTwitchStore'
import { Button, TextField } from '@mui/material'

declare global {
  type TwitchUser = {
    broadcaster_type: string
    created_at: string
    description: string
    display_name: string
    id: string
    login: string
    offline_image_url: string
    profile_image_url: string
    type: string
    view_count: number
  }
}

const base_url = 'https://api.twitch.tv/helix'
const url = 'https://id.twitch.tv/oauth2/token'
const username = 'k0baru'

function OldTwitchMethod() {
  const clientId = useTwitchStore((state) => state.client_id)
  const clientSecret = useTwitchStore((state) => state.client_secret)
  const bearerToken = useTwitchStore((state) => state.app_token)
  const [user, setUser] = useState<TwitchUser|null>(null)

  const params = new URLSearchParams()
  params.append('client_id', clientId)
  params.append('client_secret', clientSecret)
  params.append('grant_type', 'client_credentials')
  params.append('scope', 'moderator:read:followers')

  const handleOAuth = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    fetch(`${window.location.origin}/api/twitch/get-access-token`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        client_id: clientId,
        client_secret: bearerToken,
      })
    }).then(res => res.json())
      .then((res) => {
        console.log(res)
      })
      .catch(err => {
        console.error(err)
      })
  }

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    fetch(url, {
      method: "POST",
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
      body: params
    }).then(res => res.json())
      .then((res) => {
        setTwitchAppToken(res)
      })
      .catch(err => {
        console.error(err)
      })
  }

  const getUser = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!bearerToken) throw Error('No bearer token')
    fetch(`https://api.twitch.tv/helix/users?login=${username}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${bearerToken.access_token}`,
        "Client-Id": clientId
      }
    }).then(res => res.json())
      .then(({data}) => {
        setUser(data.find((user: TwitchUser) => user.login === username))
      })
      .catch(err => {
        console.error(err)
      })
  }


  const getFollowers = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (!bearerToken) throw Error('No bearer token')
    if (!user) throw Error('No user')
    console.log('Fetching: ', `${base_url}/channels/followers?broadcaster_id=${user.id}`)
    fetch(`${base_url}/channels/followers?broadcaster_id=${user.id}`, {
      method: "GET",
      headers: {
        "Authorization": `Bearer ${bearerToken.access_token}`,
        "Client-Id": clientId
      }
    }).then(res => res.json())
      .then(({data}) => {
        console.log(data)
      })
      .catch(err => {
        console.error(err)
      })
  }

  return (
    <div className="bg-neutral-900 flex flex-col gap-4">
      <div className="flex flex-col gap-4 text-neutral-950">
        <TextField
          id="outlined-basic"
          label="Client ID"
          variant="outlined"
          // type="password"
          value={clientId}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwitchClientId(e.target.value)}
          fullWidth
        />
        <TextField
          id="outlined-basic"
          label="Client Secret"
          variant="outlined"
          type="password"
          value={clientSecret}
          onChange={(e: React.ChangeEvent<HTMLInputElement>) => setTwitchClientSecret(e.target.value)}
          fullWidth
        />
      </div>

      <div className="flex gap-2 items-start">
        <Button
          onClick={(e) => handleOAuth(e)}
          className="min-w-[200px]"
        >Connect twitch oAuth</Button>
      </div>
      <div className="flex gap-2 items-start">
        <Button
          onClick={(e) => handleClick(e)}
          className="min-w-[200px]"
        >Connect twitch</Button>
        <div>
          {bearerToken && Object.entries(bearerToken)
            .map(([key, value]) => {
              return <div key={key}>{key} : {value}</div>
            })
          }
        </div>
      </div>
      <div className="flex gap-2 items-start">
        <Button
          onClick={(e) => getUser(e)}
          className="min-w-[200px]"
        >Get User</Button>
        <div>
          {user && Object.entries(user)
            .map(([key, value]) => {
              return <div key={key}>{key} : {value}</div>
            })
          }
        </div>
      </div>
      {user && <div>
        <Button
          onClick={(e) => getFollowers(e)}
          className="min-w-[200px]"
        >Get Followers</Button>
      </div>}
    </div>
  )
}

export default OldTwitchMethod