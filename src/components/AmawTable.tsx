'use client'

import React, { useCallback, useEffect, useState } from 'react'
import {
  fetchHunts,
  subscribeToHunts
} from '@/store/useHuntStore'
import MonsterLine from '@/components/AmawTable/MonsterLine'
import WeaponHeaderCell from '@/components/AmawTable/WeaponHeaderCell'
import SettingsModal from '@/components/AmawTable/SettingsModal'
import { IconButton } from '@mui/material'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import useSettingsStore from '@/store/useSettingsStore'

function AmawTable({
  monsters,
  weapons
}: {
  monsters: Monster[]
  weapons: Weapon[]
}) {
  const [openModal, setOpenModal] = useState(false)
  const [adminMode, setAdminMode] = useState(false)
  const service_key = useSettingsStore((state) => state.supabase_service_key)

  const handleAdminShortcut = useCallback((e: KeyboardEvent) => {
    if (e.ctrlKey && e.key === "p") {
      console.log(`Admin mode activated`)
      e.preventDefault()
      setAdminMode(true)
    }
  }, [])

  useEffect(() => {
    document.addEventListener('keydown', (e) => handleAdminShortcut(e))
    return document.removeEventListener('keydown', handleAdminShortcut)
  }, [handleAdminShortcut])

  useEffect(() => {
    fetchHunts()
    // Prevent subscribe to WebSocket if no service_key is provided
    if (service_key.length) subscribeToHunts()
  }, [service_key])

  return (
    <div
      className={`group/amaw-table w-full flex flex-col gap-2 bg-neutral-800`}
    >
      <header className="group/amaw-table-header flex w-full pt-2 fixed bg-neutral-800 z-10 pb-2">
        <IconButton
          onClick={() => setOpenModal(true)}
          className={`${[
            "w-[50px]",
            adminMode ? "pointer-events-auto" : "pointer-events-none opacity-0"
          ].join(' ')}`}
        >
          <Cog6ToothIcon className="size-6 text-neutral-50" />
        </IconButton>
        <div className="flex w-full">
          {weapons.map(weapon => <WeaponHeaderCell key={`amaw-table-weapon-${weapon.id}`} weapon={weapon} />)}
        </div>
      </header>
      <div className="group/amaw-table-body flex flex-col pt-[68px]">
        {monsters.map(monster => <MonsterLine
          key={`amaw-table-monster-${monster.id}`}
          monster={monster}
          weapons={weapons}
        />)}
      </div>
      <SettingsModal
        open={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  )
}

export default AmawTable