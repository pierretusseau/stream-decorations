'use client';

import React, { useEffect } from 'react'
import MonsterCard from '@/components/AmawMonsters/MonsterCard'
import useHuntStore, {
  fetchHunts,
  subscribeToHunts
} from '@/store/useHuntStore'
import useMonstersStore, {
  fetchMonsters,
  subscribeToMonsters
} from '@/store/useMonstersStore'
import { StarIcon } from '@heroicons/react/24/solid';


const starStyle = (type: 'hr' | 'mr') => {
  return [
    "w-8 h-8 rounded-full",
    "flex items-center justify-center",
    type === 'hr'
      ? 'text-orange-500'
      : 'text-yellow-400 border-[1px] border-yellow-400'
  ].join(' ')
}

function AmawMonsters() {
  const storeHunts = useHuntStore((state) => state.hunts)
  const storeMonsters = useMonstersStore((state) => state.monsters)

  useEffect(() => {
    fetchHunts()
    subscribeToHunts()
    fetchMonsters()
    subscribeToMonsters()
  }, [])

  return (
    <div
      className="flex flex-col gap-8 max-w-[1600px]"
    >
      <div
        className="group/highrank"
      >
        <div className="mb-2 uppercase font-bold flex gap-2 items-center">
          <div><StarIcon className={starStyle('hr')}/></div>
          <p className="font-teko text-3xl leading-[32px] relative top-1">High Rank</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {storeMonsters
            .filter(monster => monster.quest_level)
            .map(monster => {
              const hunts = storeHunts.filter(hunt => hunt.monster === monster.id)
              return <MonsterCard
              key={`monster-card${monster.id}`}
              monster={monster}
              hunts={hunts}
            />})}
        </div>
      </div>
      <div
        className="group/masterrank"
      >
        <div className="mb-2 uppercase font-bold flex gap-2 items-center">
          <div><StarIcon className={starStyle('mr')}/></div>
          <p className="font-teko text-3xl leading-[32px] relative top-1">Master Rank</p>
        </div>
        <div className="flex flex-wrap gap-4">
          {storeMonsters
            .filter(monster => monster.mr_level)
            .map(monster => {
              const hunts = storeHunts.filter(hunt => hunt.monster === monster.id)
              return <MonsterCard
              key={`monster-card${monster.id}`}
              monster={monster}
              hunts={hunts}
            />})}
        </div>
      </div>
    </div>
  )
}

export default AmawMonsters