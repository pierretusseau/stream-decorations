import React, {
  // useCallback,
  useRef,
  useState
} from 'react'
import WeaponImage from '@/components/common/WeaponImage'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import type { RandomMonster } from '@/components/AmawRandomHunt'

gsap.registerPlugin(useGSAP)

function AmawRandomWeapon({
  size = 100,
  monsterRolling,
  rolling,
  allWeapons,
  weapons,
  randomMonster,
  setRollingWeapon,
}: {
  size?: number
  monsterRolling: boolean
  rolling: boolean
  allWeapons: Weapon[]
  weapons: Weapon[]
  randomMonster?: RandomMonster
  setRollingWeapon: React.Dispatch<React.SetStateAction<boolean>>
}) {
  const [init, setInit] = useState<boolean>(false)
  // const [weaponsRolling, setWeaponRolling] = useState<boolean>(false)
  
  const questionRef = useRef(null)
  const weaponsRef = useRef(null)

  const wrap = gsap.utils.wrap(size * weapons.length * -1, 0)
  const tl = gsap.timeline()
  const rouletteWeapons = randomMonster && Object.hasOwn(randomMonster, 'remainingWeapons')
    ? randomMonster.remainingWeapons
    : weapons.length > 0
    ? weapons
    : allWeapons
  
  useGSAP(() => {
    if (!rolling) return
    setInit(true)
    console.log('Monster rolling', monsterRolling)
    if (!init) {
      tl.to(questionRef.current, {
        opacity: 0, y: -50, duration: 0.25
      })
      tl.to(weaponsRef.current, {
        opacity: 1, y: 0, duration: 0.25
      })
    }
    tl.to(weaponsRef.current, {
      duration: 1, ease: 'linear',
      y: `-=${size * weapons.length}`,
      modifiers: {
        y: gsap.utils.unitize(wrap)
      },
      repeat: monsterRolling ? 6 : 3,
    })
    if (!monsterRolling) {
      const random = Math.random()
      const randomFromWeapon = random * (rouletteWeapons.length - 1) * 2
      const randomFloor = Math.floor(randomFromWeapon)
      const randomStopY = size * randomFloor
      tl.set(weaponsRef.current, { y: 0 })
      tl.to(weaponsRef.current, {
        y: `-=${randomStopY}`,
        duration: 1, ease: 'power1.out'
      })
      tl.call(() => setRollingWeapon(false))
    }
  }, [rolling, monsterRolling])

  useGSAP(() => {
    if (!randomMonster) return
    const tl = gsap.timeline()
    tl.to(weaponsRef.current, {
      duration: 1, ease: 'linear',
      y: `-=${size * weapons.length}`,
      modifiers: {
        y: gsap.utils.unitize(wrap)
      },
      repeat: 2,
    })
    const random = Math.random()
    const randomFromWeapon = random * (rouletteWeapons.length - 1)
    const randomFloor = Math.floor(randomFromWeapon)
    const randomStopY = size * randomFloor
    tl.set(weaponsRef.current, { y: 0 })
    tl.to(weaponsRef.current, {
      y: `-=${randomStopY}`,
      duration: 1, ease: 'power1.out'
    })
  }, [randomMonster, rouletteWeapons])

  return (
    <div
      className={[
        // "bg-red-300",
        "relative",
        "overflow-hidden"
      ].join(' ')}
      style={{ width: size, height: size}}
    >
      <div
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
      </div>
      <div
        ref={weaponsRef}
        style={{
          transform: `translateY(${size}px)`,
        }}
        className="opacity-0"
      >
        <div style={{
          // animation: !randomMonster ? `roulette 1s infinite` : ''
        }}>
          {rouletteWeapons.map(weapon => <div key={`random-weapons-${weapon.id}`}>
            <WeaponImage weapon={weapon} size={size} />
          </div>)}
          {rouletteWeapons.map(weapon => <div key={`random-weapons-${weapon.id}`}>
            <WeaponImage weapon={weapon} size={size} />
          </div>)}
        </div>
      </div>
    </div>
  )
}

export default AmawRandomWeapon