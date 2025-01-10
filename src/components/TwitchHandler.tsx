'use client'

import React from 'react'
import { ThemeProvider, createTheme } from '@mui/material/styles'
import Header from '@/components/Header'
// import TwitchDebug from '@/app/components/Twitch/TwitchDebug'
// import OldTwitchMethod from '@/app/components/Twitch/OldTwitchMethod'
import EventSub from '@/components/Twitch/EventSub'

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
    <div className="bg-neutral-950 text-neutral-50 min-h-screen flex flex-col gap-10">
      <Header />
      <main className="bg-neutral-900 max-w-screen-2xl mx-auto flex flex-col gap-4 mb-20">
        <EventSub />
        {/* <TwitchDebug /> */}
        {/* <hr/> */}
        {/* <OldTwitchMethod /> */}
      </main>
    </div>
    </ThemeProvider>
  )
}

export default TwitchHandler