import React from 'react'
import Image from 'next/image'

function WeaponImage({
  weapon,
  size = 50,
  className
}: {
  weapon: Weapon
  size?: number
  className?: string
}) {
  return (
    <Image
      src={`/mhw-weapons/${weapon.acronym}.svg`}
      width={size}
      height={size}
      alt={`Icon of ${weapon.name}`}
      className={`relative z-10 ${className}`}
      title={`${weapon.name}`}
    />
  )
}

export default WeaponImage