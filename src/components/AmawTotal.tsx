'use client'

import useHuntStore, { fetchHunts, subscribeToHunts } from '@/store/useHuntStore'
import React, { useEffect } from 'react'

function AmawTotal({
  monsters,
  weapons,
}: {
  monsters: { id: number }[]
  weapons: { id: number }[]
}) {
  const hunts = useHuntStore((state) => state.hunts)

  const total_monsters = monsters.length
  const total_weapons = weapons.length
  const total_hunts = total_monsters * total_weapons

  useEffect(() => {
    fetchHunts()
    subscribeToHunts()
  }, [])

  return (
    <div
      className="font-teko flex flex-col gap-0 items-center"
    >
      <p
        className="font-bold text-[100px] leading-[100px]"
        style={{
          textShadow: `
                      2px 2px 0px rgba(0,0,0,1),
                      -2px -2px 0px rgba(0,0,0,1),
                      -2px 2px 0px rgba(0,0,0,1),
                      2px -2px 0px rgba(0,0,0,1)`
        }}
      >{hunts.length} / {total_hunts}</p>
      <p
        className="font-light text-[70px] leading-[70px]"
        style={{
          textShadow: `
                      1px 1px 1px #000,
                      -1px -1px 1px #000,
                      -1px 1px 1px #000,
                      1px -1px 1px #000`
        }}
      >
        {Math.floor((hunts.length * 100) / total_hunts)}%
      </p>
    </div>
  )
}

export default AmawTotal