import React from 'react'
import MonsterImage from '@/components/common/MonsterImage'
import { CheckBadgeIcon } from '@heroicons/react/24/solid'
import ProgressionBackground from '../common/ProgressionBackground'

function MonsterCard({
  monster,
  hunts,
}: {
  monster: Monster
  hunts: Hunt[]
}) {
  const monsterCardStyles = [
    "relative overflow-hidden",
    "bg-neutral-900 border-2 rounded-lg",
    monster.unlocked
      ? monster.quest_level
        ? "border-orange-500"
        : "border-yellow-500"
      : "opacity-50",
    "pb-[12px] pt-2 px-[14px]",
    "flex flex-col items-center justify-center text-center gap-2"
  ].join(' ')

  return (
    <div className={`${monsterCardStyles}`}>
      <MonsterImage
        monster={monster}
        size={75}
      />
      <ProgressionBackground
        value={hunts.length}
        total={14}
      />
      {hunts.length < 14
        ? <p className={`${[
          "p-0 font-teko text-3xl drop-shadow-[0_0_1px_rgba(0,0,0,1)] z-10",
          "absolute right-1 -bottom-1"
        ].join(' ')}`}>{hunts.length}/14</p>
        : <div className="bg-green-500 absolute bottom-0 right-0 z-10 px-3 py-1 rounded-tl-xl"><CheckBadgeIcon className="size-6"/></div>
      }
    </div>
  )
}

export default MonsterCard