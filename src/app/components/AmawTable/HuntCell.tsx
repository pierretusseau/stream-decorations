import React, { useState } from 'react'
import Image from 'next/image'
import { openInNewTab } from '@/utils/utils'
import useSettingsStore from '@/store/useSettingsStore'
import HuntCellModal from './HuntCellModal'

function HuntCell({
  monster,
  weapon,
  hunt
}: {
  monster: Monster
  weapon: Weapon
  hunt: Hunt | undefined
}) {
  const [openModal, setOpenModal] = useState(false)
  const service_key = useSettingsStore((state) => state.supabase_service_key)

  const handleClick = (e: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    e.preventDefault()
    if (!hunt || !hunt.video_uri) return
    openInNewTab(hunt.video_uri)
  }

  const handleContextMenu = (event: React.MouseEvent<HTMLDivElement, MouseEvent>) => {
    event.preventDefault()
    if (service_key.length === 0) return null
    setOpenModal(true)
  }

  return (
    <div
      className={`${[
        "flex items-center justify-center min-h-[50px]",
        hunt?.video_uri
          ?"bg-neutral-950 hover:bg-neutral-900 cursor-pointer"
          : "bg-neutral-950 cursor-default",
        "text-center transition"
      ].join(' ')}`}
      style={{
        width: `${100/14}%`
      }}
      onClick={(e) => handleClick(e)}
      onContextMenu={(e) => handleContextMenu(e)}
    >
      <div className="flex flex-col items-center justify-center gap-2 p-2">
        {hunt?.video_uri && <Image
          src="/youtube.svg"
          width={25}
          height={25}
          alt="Youtube Icon"
          title={hunt.id.toString()}
        />}
        {hunt?.time
          ? <p>{hunt.time}</p>
          : <span className="text-neutral-700">No hunt</span>
        }
      </div>
      <HuntCellModal
        hunt={hunt}
        monster={monster}
        weapon={weapon}
        open={openModal}
        setOpenModal={setOpenModal}
      />
    </div>
  )
}

export default HuntCell