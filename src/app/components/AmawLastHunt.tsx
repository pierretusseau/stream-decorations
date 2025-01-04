'use client'

import React, { useEffect } from 'react'
import useHuntStore, { fetchHunts, subscribeToHunts } from '@/store/useHuntStore'
import Stars from './AmawLastHunt/Stars'
import MonsterImage from './common/MonsterImage'
import WeaponImage from './common/WeaponImage'

function AmawLastHunt({
  monsters,
  weapons
}: {
  monsters: Monster[]
  weapons: Weapon[]
}) {
  console.log('lol ?')
  useEffect(() => {
    fetchHunts()
    subscribeToHunts()
  }, [])

  const huntsStore = useHuntStore((state) => state.hunts)
  const lastHunt = huntsStore.slice(-1)[0] || null

  if (!lastHunt) return  null

  const lastHuntMonster = monsters.find(monster => monster.id === lastHunt.monster)
  const lastHuntWeapon = weapons.find(weapon => weapon.id === lastHunt.weapon)

  console.log(lastHunt)

  if (!lastHuntMonster || !lastHuntWeapon) return null

  return (
    <div className="flex gap-4 w-[500px] pr-[20px]">
      <div className="flex flex-col gap-2 items-center">
        <MonsterImage
          monster={lastHuntMonster}
          size={200}
          className="drop-shadow-[0_0_10px_rgba(0,0,0,1)]"
        />
        <p className="m-0 text-4xl font-bold">{lastHunt.time}</p>
      </div>
      <div className="text-xl font-bold flex flex-col gap-2">
        <WeaponImage
          weapon={lastHuntWeapon}
          size={120}
          className="absolute bg-neutral-950 rounded-full p-2 right-20"
        />
        <Stars monster={lastHuntMonster} />
        <p className="m-0">{lastHuntMonster.quest}</p>
      </div>
    </div>
  )
}

export default AmawLastHunt