import { useCallback, useEffect } from 'react'
import { Button, Modal } from '@mui/material'
import useMonstersStore from '@/store/useMonstersStore'
import useHuntStore from '@/store/useHuntStore'
import useSettingsStore from '@/store/useSettingsStore'
import MonsterImage from '@/components/common/MonsterImage'
import type { RandomMonster } from '@/components/AmawRandomHunt'

type Props = {
  setOpenMonsterModal: React.Dispatch<React.SetStateAction<boolean>>
  setMonsterChoice: React.Dispatch<React.SetStateAction<Monster[]>>
  monsterChoice: Monster[]
  weapons: Weapon[]
}

const AmawRandomMonsterModal = ({
  setOpenMonsterModal,
  setMonsterChoice,
  monsterChoice,
  weapons
}: Props) => {
  const monsters = useMonstersStore((state) => state.monsters)
  const hunts = useHuntStore((state) => state.hunts)
  const amawServiceKey = useSettingsStore((state) => state.supabase_service_key)
  
  const modalStyle = [
    'absolute top-1/2 left-1/2',
    '-translate-x-1/2 -translate-y-1/2',
    'w-[600px] h-[320px]',
    'border-[2px] border-neutral-900',
    'bg-neutral-950',
    'overflow-y-auto'
  ].join(' ')

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

  const getUnlockedMonsters = useCallback(() => {
    if (amawServiceKey.length > 0) {
      return monsters.filter(monster => monster.unlocked)
    }
  }, [monsters, amawServiceKey.length])

  useEffect(() => {
    const unlockedMonsters = getUnlockedMonsters() || []
    if (unlockedMonsters.length > 0) {
      setMonsterChoice(getRemainingHunts(unlockedMonsters))
    }
  }, [setMonsterChoice, getRemainingHunts, getUnlockedMonsters, monsters, monsterChoice.length])

  const handleAllMonsters = () => setMonsterChoice(monsters)
  const handleNoneMonsters = () => setMonsterChoice([])
  const handleRemainingMonsters = () => setMonsterChoice(getRemainingHunts(getUnlockedMonsters() || []))

  const handleToggleMonster = useCallback((monster: Monster) => {
    setMonsterChoice((prevChoice: Monster[]) => {
      if (prevChoice.some(m => m.id === monster.id)) {
        return prevChoice.filter(m => m.id !== monster.id)
      } else {
        return [...prevChoice, monster]
      }
    })
  }, [setMonsterChoice])

  const unlockedMonsters = getUnlockedMonsters() || []
  
  return (
    <Modal
      open={true}
      onClose={() => setOpenMonsterModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={modalStyle}>
        <Button onClick={() => handleAllMonsters()}>All</Button>
        <Button onClick={() => handleNoneMonsters()}>None</Button>
        {unlockedMonsters.length > 0 && <Button onClick={() => handleRemainingMonsters()}>Remaining Hunts</Button>}
        <div className={`grid grid-cols-12 bg-neutral-900 p-4 `}>
          {monsters.map(monster => <div
            key={`random-hunt-monster-${monster.id}`}
            className={`${[
              monsterChoice.some(m => m.id === monster.id) ? 'opacity-100' : 'opacity-15',
              'cursor-pointer'
            ].join(' ')}`}
            onClick={() => handleToggleMonster(monster)}
          >
            <MonsterImage monster={monster} size={32} />
          </div>)}
        </div>
      </div>
    </Modal>
  );
  }
  
  export default AmawRandomMonsterModal