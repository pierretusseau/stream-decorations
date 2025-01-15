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
  const [inAnim, setInAnim] = useState<boolean>(true)

  const handleNewHunt = useCallback(() => {
    setCurrentHunt(null)
    setTimeout(() => {
      setCurrentHunt(huntsStore.slice(-1)[0])
      setInAnim(true)
    }, 100);
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

  // const lastHunt = huntsStore.slice(-1)[0] || null
  const lastHunt = currentHunt

  if (!lastHunt) return  null

  const lastHuntMonster = monsters.find(monster => monster.id === lastHunt.monster)
  const lastHuntWeapon = weapons.find(weapon => weapon.id === lastHunt.weapon)

  if (!lastHuntMonster || !lastHuntWeapon) return null

  return <LastHuntContainer
    hunt={lastHunt}
    weapon={lastHuntWeapon}
    monster={lastHuntMonster}
    inAnim={inAnim}
    outAnim={outAnim}
    setOutAnim={setOutAnim}
    setInAnim={setInAnim}
    handleNewHunt={handleNewHunt}
  />
}

export default AmawLastHunt

const LastHuntContainer = ({
  hunt,
  weapon,
  monster,
  inAnim,
  outAnim,
  setOutAnim,
  setInAnim,
  handleNewHunt,
}: {
  hunt: Hunt
  weapon: Weapon
  monster: Monster
  inAnim: boolean
  outAnim: boolean
  setOutAnim: React.Dispatch<React.SetStateAction<boolean>>
  setInAnim: React.Dispatch<React.SetStateAction<boolean>>
  handleNewHunt: () => void
}) => {
  const containerRef = useRef(null)
  const timerRef = useRef(null)
  const questRef = useRef(null)
  const monsterRef = useRef(null)
  const weaponRef = useRef(null)

  useGSAP(() => {
    if (!inAnim) return
    const tl = gsap.timeline({
      onComplete: () => setInAnim(false)
    })
    console.log(monster.name, 'should display !')
    
    if (!timerRef.current) return
    const splitTimer = new SplitType(timerRef.current, { types: 'chars' })
    tl.set(containerRef.current, {opacity: 1})
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
  }, {
    dependencies: [inAnim, timerRef.current]
  })

  console.log('outAnim', outAnim)
  useGSAP(() => {
    if (!outAnim) return
    const tl = gsap.timeline({
      onComplete: () => {
        setOutAnim(false)
        handleNewHunt()
      }
    })
    tl.to(containerRef.current, { opacity: 0, duration: 2 })
  }, [outAnim])

  return (
    <div ref={containerRef} className="flex gap-4 w-[500px] pr-[20px]">
      <div className="relative flex flex-col gap-2 items-center">
        <div className="relative overflow-hidden p-5">
          <div ref={monsterRef} className="opacity-0">
            <MonsterImage
              monster={monster}
              size={200}
              className="drop-shadow-[0_0_10px_rgba(0,0,0,1)]"
            />
          </div>
        </div>
        <p
          className="m-0 text-4xl font-bold opacity-0"
          ref={timerRef}
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
        <p className="m-0" ref={questRef}>{monster.quest}</p>
      </div>
    </div>
  )
}