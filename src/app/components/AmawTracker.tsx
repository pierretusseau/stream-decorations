'use client'

import React, { useEffect } from 'react'
import useHuntStore, {
  // setHunts
  fetchHunts,
  subscribeToHunts
} from '@/app/store/useHuntStore'
import Hunt from '@/app/components/AmawTracker/Hunt'

const screen_width = 2560
const cam_width = 432

function AmawTracker({
  monsters,
  weapons,
}: {
  monsters: Monster[]
  weapons: Weapon[]
}) {
  const hunts = useHuntStore((state) => state.hunts)

  useEffect(() => {
    fetchHunts()
    subscribeToHunts()
  }, [])
  
  if (!hunts || hunts.length === 0) return null

  console.log('weapons', weapons)
  console.log('monsters', monsters)
  console.log('hunts', hunts)

  const limitedHunts = hunts.slice(Math.max(hunts.length - 10, 0))

  return (
    <div
      className="bg-neutral-800 p-2 pt-8 pl-10 flex gap-8 items-center"
      style={{
        height: 200,
        width: screen_width - cam_width
      }}
    >
      <h1 className="text-2xl">Last hunts</h1>
      <div className="flex gap-8 items-center">
        {limitedHunts.map(hunt => {
          const monster = monsters.find(monster => monster.id === hunt.monster)
          const weapon = weapons.find(weapon => weapon.id === hunt.weapon)

          if (!monster || !weapon) return null
          return <Hunt
            key={hunt.id}
            monster={monster}
            weapon={weapon}
            hunt={hunt}
          />
        })}
      </div>
    </div>
  )
}

export default AmawTracker