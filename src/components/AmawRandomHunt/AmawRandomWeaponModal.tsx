import { useCallback } from 'react'
import { Button, Modal } from '@mui/material'
import WeaponImage from '@/components/common/WeaponImage'

type Props = {
  setOpenWeaponModal: React.Dispatch<React.SetStateAction<boolean>>
  setWeaponChoice: React.Dispatch<React.SetStateAction<Weapon[]>>
  weaponChoice: Weapon[]
  weapons: Weapon[]
}

const AmawRandomMonsterModal = ({
  setOpenWeaponModal,
  setWeaponChoice,
  weaponChoice,
  weapons
}: Props) => {
  const modalStyle = [
    'absolute top-1/2 left-1/2',
    '-translate-x-1/2 -translate-y-1/2',
    'w-[600px] h-[320px]',
    'border-[2px] border-neutral-900',
    'bg-neutral-950',
    'overflow-y-auto'
  ].join(' ')

  const handleAllWeapons = () => setWeaponChoice(weapons)
  const handleNoneWeapons = () => setWeaponChoice([])

  const handleToggleWeapon = useCallback((weapon: Weapon) => {
    setWeaponChoice((prevChoice: Weapon[]) => {
      if (prevChoice.some(w => w.id === weapon.id)) {
        return prevChoice.filter(w => w.id !== weapon.id)
      } else {
        return [...prevChoice, weapon]
      }
    })
  }, [setWeaponChoice])
  
  return (
    <Modal
      open={true}
      onClose={() => setOpenWeaponModal(false)}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <div className={modalStyle}>
        <Button onClick={() => handleAllWeapons()}>All</Button>
        <Button onClick={() => handleNoneWeapons()}>None</Button>
        <div className={`grid grid-cols-12 bg-neutral-900 p-4 `}>
          {weapons.map(weapon => <div
            key={`random-hunt-weapon-${weapon.id}`}
            className={`${[
              weaponChoice.some(w => w.id === weapon.id) ? 'opacity-100' : 'opacity-15',
              'cursor-pointer'
            ].join(' ')}`}
            onClick={() => handleToggleWeapon(weapon)}
          >
            <WeaponImage weapon={weapon} size={32} />
          </div>)}
        </div>
      </div>
    </Modal>
  );
  }
  
  export default AmawRandomMonsterModal