'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Announce from '@/app/components/Announces/Announce'

const announceTimer = 30000

function Announces({
  announces
}: {
  announces: Announce[]
}) {
  const [activeAnnounce, setActiveAnnounce] = useState<number>(2)

  const nextAnnounce = useCallback(() => {
    if (announces.length > activeAnnounce + 1) {
      setActiveAnnounce(activeAnnounce + 1)
    } else {
      setActiveAnnounce(-2) // Twice amount of wait between two full loops
    }
  }, [announces.length, activeAnnounce])
  
  useEffect(() => {
    const intervalID = setInterval(nextAnnounce, announceTimer)
    return () => clearInterval(intervalID)
  }, [nextAnnounce])

  const currentAnnounce = announces.find((_,i) => i === activeAnnounce)

  return (
    <div
      className="w-[400px] h-[100px]"
    >
      {activeAnnounce < 0 || !currentAnnounce
        ? <div></div>
        : <Announce
          announce={currentAnnounce}
          timer={announceTimer}
        />
      }
    </div>
  )
}

export default Announces