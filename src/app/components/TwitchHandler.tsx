'use client'

import React from 'react'
import Header from '@/app/components/Header'
// import TwitchDebug from '@/app/components/Twitch/TwitchDebug'
import OldTwitchMethod from '@/app/components/Twitch/OldTwitchMethod'
import { ThemeProvider, createTheme } from '@mui/material/styles'

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
const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function TwitchHandler() {
  // const subscribeTwitchHandler = useCallback(async () => {
  //   await fetch(`${window.location.origin}/api/twitch/event-handler`, {
  //     method: "GET",
  //     headers: { "Content-Type": "application/json" },
  //   }).then(res => res.json())
  //     .then(({code, error, body}) => {
  //       if (code === 200) {
  //         console.log('Reponse from twitch handler', code, body)
  //       }
  //       if (error) {
  //         throw new Error(body.message)
  //       }
  //     })
  //     .catch(err => {
  //       console.error(err)
  //     })
  // }, [])

  // useEffect(() => {
  //   subscribeTwitchHandler()
  // }, [subscribeTwitchHandler])

  return (
    <ThemeProvider theme={darkTheme}>
    <div className="bg-neutral-950 text-neutral-50 h-screen flex flex-col gap-10">
      <Header />
      <main className="bg-neutral-900 max-w-screen-2xl mx-auto flex flex-col gap-4">
        {/* <TwitchDebug /> */}
        <hr/>
        <OldTwitchMethod />
      </main>
    </div>
    </ThemeProvider>
  )
}

export default TwitchHandler