import React from 'react'
import WeaponImage from '../common/WeaponImage'
import ProgressionBackground from '../common/ProgressionBackground'
import useMonstersStore from '@/store/useMonstersStore'

function WeaponCard({
  weapon,
  hunts
}: {
  weapon: Weapon
  hunts: Hunt[]
}) {
  const monstersStore = useMonstersStore((state) => state.monsters)

  const weaponCardStyles = [
    "relative rounded-2xl",
    "w-[100px] pt-2",
    "bg-neutral-900",
    "overflow-hidden"
  ].join(' ')

  return (
    <div
      className={`group/weapon-card ${weaponCardStyles}`}
    >
      <div className="flex justify-center">
        <WeaponImage
          weapon={weapon}
          size={60}
          className="drop-shadow-[0_0_3px_rgba(0,0,0,1)]"
        />
        <ProgressionBackground
          value={hunts.length}
          total={monstersStore.length}
        />
      </div>
      <div className="font-teko text-3xl text-center relative">
        {hunts.length} / {monstersStore.length}
      </div>
    </div>
  )
}

export default WeaponCard