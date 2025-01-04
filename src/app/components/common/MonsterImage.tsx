import React from 'react'
import Image from 'next/image'
import { monsterNameParser } from '@/utils/utils'

function MonsterImage({
  monster,
  size = 50,
  className = ''
}: {
  monster: Monster
  size?: number
  className?: string
}) {
  return (
    <Image
      src={`/mhw-monsters/${monsterNameParser(monster.name)}.png`}
      width={size}
      height={size}
      alt={`Icon of ${monster.name}`}
      className={`relative z-10 ${className}`}
      title={`${monster.name} - ${monster.quest}`}
    />
  )
}

export default MonsterImage