'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
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
  const huntsStore = useHuntStore((state) => state.hunts)
  const [prevHunts, setPrevHunts] = useState<Hunt[]>([])
  const [currentHunt, setCurrentHunt] = useState<Hunt|null>()
  const [outAnim, setOutAnim] = useState<boolean>(false)

  const handleNewHunt = useCallback(() => {
    setOutAnim(false)
    setCurrentHunt(null)
    setTimeout(() => {
      setCurrentHunt(huntsStore.slice(-1)[0])
    }, 500);
  }, [huntsStore])

  if (huntsStore.length > 0) {
    if (huntsStore !== prevHunts) {
      // Update prevHunts to stop the rerendering
      setPrevHunts(huntsStore)
      // When store updates
      if (currentHunt) {
        if (currentHunt.id !== huntsStore.slice(-1)[0].id) {
          // If the hunt we receive is different from the store one then animOut
          // Animate old one out
          setOutAnim(true)
        }
      } else {
        // Else we need to define the next hunt
        setCurrentHunt(huntsStore.slice(-1)[0])
      }
    }
  } else {
    console.log('Waiting for huntsStore to init')
  }

  useEffect(() => {
    fetchHunts()
    subscribeToHunts()
  }, [])

  const lastHunt = currentHunt

  if (!lastHunt) return  null

  const lastHuntMonster = monsters.find(monster => monster.id === lastHunt.monster)
  const lastHuntWeapon = weapons.find(weapon => weapon.id === lastHunt.weapon)

  if (!lastHuntMonster || !lastHuntWeapon) return null

  return <LastHuntContainer
    hunt={lastHunt}
    weapon={lastHuntWeapon}
    monster={lastHuntMonster}
    outAnim={outAnim}
    handleNewHunt={handleNewHunt}
  />
}

export default AmawLastHunt

const LastHuntContainer = ({
  hunt,
  weapon,
  monster,
  outAnim,
  handleNewHunt,
}: {
  hunt: Hunt
  weapon: Weapon
  monster: Monster
  outAnim: boolean
  handleNewHunt: () => void
}) => {
  const containerRef = useRef(null)
  const timerRef = useRef(null)
  const questRef = useRef(null)
  const monsterRef = useRef(null)
  const weaponRef = useRef(null)

  useGSAP(() => {
    if (outAnim) return
    if (!timerRef.current) return

    const tl = gsap.timeline()
    const splitTimer = new SplitType(timerRef.current, { types: 'chars' })
    tl.set(containerRef.current, { opacity: 1 })
    tl.set(timerRef.current, { opacity: 1 })
    tl.fromTo(monsterRef.current, {
      opacity: 0, x: "110%"
    }, {
      opacity: 1, x: "0%",
      duration: 2, ease: 'power1.out'
    })
    tl.fromTo(weaponRef.current, {
      opacity: 0, rotate: 360, x: "110%"
    }, {
      opacity: 1, rotate: 0, x: "0%",
      duration: 1, ease: 'power1.out'
    }, "<0.5")
    tl.fromTo(questRef.current, {
      opacity: 0, y: 20
    }, {
      opacity: 1, y: 0,
      duration: 1
    }, "1")
    tl.fromTo(splitTimer.chars, {
      y: -20, opacity: 0,
    }, {
      y: 0, opacity: 1,
      duration: 0.2, stagger: 0.05, ease: "power1.out"
    })
  }, {
    revertOnUpdate: true,
    dependencies: [outAnim, timerRef.current],
  })

  useGSAP(() => {
    if (!outAnim) return
    const tl = gsap.timeline({
      onComplete: () => handleNewHunt()
    })
    tl.to(containerRef.current, { x: '-150%', opacity: 0, duration: 1, ease: 'power1.in' })
    tl.to(weaponRef.current, { x: '-150%', rotation: -180, duration: 0.5, ease: 'power1.in'}, '0')
  }, [outAnim])

  return (
    <div ref={containerRef} className="flex gap-4 w-[500px] pr-[20px]">
      <div className="relative flex flex-col items-center">
        <div className="relative overflow-hidden p-5">
          <div ref={monsterRef} className="w-[200px] h-[200px]">
            <MonsterImage
              monster={monster}
              size={200}
              className="drop-shadow-[0_0_10px_rgba(0,0,0,1)] object-contain w-full h-full"
            />
          </div>
        </div>
        <p
          className="m-0 text-4xl font-bold relative bottom-2"
          ref={timerRef}
          style={{
            textShadow: `
                        2px 2px 2px #000,
                        -2px -2px 2px #000,
                        -2px 2px 2px #000,
                        2px -2px 2px #000`
          }}
        >{hunt.time}</p>
        <div className="absolute top-11 translate-x-3/4 -translate-y-1/3 overflow-hidden">
          <div ref={weaponRef}>
            <WeaponImage
              weapon={weapon}
              size={120}
              className="bg-neutral-950 rounded-full p-2"
            />
          </div>
        </div>
      </div>
      <div className="text-xl font-bold flex flex-col gap-2 pt-[150px]">
        <Stars monster={monster} />
        <p
          className="m-0"
          ref={questRef}
          style={{
            textShadow: `
                        2px 2px 2px #000,
                        -2px -2px 2px #000,
                        -2px 2px 2px #000,
                        2px -2px 2px #000`
          }}
        >{monster.quest}</p>
      </div>
    </div>
  )
}