'use client'

import React, { useEffect } from 'react'
import useHuntStore, {
  fetchHunts,
  subscribeToHunts
} from '@/store/useHuntStore'
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

  const limitedHunts = hunts.slice(-10)

  return (
    <div
      className="p-2 pt-8 pl-0 flex gap-8 items-center"
      style={{
        height: 200,
        width: screen_width - cam_width
      }}
    >
      {/* <h1 className="text-2xl">Last hunts</h1> */}
      <div className="w-[1650px] h-[200px] overflow-hidden relative">
        <div className="flex gap-8 items-end absolute left-0 bottom-6 w-[1800px]">
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
    </div>
  )
}

export default AmawTracker