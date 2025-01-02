'use client'

import React, { useEffect, useState } from 'react'
import {
  fetchHunts,
  subscribeToHunts
} from '@/store/useHuntStore'
import MonsterLine from '@/app/components/AmawTable/MonsterLine'
import WeaponHeaderCell from '@/app/components/AmawTable/WeaponHeaderCell'
import SettingsModal from '@/app/components/AmawTable/SettingsModal'
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
  const service_key = useSettingsStore((state) => state.supabase_service_key)

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
        <IconButton onClick={() => setOpenModal(true)} className="w-[50px] opacity-0 hover:opacity-100">
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