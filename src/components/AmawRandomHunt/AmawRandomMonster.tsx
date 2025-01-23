import React, { useCallback, useRef, useState } from 'react'
import Image from 'next/image'
import MonsterImage from '@/components/common/MonsterImage'
import type { RandomMonster } from '@/components/AmawRandomHunt'
import useHuntStore from '@/store/useHuntStore'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useMonstersStore from '@/store/useMonstersStore'

gsap.registerPlugin(useGSAP)

const shuffleArray = (array: unknown[]) => {
  const tempArray = [...array]
  for (let i = tempArray.length - 1; i >= 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    const temp = tempArray[i];
    tempArray[i] = tempArray[j];
    tempArray[j] = temp;
  }
  return tempArray as RandomMonster[]
}

function AmawRandomMonster({
  size = 100,
  rolling,
  setRolling,
  setRandomMonster,
  weapons,
}: {
  size?: number
  rolling: boolean
  setRolling: React.Dispatch<React.SetStateAction<boolean>>
  setRandomMonster: React.Dispatch<React.SetStateAction<RandomMonster | undefined>>
  weapons: Weapon[]
}) {
  const monsters = useMonstersStore((state) => state.monsters)
  const hunts = useHuntStore((state) => state.hunts)
  const [randomMonsters, setRandomMonsters] = useState<RandomMonster[]>([])
  const [init, setInit] = useState<boolean>(false)

  const monstersRef = useRef(null)
  const questionRef = useRef(null)

  const unlockedMonsters = monsters.filter(monster => monster.unlocked)

  const getRemainingHunts = useCallback((unlockedMonsters: Monster[]) => {
    return unlockedMonsters
      .map(monster => {
        const remainingWeaponsForMonster = weapons.filter(weapon => {
          return !hunts.some(hunt => hunt.monster === monster.id && hunt.weapon === weapon.id)
        })
      return {
        ...monster,
        remainingWeapons: remainingWeaponsForMonster
      }
    }).filter(monster => monster.remainingWeapons.length > 0) as RandomMonster[]
  }, [hunts, weapons])
  
  const handleRandomHunt = useCallback(() => {
    const remainingHunts = getRemainingHunts(unlockedMonsters)
    const firstArray = randomMonsters.length > 0
      ? randomMonsters.slice((remainingHunts.length * -1))
      : shuffleArray(remainingHunts)
    const fullRandomMonsters = [
      ...firstArray,
      ...shuffleArray(remainingHunts),
      ...shuffleArray(remainingHunts),
      ...shuffleArray(remainingHunts),
      ...shuffleArray(remainingHunts),
    ]
    setRandomMonsters(fullRandomMonsters)
  }, [getRemainingHunts, unlockedMonsters, randomMonsters])

  useGSAP(() => {
    if (!rolling || init) return
    const tl = gsap.timeline()
    tl.to(questionRef.current, {
      opacity: 0, y: -50, duration: 0.25
    })
    tl.call(() => {
      handleRandomHunt()
    })
  }, [rolling])
  useGSAP(() => {
    if (!rolling || randomMonsters.length === 0) return
    const tl = gsap.timeline()
    tl.call(() => {
      setRolling(false)
      setRandomMonster(undefined)
    })
    if (!init) {
      tl.to(monstersRef.current, {
        opacity: 1, y: 0, duration: 1
      })
      tl.call(() => setInit(true))
    }
    tl.to(monstersRef.current, {
      y: ((randomMonsters.length - 1) * -size),
      ease: 'power1.inOut', duration: 5,
    })
    tl.to(monstersRef.current, { opacity: 0, duration: 0.2 })
    tl.call(() => setRandomMonster(randomMonsters[randomMonsters.length - 1]))
    tl.call(() => handleRandomHunt())
    tl.set(monstersRef.current, {
      y: ((getRemainingHunts(unlockedMonsters).length - 1) * -size),
    })
    tl.to(monstersRef.current, { opacity: 1, duration: 1, ease: 'power1.out' })
  }, [rolling, randomMonsters, unlockedMonsters, init])

  return (
    <div
      className={[
        // "bg-red-300",
        "relative",
        "overflow-hidden"
      ].join(' ')}
      style={{ width: size, height: size}}
    >
      <div>
        {randomMonsters.length === 0 && <div
          className="flex justify-center items-center absolute top-0 left-0"
          style={{ width: size, height: size }}
          ref={questionRef}
        >
          <Image
            src='/question_mark.png'
            width={64}
            height={64}
            alt="Question Mark Icon"
          />
        </div>}
        <div
          ref={monstersRef}
          style={{ transform: `translateY(${size}px)` }}
          className="opacity-0"
        >
          {randomMonsters.map((monster, index) => {
            const monsterData = randomMonsters.find(m => m.id === monster.id)
            if (!monsterData) return null
            return <div
              style={{ width: size, height: size }}
              key={`random-monsters-${monster.id}-${index}`}
            >
              <MonsterImage monster={monsterData} size={size} />
            </div>
          })}
        </div>
      </div>
    </div>
  )
}

export default AmawRandomMonster