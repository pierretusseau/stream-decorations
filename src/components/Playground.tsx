'use client'

import React, { useState } from 'react'
import FollowerAlert from '@/components/Twitch/Alert/FollowerAlert'
import Header from '@/components/Header';
import { ThemeProvider } from '@emotion/react'
import { Button, createTheme } from '@mui/material';
import { ArrowPathIcon, PlayIcon } from '@heroicons/react/24/solid';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

const resetRender = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
  setter(false)
  setTimeout(() => {
    setter(true)
  }, 50);
}

function Playground() {
  const [displayFollowerAlert, setDisplayFollowerAlert] = useState(false)
  return (
    <ThemeProvider theme={darkTheme}>
    <div className="bg-neutral-950 text-neutral-50 min-h-screen flex flex-col gap-10">
      <Header />
      <main className="bg-neutral-900 max-w-screen-2xl mx-auto flex flex-col gap-4 mb-20">
        <div className="w-[1200px] max-w-full flex flex-col gap-6">
          <div className="flex justify-between items-center">
            <h2>FollowerAlert</h2>
            <div>
              <Button
                onClick={() => setDisplayFollowerAlert(true)}
              ><PlayIcon /></Button>
              <Button
                onClick={() => resetRender(setDisplayFollowerAlert)}
              ><ArrowPathIcon /></Button>
            </div>
          </div>
          {displayFollowerAlert && <FollowerAlert
            content="VeryLongNicknameForTests"
            setDisplayFollowerAlert={setDisplayFollowerAlert}
          />}
        </div>
      </main>
    </div>
    </ThemeProvider>
  )
}

export default Playground