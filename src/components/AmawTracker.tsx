'use client'

import React, { useCallback, useEffect, useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import useHuntStore, {
  fetchHunts,
  subscribeToHunts
} from '@/store/useHuntStore'
import Hunt from '@/components/AmawTracker/Hunt'

gsap.registerPlugin(useGSAP)

const screen_width = 2560
const cam_width = 432

function AmawTracker({
  monsters,
  weapons,
}: {
  monsters: Monster[]
  weapons: Weapon[]
}) {
  const huntsStore = useHuntStore((state) => state.hunts)
  const [prevHunts, setPrevHunts] = useState<Hunt[]>([])
  const [limitedHunts, setLimitedHunts] = useState<Hunt[]>([])
  const [outAnim, setOutAnim] = useState<boolean>(false)
  
  const handleNewHunts = useCallback(() => {
    setOutAnim(false)
    setLimitedHunts(huntsStore.slice(-10))
  }, [huntsStore])

  useEffect(() => {
    fetchHunts()
    subscribeToHunts()
  }, [])

  console.count('render')

  if (huntsStore.length > 0) {
    console.log('store received')
    if (huntsStore !== prevHunts) {
      console.log('Difference between two arrays')
      // Update prevHunts to stop the rerendering
      setPrevHunts(huntsStore)
      // When store updates
      if (limitedHunts.length > 0) {
        console.log(limitedHunts[0].id)
        console.log(huntsStore.slice(-10)[0].id)
        console.log(limitedHunts[0].id !== huntsStore.slice(-10)[0].id)
        if (limitedHunts[0].id !== huntsStore.slice(-10)[0].id) {
          // If the hunt we receive is different from the store one then animOut
          // Animate old one out
          setOutAnim(true)
        }
      } else {
        console.log('Set limited hunts')
        // Else we need to define the next hunt
        setLimitedHunts(huntsStore.slice(-10))
      }
    }
  } else {
    console.log('Waiting for huntsStore to init')
  }

  return (
    <div
      className="p-2 pt-8 pl-0 flex gap-8 items-center"
      style={{
        height: 200,
        width: screen_width - cam_width
      }}
    >
      {/* <h1 className="text-2xl">Last hunts</h1> */}
      <div className="w-[1650px] h-[200px] overflow-hidden relative">
        <HuntsContainer
          hunts={limitedHunts}
          monsters={monsters}
          weapons={weapons}
          outAnim={outAnim}
          handleNewHunts={handleNewHunts}
        />
      </div>
    </div>
  )
}

export default AmawTracker

const HuntsContainer = ({
  hunts,
  monsters,
  weapons,
  outAnim,
  handleNewHunts
}: {
  hunts: Hunt[]
  monsters: Monster[]
  weapons: Weapon[]
  outAnim: boolean
  handleNewHunts: () => void
}) => {
  const huntsRef = useRef(null)

  useGSAP(() => {
    if (!outAnim) return
    const tl = gsap.timeline({
      onComplete: () => handleNewHunts()
    })
    tl.to(huntsRef.current, { x: '-180px', duration: 1, ease: 'power1.inOut' })
  }, {
    dependencies: [outAnim],
    revertOnUpdate: true
  })

  return <div
    ref={huntsRef}
    className="flex items-end absolute left-0 bottom-6 w-[1800px]"
  >
    {hunts.map((hunt, index) => {
      const monster = monsters.find(monster => monster.id === hunt.monster)
      const weapon = weapons.find(weapon => weapon.id === hunt.weapon)

      if (!monster || !weapon) return null
      return <Hunt
        key={hunt.id}
        monster={monster}
        weapon={weapon}
        hunt={hunt}
        outAnim={index === 0 && outAnim}
        inAnim={index === hunts.length - 1 && outAnim}
      />
    })}
  </div>
}