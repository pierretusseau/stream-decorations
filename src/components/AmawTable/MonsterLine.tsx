import React, { useCallback, useState } from 'react'
import useHuntStore from '@/store/useHuntStore'
import HuntCell from '@/components/AmawTable/HuntCell'
import useSettingsStore from '@/store/useSettingsStore'
import { LockClosedIcon } from '@heroicons/react/24/solid'
import MonsterImage from '@/components/common/MonsterImage'

function MonsterLine({
  monster,
  weapons
}: {
  monster: Monster
  weapons: Weapon[]
}) {
  const hunts = useHuntStore((state) => state.hunts)
  const [monsterUnlocked, setMonsterUnlocked] = useState<boolean>(false)
  const monsterHunts = hunts.filter(hunt => hunt.monster === monster.id)
  const service_key = useSettingsStore((state) => state.supabase_service_key)

  const handleMonsterLockState = useCallback(async (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    console.log(service_key)
    if (service_key.length === 0) return
    e.preventDefault()
    await fetch(`${window.location.origin}/api/amaw/unlock-monster`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_key: service_key,
        id: monster.id
      })
    }).then(res => res.json())
      .then(({code, error, body, unlocked}) => {
        if (code === 200) {
          setMonsterUnlocked(unlocked)
          console.log('New unlock state for', monster.name, unlocked)
        }
        if (error) {
          throw new Error(body.message)
        }
      })
      .catch(err => {
        console.error(err)
      })
  }, [service_key, monster.id, monster.name, setMonsterUnlocked])

  if (!monsterUnlocked && monster.unlocked) setMonsterUnlocked(true)

  return (
    <div className={`group/monster-line ${[
      'bg-neutral-950 flex w-full py-2 pl-2 hover:bg-neutral-900 transition',
      !monsterUnlocked && 'opacity-50',
    ].join(' ')}`}>
      <div
        className="group/monster-line-img w-[50px] mr-2 flex items-center"
        onContextMenu={(e) => handleMonsterLockState(e)}
      >
        <div className="relative pointer-events-none">
          <MonsterImage
            monster={monster}
          />
          {!monsterUnlocked &&<LockClosedIcon
            className={`${[
              "size-8 absolute top-1/2 left-1/2 -translate-y-[50%] -translate-x-[50%]",
              "opacity-75 z-10"
            ].join(' ')}`}
          />}
        </div>
      </div>
      {weapons.map((weapon, index: number) => {
        const weaponHunt = monsterHunts.find(hunt => hunt.weapon === weapon.id)
        return <HuntCell
          key={`amaw-table-${monster.id}-${weapon.id}-${weaponHunt?.id || index}`}
          weapon={weapon}
          monster={monster}
          hunt={weaponHunt}
        />}
      )}
    </div>
  )
}

export default MonsterLine