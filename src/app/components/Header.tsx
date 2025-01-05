import React from 'react'
import TwitchLogin from "@/app/components/TwitchLogin";
import { Button } from '@mui/material'
import { useSession } from 'next-auth/react';
import { Cog6ToothIcon } from '@heroicons/react/24/solid';

function Header() {
  const { data: session } = useSession()

  return (
    <header className="flex justify-between py-2 px-10">
      <div>
        <Button
          href="/"
        >Home</Button>
      </div>
      <div className="flex items-center gap-4">
        {session && <Button
          href="/twitch-handler"
          className="flex gap-2 items-center"
        ><Cog6ToothIcon className="size-4"/> Twitch</Button>}
        <TwitchLogin />
      </div>
    </header>
  )
}

export default Header