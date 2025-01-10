'use client';

import React, { useEffect } from 'react'
import useHuntStore, { fetchHunts, subscribeToHunts } from '@/store/useHuntStore'
import WeaponCard from '@/components/AmawWeapons/WeaponCard'
import { fetchMonsters } from '@/store/useMonstersStore';

function AmawWeapons({
  weapons
}: {
  weapons: Weapon[]
}) {
  const storeHunts = useHuntStore((state) => state.hunts)

  useEffect(() => {
    fetchHunts()
    subscribeToHunts()
    fetchMonsters()
  }, [])

  const amawWeaponsStyles = [
    "flex flex-wrap w-[220px] gap-4 justify-center"
  ].join(' ')
  
  return (
    <div className={`group/amaw-weapons ${amawWeaponsStyles}`}>
      {weapons.map(weapon => {
        const weaponHunts = storeHunts.filter(hunt => hunt.weapon === weapon.id)
        return <WeaponCard
          key={`weapon-${weapon.id}`}
          weapon={weapon}
          hunts={weaponHunts}
        />
      })}
    </div>
  )
}

export default AmawWeapons