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
      className="flex flex-col gap-8 max-w-[1200px]"
    >
      <div
        className="group/highrank flex flex-wrap gap-4"
      >
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
      <div
        className="group/masterrank flex flex-wrap gap-4"
      >
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
  )
}

export default AmawMonsters