import React, { useRef } from 'react'
import Image from 'next/image'
import { monsterNameParser } from '@/utils/utils'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function Hunt({
  monster,
  weapon,
  hunt,
  outAnim,
  inAnim,
}: {
  monster: Monster
  weapon: Weapon
  hunt: Hunt
  outAnim?: boolean
  inAnim?: boolean
}) {
  const huntRef = useRef(null)

  useGSAP(() => {
    if (!outAnim) return
    const tl = gsap.timeline()
    tl.to(huntRef.current, { opacity: 0, duration: 1 }, '0.25')
  }, {
    dependencies: [outAnim],
    revertOnUpdate: true
  })

  useGSAP(() => {
    if (!inAnim) return
    const tl = gsap.timeline()
    tl.fromTo(huntRef.current, { opacity: 0 }, { opacity: 1, duration: 1 }, '0.25')
  }, {
    dependencies: [inAnim],
    revertOnUpdate: true
  })

  return (
    <div
      ref={huntRef}
      className="group/hunt flex flex-col gap-2 items-center px-4 mx-4"
    >
      <div className="group/hunt-images relative">
        <Image
          src={`/mhw-monsters/${monsterNameParser(monster.name)}.png`}
          width={120}
          height={120}
          alt={`Icon of ${monster.name}`}
          className="group/monster-image"
        />
        <Image
          src={`/mhw-weapons/${weapon.acronym}.svg`}
          width={100}
          height={100}
          alt={`Icon of ${weapon.name}`}
          className="group/weapon-image absolute bottom-10 -right-12 bg-neutral-950 rounded-full p-4 scale-90"
        />
      </div>
      <p className="font-bold text-xl">{hunt.time}</p>
    </div>
  )
}

export default Hunt