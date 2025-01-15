import React, { useEffect, useState } from 'react'
import { Box, Button, Tab, Tabs } from '@mui/material'
import PlaygroundBlock from '@/components/Playground/PlaygroundBlock'
import useMonstersStore, { fetchMonsters } from '@/store/useMonstersStore'
import useWeaponsStore, { fetchWeapons } from '@/store/useWeaponsStore'
import AmawLastHunt from '@/components/AmawLastHunt'
import AmawTracker from '@/components/AmawTracker'
import { ArrowLeftStartOnRectangleIcon } from '@heroicons/react/24/solid'

function PlaygroundAmaw() {
  const [tabValue, setTabValue] = useState(0)
  const monsters = useMonstersStore((state) => state.monsters)
  const weapons = useWeaponsStore((state) => state.weapons)

  useEffect(() => {
    fetchMonsters()
    fetchWeapons()
  }, [])

  const handleTabChange = (event: React.SyntheticEvent, newValue: number) => {
    setTabValue(newValue)
  }

  return (
    <div className="w-[1200px] max-w-full flex flex-col gap-6">
      <Box sx={{ borderBottom: 1, borderColor: 'divider' }}>
        <Tabs value={tabValue} onChange={handleTabChange} aria-label="basic tabs example">
          <Tab label="AMAW Last Hunt" id={`simple-tab-0`}/>
          <Tab label="AMAW Tracker" id={`simple-tab-1`}/>
        </Tabs>
      </Box>
      <PlaygroundBlock
        title="AMAW Last Hunt"
        tabValue={tabValue}
        value={0}
        endButton={<Button><ArrowLeftStartOnRectangleIcon/></Button>}
      >
        <AmawLastHunt monsters={monsters} weapons={weapons} />
      </PlaygroundBlock>
      <PlaygroundBlock title="AMAW Tracker" tabValue={tabValue} value={1}>
        <AmawTracker monsters={monsters} weapons={weapons} />
      </PlaygroundBlock>
    </div>
  )
}

export default PlaygroundAmaw