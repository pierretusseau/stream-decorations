import React from 'react'
import Image from 'next/image'
import { monsterNameParser } from '@/utils/utils'

function MonsterImage({
  monster,
  size = 50,
  className = '',
  border,
  contain = false
}: {
  monster: Monster
  size?: number
  className?: string
  border?: number
  contain?: boolean
}) {
  const borderStyle = {
    filter: `
      drop-shadow(${border}px ${border}px ${border}px rgba(0,0,0,0.3))
      drop-shadow(-${border}px ${border}px ${border}px rgba(0,0,0,0.3))
      drop-shadow(${border}px -${border}px ${border}px rgba(0,0,0,0.3))
      drop-shadow(-${border}px -${border}px ${border}px rgba(0,0,0,0.3))
    `
  }
  return (
    <Image
      src={`/mhw-monsters/${monsterNameParser(monster.name)}.png`}
      width={size}
      height={size}
      alt={`Icon of ${monster.name}`}
      className={`relative z-10 ${className} ${contain ? 'object-contain w-full h-full' : ''}`}
      title={`${monster.name} - ${monster.quest}`}
      style={
        border ? {...borderStyle} : {}
      }
    />
  )
}

export default MonsterImage