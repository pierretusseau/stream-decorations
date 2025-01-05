"use client";

import { Button } from "@mui/material";
import { useSession, signIn, signOut } from "next-auth/react";
import { BsTwitch } from "react-icons/bs";

const Login = () => {
  const { data: session } = useSession();

  if (session) {
    return (
      <Button
        className="flex items-center gap-5a"
        onClick={() => signOut()}
        startIcon={<BsTwitch className="h-4 w-4" />}
        style={{
          backgroundColor: 'rgb(109 40 217 / var(--tw-bg-opacity, 1))',
          color: 'white'
        }}
      >
        Log out
      </Button>
    );
  } else {
    return (
      <Button
        className="flex items-center gap-5a"
          onClick={() => signIn()}
        startIcon={<BsTwitch className="h-4 w-4" />}
        style={{
          backgroundColor: 'rgb(109 40 217 / var(--tw-bg-opacity, 1))',
          color: 'white'
        }}
      >
          Sign in
      </Button>
    );
  }
};

export default Login;