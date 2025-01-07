"use client";

import useTwitchStore from "@/store/useTwitchStore";
import { Button } from "@mui/material";
import { useCallback } from "react";
import { BsTwitch } from "react-icons/bs";

const Login = ({
  setOpenModal
}: {
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
}) => {
  const twitchAuthState = useTwitchStore((state) => state.twitch_auth_state)

  const requiredScopes = [
    "channel:read:subscriptions",
    "moderator:read:followers",
    "user:manage:whispers"
  ]

  const baseURI = 'https://id.twitch.tv/oauth2/authorize'
  const params =  new URLSearchParams({
    'response_type': "code",
    "client_id": process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
    "scope": requiredScopes.join(' '),
    "redirect_uri": "http://localhost:3000/api/auth/callback/twitch",
    "state": twitchAuthState,
  })

  const handleSignIn = useCallback((e: React.MouseEvent<HTMLAnchorElement, MouseEvent>) => {
    if (!twitchAuthState) {
      console.log('No State code found!')
      e.preventDefault()
      setOpenModal(true)
    }
  }, [twitchAuthState, setOpenModal])

  return (
    <Button
      className="flex items-center gap-5a"
      onClick={(e) => handleSignIn(e)}
      href={`${baseURI}?${params}`}
      startIcon={<BsTwitch className="h-4 w-4" />}
      style={{
        backgroundColor: 'rgb(109 40 217 / var(--tw-bg-opacity, 1))',
        color: 'white'
      }}
    >
      Sign in
    </Button>
  )
}

export default Login;