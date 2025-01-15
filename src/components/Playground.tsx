'use client'

import React, { useState } from 'react'
import useSettingsStore from '@/store/useSettingsStore'
import Header from '@/components/Header';
import { ThemeProvider } from '@emotion/react'
import { Box, createTheme, Tab, Tabs } from '@mui/material';
import PlaygroundAlerts from '@/components/Playground/PlaygroundAlerts';
import AlertTester from '@/components/Playground/AlertTester';
import PlaygroundAmaw from './Playground/PlaygroundAmaw';

const darkTheme = createTheme({
  palette: {
    mode: 'dark',
  },
});

function Playground() {
  const serviceKey = useSettingsStore((state) => state.supabase_decorations_service_key)
  const [tabValue, setTabValue] = useState(0)

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <ThemeProvider theme={darkTheme}>
    <div className="bg-neutral-950 text-neutral-50 min-h-screen flex flex-col gap-10">
      <Header />
      <main className="bg-neutral-900 w-full max-w-screen-xl mx-auto flex flex-col gap-4 mb-[1200px]">
        <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
          <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
            <Tab label="Alerts" id={`simple-tab-0`}/>
            <Tab label="AMAW" id={`simple-tab-1`}/>
          </Tabs>
        </Box>
        <div role="tabpanel" hidden={tabValue !== 0}>
          {serviceKey && <AlertTester serviceKey={serviceKey} />}
          <PlaygroundAlerts />
        </div>
        <div role="tabpanel" hidden={tabValue !== 1}>
          <PlaygroundAmaw />
        </div>
      </main>
    </div>
    </ThemeProvider>
  )
}

export default Playground