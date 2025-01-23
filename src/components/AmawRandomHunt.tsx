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
import AmawRandomMonster from '@/components/AmawRandomHunt/AmawRandomMonster'
import AmawRandomWeapon from '@/components/AmawRandomHunt/AmawRandomWeapon'

gsap.registerPlugin(useGSAP)

export type RandomMonster = {
  remainingWeapons: Weapon[]
} & Monster

const roulette_size = 300

function AmawRandomHunt({
  weapons,
}: {
  weapons: Weapon[]
}) {
  const [randomMonster, setRandomMonster] = useState<RandomMonster>()
  const [rollingMonster, setRollingMonster] = useState(false)
  const [rollingWeapon, setRollingWeapon] = useState(false)
  const [display, setDisplay] = useState({
    monster: false,
    weapon: false,
  })

  useEffect(() => {
    fetchMonsters()
    fetchHunts()
  }, [])

  if (!weapons || weapons.length === 0) return null
  return (
    <div>
      <div className="w-full flex justify-between bg-neutral-950 mb-5">
        <Button onClick={() => {
          setDisplay({
            monster: true,
            weapon: false,
          })
          setTimeout(() => {
            setRandomMonster(undefined)
            setRollingMonster(true)
          }, 500);
        }}>Roll Monster</Button>
        <Button onClick={() => {
          setDisplay({
            monster: false,
            weapon: true,
          })
          setTimeout(() => {
            setRollingWeapon(true)
          }, 500);
        }}>Roll Weapon</Button>
        <Button onClick={() => {
          setDisplay({
            monster: true,
            weapon: true,
          })
          setTimeout(() => {
            setRandomMonster(undefined)
            setRollingWeapon(true)
            setRollingMonster(true)
          }, 500);
        }}>Roll Both</Button>
      </div>
      <div className="flex items-center justify-center gap-2">
        {display.monster && <AmawRandomMonster
          size={roulette_size}
          rolling={rollingMonster}
          randomMonster={randomMonster}
          setRollingMonster={setRollingMonster}
          weapons={weapons}
          setRandomMonster={setRandomMonster}
        />}
        {display.weapon && <AmawRandomWeapon
          size={roulette_size}
          monsterRolling={rollingMonster}
          rolling={rollingWeapon}
          weapons={weapons}
          randomMonster={randomMonster}
          setRollingWeapon={setRollingWeapon}
        />}
      </div>
    </div>
  )
}

export default AmawRandomHunt