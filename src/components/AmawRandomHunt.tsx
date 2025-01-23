'use client'

import React, {
  useEffect,
  useState
} from 'react'
import { fetchMonsters } from '@/store/useMonstersStore'
import { fetchHunts } from '@/store/useHuntStore'
import { Button } from '@mui/material'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
// import Image from 'next/image'
import AmawRandomMonster from '@/components/AmawRandomHunt/AmawRandomMonster'
import AmawRandomWeapon from '@/components/AmawRandomHunt/AmawRandomWeapon'

gsap.registerPlugin(useGSAP)

export type RandomMonster = {
  remainingWeapons: Weapon[]
} & Monster

const roulette_size = 100

function AmawRandomHunt({
  weapons,
}: {
  weapons: Weapon[]
}) {
  const [randomMonster, setRandomMonster] = useState<RandomMonster>()
  const [rolling, setRolling] = useState(false)

  useEffect(() => {
    fetchMonsters()
    fetchHunts()
  }, [])

  if (!weapons || weapons.length === 0) return null
  return (
    <div className="bg-neutral-950">
      <Button onClick={() => setRolling(true)} fullWidth>CLICK ME !</Button>
      <div className="w-full text-center">{randomMonster?.name}</div>
      <div className="flex items-center">
        <AmawRandomMonster
          size={roulette_size}
          rolling={rolling}
          setRolling={setRolling}
          weapons={weapons}
          setRandomMonster={setRandomMonster}
        />
        <AmawRandomWeapon
          size={roulette_size}
          rolling={rolling}
          weapons={weapons}
          randomMonster={randomMonster}
        />
      </div>
    </div>
  )
}

export default AmawRandomHunt