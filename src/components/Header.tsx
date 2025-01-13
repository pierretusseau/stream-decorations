import React, { useState } from 'react'
import TwitchLogin from "@/components/TwitchLogin";
import { Button } from '@mui/material'
// import { useSession } from 'next-auth/react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';
import TwitchAuthStateModal from '@/components/Twitch/TwitchAuthStateModal';
import useTwitchStore from '@/store/useTwitchStore';
import { ThemeProvider, createTheme } from '@mui/material/styles'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Header() {
  // const { data: session } = useSession()
  const [openModal, setOpenModal] = useState(false)
  const twitchAuthState = useTwitchStore((state) => state.twitch_auth_state)

  return (
    <ThemeProvider theme={darkTheme}>
      <header className="flex justify-between py-2 px-10">
        <div>
          <Button
            href="/"
          >Home</Button>
          <Button
            href="/playground"
          >Playground</Button>
        </div>
        <div className="flex items-center gap-4">
          {/* {session && <Button
            href="/twitch-handler"
            className="flex gap-2 items-center"
          ><Cog6ToothIcon className="size-4"/> Twitch</Button>} */}
          {twitchAuthState && <Button
            onClick={() => setOpenModal(true)}
          ><Cog6ToothIcon className="size-4"/></Button>}
          {twitchAuthState && <Button
            href="/twitch-handler"
          >
            Twitch Dashboard
          </Button>}
          <TwitchLogin
            setOpenModal={setOpenModal}
          />
          <TwitchAuthStateModal
            open={openModal}
            setOpenModal={setOpenModal}
          />
        </div>
      </header>
    </ThemeProvider>
  )
}

export default Header