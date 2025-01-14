'use client'

import React from 'react'
import FollowerAlert from '@/components/Twitch/Alert/FollowerAlert'
import Header from '@/components/Header';
import { ThemeProvider } from '@emotion/react'
import { createTheme } from '@mui/material';
import AlertBlock from '@/components/Playground/AlertBlock'
import SubAlert from '@/components/Twitch/Alert/SubAlert'

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Playground() {
  return (
    <ThemeProvider theme={darkTheme}>
    <div className="bg-neutral-950 text-neutral-50 min-h-screen flex flex-col gap-10">
      <Header />
      <main className="bg-neutral-900 max-w-screen-2xl mx-auto flex flex-col gap-4 mb-20">
        <div className="w-[1200px] max-w-full flex flex-col gap-6">
          <AlertBlock title="Follower">
            <FollowerAlert
              alert={{
                type: "follower",
                user_name: "VeryLongNicknameForTests"
              }}
            />
          </AlertBlock>
          <AlertBlock title="First Sub + Prime">
            <SubAlert
              alert={{
                type: "sub",
                user_name: "VeryLongNicknameForTests",
                notice_type: 'sub',
                sub: {
                  duration_months: 1,
                  sub_tier: "2000",
                  is_prime: true,
                }
              }}
            />
          </AlertBlock>
          <AlertBlock title="Resub T2 100 Months">
            <SubAlert
              alert={{
                type: "sub",
                user_name: "VeryLongNicknameForTests",
                notice_type: 'resub',
                resub: {
                  cumulative_months: 100,
                  duration_months: 6,
                  streak_months: 94,
                  sub_tier: "2000",
                  is_prime: false,
                  is_gift: false,
                  gifter_is_anonymous: null,
                  gifter_user_id: null,
                  gifter_user_name: null,
                  gifter_user_login: null,
                }
              }}
            />
          </AlertBlock>
        </div>
      </main>
    </div>
    </ThemeProvider>
  )
}

export default Playground