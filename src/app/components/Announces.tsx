'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Announce from '@/app/components/Announces/Announce'

const announceTimer = 30000

function Announces({
  announces
}: {
  announces: Announce[]
}) {
  const [activeAnnounce, setActiveAnnounce] = useState<number>(0)

  const nextAnnounce = useCallback(() => {
    console.log('Active announce', activeAnnounce)
    console.log(announces.length, activeAnnounce + 1, announces.length < activeAnnounce + 1)
    if (announces.length > activeAnnounce + 1) {
      setActiveAnnounce(activeAnnounce + 1)
    } else {
      setActiveAnnounce(0)
    }
  }, [announces.length, activeAnnounce])
  
  useEffect(() => {
    const intervalID = setInterval(nextAnnounce, announceTimer);
    return () => clearInterval(intervalID);
  }, [nextAnnounce])

  const currentAnnounce = announces.find((_,i) => i === activeAnnounce)
  if (!currentAnnounce) return null

  return (
    <div
      className="w-[400px] h-[100px]"
    >
      <Announce
        announce={currentAnnounce}
        timer={announceTimer}
      />
    </div>
  )
}

export default Announces