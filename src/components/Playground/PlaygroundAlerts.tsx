import React, { useState } from 'react'
import PlaygroundBlock from '@/components/Playground/PlaygroundBlock'
import FollowerAlert from '@/components/Twitch/Alert/FollowerAlert'
import SubAlert from '@/components/Twitch/Alert/SubAlert'
import RaidAlert from '@/components/Twitch/Alert/RaidAlert'
import { Box, Tab, Tabs } from '@mui/material'

function PlaygroundAlerts() {
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <div className="w-[1200px] max-w-full flex flex-col gap-6">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="Follower" id={`simple-tab-0`}/>
          <Tab label="First Sub + Prime" id={`simple-tab-1`}/>
          <Tab label="Resub T2 100 Months" id={`simple-tab-2`}/>
          <Tab label="Gift x1 T3" id={`simple-tab-3`}/>
          <Tab label="Gift x20" id={`simple-tab-4`}/>
          <Tab label="Raid" id={`simple-tab-5`}/>
        </Tabs>
      </Box>
      <PlaygroundBlock title="Follower" tabValue={tabValue} value={0}>
        <FollowerAlert
          alert={{
            type: "follower",
            user_name: "VeryLongNicknameForTests"
          }}
        />
      </PlaygroundBlock>
      <PlaygroundBlock title="First Sub + Prime" tabValue={tabValue} value={1}>
        <SubAlert
          alert={{
            type: "sub",
            user_name: "VeryLongNicknameForTests",
            notice_type: 'sub',
            sub: {
              duration_months: 1,
              sub_tier: "1000",
              is_prime: true,
            }
          }}
        />
      </PlaygroundBlock>
      <PlaygroundBlock title="Resub T2 100 Months" tabValue={tabValue} value={2}>
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
      </PlaygroundBlock>
      <PlaygroundBlock title="Gift x1 T3" tabValue={tabValue} value={3}>
        <SubAlert
          alert={{
            type: "sub",
            user_name: "VeryLongNicknameForTests",
            notice_type: 'community_sub_gift',
            community_sub_gift: {
              id: '123456789',
              total: 1,
              cumulative_total: 20,
              sub_tier: "3000",
            }
          }}
        />
      </PlaygroundBlock>
      <PlaygroundBlock title="Gift x20" tabValue={tabValue} value={4}>
        <SubAlert
          alert={{
            type: "sub",
            user_name: "VeryLongNicknameForTests",
            notice_type: 'community_sub_gift',
            community_sub_gift: {
              id: '123456789',
              total: 20,
              cumulative_total: 20,
              sub_tier: "1000",
            }
          }}
        />
      </PlaygroundBlock>
      <PlaygroundBlock title="Raid" tabValue={tabValue} value={5}>
        <RaidAlert
          alert={{
            type: "raid",
            user_name: "VeryLongNicknameForTests",
            viewers: 1234
          }}
        />
      </PlaygroundBlock>
    </div>
  )
}

export default PlaygroundAlerts