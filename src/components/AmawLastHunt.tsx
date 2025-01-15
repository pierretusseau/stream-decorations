'use client'

import React, { useEffect, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useHuntStore, { fetchHunts, subscribeToHunts } from '@/store/useHuntStore'
import Stars from '@/components/AmawLastHunt/Stars'
import MonsterImage from '@/components/common/MonsterImage'
import WeaponImage from '@/components/common/WeaponImage'
import SplitType from 'split-type'

gsap.registerPlugin(useGSAP)

function AmawLastHunt({
  monsters,
  weapons
}: {
  monsters: Monster[]
  weapons: Weapon[]
}) {
  const timerRef = useRef(null)
  const questRef = useRef(null)
  const monsterRef = useRef(null)
  const weaponRef = useRef(null)

  useEffect(() => {
    fetchHunts()
    subscribeToHunts()
  }, [])

  useGSAP(() => {
    const tl = gsap.timeline()
    
    if (!timerRef.current) return
    const splitTimer = new SplitType(timerRef.current, { types: 'chars' })
    tl.set(splitTimer.chars, { opacity: 0 })
    tl.set(timerRef.current, { opacity: 1 })
    tl.fromTo(monsterRef.current, {
      opacity: 0, x: "100%"
    }, {
      opacity: 1, x: "0%",
      duration: 1, ease: 'power1.out'
    })
    tl.fromTo(weaponRef.current, {
      opacity: 0, x: "100%"
    }, {
      opacity: 1, x: "0%",
      duration: 1, ease: 'power1.out'
    }, "<0.2")
    tl.fromTo(splitTimer.chars, {
      x: 10, opacity: 0,
    }, {
      x: 0, opacity: 1,
      duration: 2, stagger: 0.05
    }, "<1")
    tl.fromTo(questRef.current, {
      opacity: 0, y: 20
    }, {
      opacity: 1, y: 0,
      duration: 1
    }, "<0.1")
  })

  const huntsStore = useHuntStore((state) => state.hunts)
  const lastHunt = huntsStore.slice(-1)[0] || null

  if (!lastHunt) return  null

  const lastHuntMonster = monsters.find(monster => monster.id === lastHunt.monster)
  const lastHuntWeapon = weapons.find(weapon => weapon.id === lastHunt.weapon)

  if (!lastHuntMonster || !lastHuntWeapon) return null

  return (
    <div className="flex gap-4 w-[500px] pr-[20px]">
      <div className="relative flex flex-col gap-2 items-center">
        <div className="relative overflow-hidden">
          <div ref={monsterRef} className="opacity-0">
            <MonsterImage
              monster={lastHuntMonster}
              size={200}
              className="drop-shadow-[0_0_10px_rgba(0,0,0,1)]"
            />
          </div>
        </div>
        <p
          className="m-0 text-4xl font-bold opacity-0"
          ref={timerRef}
        >{lastHunt.time}</p>
        <div className="absolute top-0 translate-x-3/4 -translate-y-1/3 overflow-hidden">
          <div ref={weaponRef}>
            <WeaponImage
              weapon={lastHuntWeapon}
              size={120}
              className="bg-neutral-950 rounded-full p-2"
            />
          </div>
        </div>
      </div>
      <div className="text-xl font-bold flex flex-col gap-2 pt-20">
        <Stars monster={lastHuntMonster} />
        <p className="m-0" ref={questRef}>{lastHuntMonster.quest}</p>
      </div>
    </div>
  )
}

export default AmawLastHunt