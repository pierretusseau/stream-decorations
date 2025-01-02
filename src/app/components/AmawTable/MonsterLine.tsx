import React from 'react'
import Image from 'next/image'
import { monsterNameParser } from '@/utils/utils'
import useHuntStore from '@/store/useHuntStore'
import HuntCell from '@/app/components/AmawTable/HuntCell'

function MonsterLine({
  monster,
  weapons
}: {
  monster: Monster
  weapons: Weapon[]
}) {
  const hunts = useHuntStore((state) => state.hunts)
  const monsterHunts = hunts.filter(hunt => hunt.monster === monster.id)

  return (
    <div
      className="group/monster-line bg-neutral-950 flex w-full py-2 pl-2 hover:bg-neutral-900 transition"
    >
      <div className="group/monster-line-img w-[50px] mr-2 flex items-center">
        <Image
          src={`/mhw-monsters/${monsterNameParser(monster.name)}.png`}
          width={50}
          height={50}
          alt={`Icon of ${monster.name}`}
          className="group/monster-image"
        />
      </div>
      {weapons.map((weapon, index: number) => {
        const weaponHunt = monsterHunts.find(hunt => hunt.weapon === weapon.id)
        return <HuntCell
          key={`amaw-table-${monster.id}-${weapon.id}-${weaponHunt?.id || index}`}
          weapon={weapon}
          monster={monster}
          hunt={weaponHunt}
        />}
      )}
    </div>
  )
}

export default MonsterLine