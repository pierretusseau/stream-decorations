import React from 'react'
import WeaponImage from '../common/WeaponImage'
import ProgressionBackground from '../common/ProgressionBackground'
import useMonstersStore from '@/store/useMonstersStore'
import { floatToTimeString, huntTimeToNumbers } from '@/utils/utils'

function WeaponCard({
  weapon,
  hunts
}: {
  weapon: Weapon
  hunts: Hunt[]
}) {
  const monstersStore = useMonstersStore((state) => state.monsters)
  const bestTime = hunts.sort((a, b) => {
    if (!a.time || !b.time) return 0
    const { totalSeconds: aTime } = huntTimeToNumbers(a.time)
    const { totalSeconds: bTime } = huntTimeToNumbers(b.time)
    return aTime - bTime
  })[0].time
  const totalTime = hunts.map(h => {
    if (h.time) { return huntTimeToNumbers(h.time).totalSeconds }
  }).reduce((sum, obj) => {
    if (sum && obj) return sum + obj
  })
  const averageTime = floatToTimeString((totalTime || 0) / hunts.length)

  const weaponCardStyles = [
    "relative rounded-2xl",
    "w-[250px] pt-2",
    "bg-neutral-900",
    "overflow-hidden",
    "flex gap-2"
  ].join(' ')

  return (
    <div
      className={`group/weapon-card ${weaponCardStyles}`}
      style={{
        textShadow: `
                    1px 1px 1px #000,
                    -1px -1px 1px #000,
                    -1px 1px 1px #000,
                    1px -1px 1px #000`
      }}
    >
      <ProgressionBackground
        value={hunts.length}
        total={monstersStore.length}
      />
      <div className="relative flex flex-col gap-2 items-center">
        <div className="flex justify-start">
          <WeaponImage
            weapon={weapon}
            size={100}
            className="drop-shadow-[0_0_3px_rgba(0,0,0,1)]"
          />
        </div>
        <div className="font-teko text-3xl relative">
          {hunts.length} / {monstersStore.length}
        </div>
      </div>
      <div className="relative flex flex-col gap-1 justify-center">
        <p>
          <span className="text-xl font-teko">PB</span><br/>
          <span className="text-3xl leading-[18px] font-bold">{bestTime}</span>
        </p>
        <p>
          <span className="text-xl font-teko">Average</span><br/>
          <span className="text-3xl leading-[18px] font-bold">{averageTime}</span>
        </p>
      </div>
    </div>
  )
}

export default WeaponCard