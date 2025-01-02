import React from 'react'
import Image from 'next/image'
import { monsterNameParser } from '@/utils/utils'

function MonsterImage({
  monster,
  size = 50
}: {
  monster: Monster
  size?: number
}) {
  return (
    <Image
      src={`/mhw-monsters/${monsterNameParser(monster.name)}.png`}
      width={size}
      height={size}
      alt={`Icon of ${monster.name}`}
      className="relative z-10"
    />
  )
}

export default MonsterImage