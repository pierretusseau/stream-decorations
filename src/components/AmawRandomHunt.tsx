'use client'

import React, {
  // useCallback,
  useEffect,
  useState
} from 'react'
import useMonstersStore, { fetchMonsters } from '@/store/useMonstersStore'
import { fetchHunts } from '@/store/useHuntStore'
import { Button } from '@mui/material'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import AmawRandomMonster from '@/components/AmawRandomHunt/AmawRandomMonster'
import AmawRandomWeapon from '@/components/AmawRandomHunt/AmawRandomWeapon'
import { Cog6ToothIcon } from '@heroicons/react/24/solid'
import AmawRandomMonsterModal from './AmawRandomHunt/AmawRandomMonsterModal'

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
  const monsters = useMonstersStore((state) => state.monsters)
  const [randomMonster, setRandomMonster] = useState<RandomMonster>()
  const [rollingMonster, setRollingMonster] = useState(false)
  const [rollingWeapon, setRollingWeapon] = useState(false)
  const [display, setDisplay] = useState({
    monster: false,
    weapon: false,
  })
  const [monsterChoice, setMonsterChoice] = useState<Monster[]>([])
  // const [weaponChoice, setWeaponChoice] = useState<Weapon[]>([])
  const [openMonsterModal, setOpenMonsterModal] = useState<boolean>(false)

  useEffect(() => {
    fetchMonsters()
    fetchHunts()
  }, [])

  useEffect(() => {
    if (monsters.length > 0 && monsterChoice.length === 0 && !openMonsterModal) setMonsterChoice(monsters)
  }, [monsters, monsterChoice.length, openMonsterModal])

  if (!weapons || weapons.length === 0) return null
  return (
    <div className="w-[650px] h-[300px]">
      <div className="w-full flex justify-between bg-neutral-950 mb-5">
        <div>
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
          <Button
            onClick={() => setOpenMonsterModal(true)}
          >
            <Cog6ToothIcon className="size-4"/>
          </Button>
        </div>
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
      {openMonsterModal && <AmawRandomMonsterModal
        setOpenMonsterModal={setOpenMonsterModal}
        setMonsterChoice={setMonsterChoice}
        monsterChoice={monsterChoice}
        weapons={weapons}
      />}
      <div className="flex items-center justify-center gap-2">
        {display.monster && <AmawRandomMonster
          size={roulette_size}
          rolling={rollingMonster}
          randomMonster={randomMonster}
          setRollingMonster={setRollingMonster}
          weapons={weapons}
          monsters={monsterChoice}
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