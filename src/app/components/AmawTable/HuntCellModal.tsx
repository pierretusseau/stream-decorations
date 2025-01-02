import React, { useCallback, useEffect, useState } from 'react'
import Image from 'next/image'
import Modal from '@mui/material/Modal'
import Box from '@mui/material/Box'
// import Typography from '@mui/material/Typography'
import useSettingsStore from '@/store/useSettingsStore'
import { monsterNameParser } from '@/utils/utils'
import { IconButton, Button } from '@mui/material'
import {
  TrashIcon,
  CheckIcon
} from '@heroicons/react/24/solid'

const style = {
  position: 'absolute',
  top: '50%',
  left: '50%',
  transform: 'translate(-50%, -50%)',
  width: 400,
  // bgcolor: 'background.paper',
  border: '2px solid #000',
  boxShadow: 24,
  p: 4,
};

function HuntCellModal({
  open,
  setOpenModal,
  monster,
  weapon,
  hunt
}: {
  open: boolean
  setOpenModal: React.Dispatch<React.SetStateAction<boolean>>
  monster: Monster
  weapon: Weapon
  hunt?: Hunt
}) {
  const [huntTime, setHuntTime] = useState<string>('')
  const [huntYoutube, setHuntYoutube] = useState<string>('')
  const service_key = useSettingsStore((state) => state.supabase_service_key)
  const handleClose = () => setOpenModal(false)

  useEffect(() => {
    setHuntTime(hunt?.time || '')
    setHuntYoutube(hunt?.video_uri || '')
  }, [hunt])
  
  const handleSave = useCallback(async () => {
    await fetch(`${window.location.origin}/api/save-hunt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_key: service_key,
        monster: monster.id,
        weapon: weapon.id,
        time: huntTime,
        video_uri: huntYoutube,
        hunt_id: hunt?.id,
      })
    }).then(res => res.json())
      .then(({code, error, body}) => {
        if (code === 200) {
          console.log('Saved hunt timer')
        }
        if (error) {
          throw new Error(body.message)
        }
      })
      .catch(err => {
        console.error(err)
      })
  }, [huntTime, monster, weapon, service_key, hunt, huntYoutube])
  
  const handleDelete = useCallback(async () => {
    await fetch(`${window.location.origin}/api/delete-hunt`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        service_key: service_key,
        hunt_id: hunt?.id,
      })
    }).then(res => res.json())
      .then(({code, error, body}) => {
        if (code === 200) {
          console.log('Deleted hunt timer')
        }
        if (error) {
          throw new Error(body.message)
        }
      })
      .catch(err => {
        console.error(err)
      })
  }, [service_key, hunt])

  return (
    <Modal
      open={open}
      onClose={handleClose}
      onClick={(e) => {
        e.preventDefault()
        e.stopPropagation()
      }}
      aria-labelledby="modal-modal-title"
      aria-describedby="modal-modal-description"
    >
      <Box sx={style} className="bg-neutral-900">
        <div className="flex items-center gap-2">
          <p>{hunt?.id || 'No ID'}</p>
          <Image
            src={`/mhw-monsters/${monsterNameParser(monster.name)}.png`}
            width={50}
            height={50}
            alt={`Icon of ${monster.name}`}
            className="group/monster-image"
          />
          <Image
            src={`/mhw-weapons/${weapon.acronym}.svg`}
            width={50}
            height={50}
            alt={`Icon of ${weapon.name}`}
            className=""
          />
        </div>
        <hr/>
        <div className="mt-2">
          <p>Hunt Time</p>
          <input
            className="bg-neutral-700 w-full"
            type="text"
            value={huntTime}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHuntTime(e.target.value)}
          />
        </div>
        <div className="mt-2">
          <p>YouTube</p>
          <input
            className="bg-neutral-700 w-full"
            type="text"
            value={huntYoutube}
            onChange={(e: React.ChangeEvent<HTMLInputElement>) => setHuntYoutube(e.target.value)}
          />
        </div>
        <div className="flex gap-2 mt-2">
          <Button
            variant="contained"
            onClick={() => handleSave()}
            startIcon={<CheckIcon className="size-6 text-neutral-50" />}
            fullWidth
          >
            Save
          </Button>
          <IconButton
            onClick={() => handleDelete()}
            color="error"
          >
            <TrashIcon className="size-6 text-red-600" />
          </IconButton>
        </div>
      </Box>
    </Modal>
  )
}

export default HuntCellModal