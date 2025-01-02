import React from 'react'
import Image from 'next/image'

function WeaponHeaderCell({
  weapon
}: {
  weapon: Weapon
}) {
  return (
    <div
      className="flex items-center justify-center"
      style={{
        width: `${100/14}%`
      }}
    >
      <Image
          src={`/mhw-weapons/${weapon.acronym}.svg`}
          width={50}
          height={50}
          alt={`Icon of ${weapon.name}`}
          className=""
        />
    </div>
  )
}

export default WeaponHeaderCell