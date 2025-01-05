import React from 'react'
import { useSession } from 'next-auth/react'
import { TextField } from '@mui/material'

function TwitchDebug() {
  const { data: session } = useSession()
  if (!session) return null

  console.log(session)
  const { accessToken } = session as TwitchSession

  console.log("TwitchAPI Access Token", accessToken)

  return (
    <div>
      <TextField
        id="outlined-basic"
        label="Access Token"
        variant="outlined"
        // type="password"
        defaultValue={accessToken}
        disabled
        fullWidth
      />
    </div>
  )
}

export default TwitchDebug