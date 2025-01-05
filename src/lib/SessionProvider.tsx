'use client'

import type { Session } from "next-auth"
import { SessionProvider } from "next-auth/react"

declare global {
  type TwitchSession = {
    accessToken: string
  } & Session
}

export default function Provider ({
  children,
  session
}: {
  children: React.ReactNode
  session: TwitchSession | null
}): React.ReactNode {
  return <SessionProvider session={session}>
    {children}
  </SessionProvider>
}