import React from 'react'
import MonsterImage from '@/app/components/common/MonsterImage'

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
      <div
        className="bg-green-900 opacity-75 w-full absolute bottom-0 left-0 z-0"
        style={{ height: `${(100 / 14) * hunts.length}%` }}
      ></div>
      <p className="p-0 font-teko text-3xl absolute right-1 -bottom-1 drop-shadow-[0_0_2px_rgba(0,0,0,0.8)] z-10">{hunts.length}/14</p>
    </div>
  )
}

export default MonsterCard