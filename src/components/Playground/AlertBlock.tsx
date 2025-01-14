import React, { useState } from 'react'
import { Button } from '@mui/material'
import { PlayIcon, XMarkIcon } from '@heroicons/react/24/solid'
import { ArrowPathIcon } from '@heroicons/react/24/solid'

const resetRender = (setter: React.Dispatch<React.SetStateAction<boolean>>) => {
  setter(false)
  setTimeout(() => {
    setter(true)
  }, 1);
}

function AlertBlock({
  children,
  title,
}: {
  children: React.ReactNode
  title: string
}) {
  const [displayAlert, setDisplayAlert] = useState(false)
  
  return (
    <>
      <div className="flex justify-between items-center">
        <h2>{title}</h2>
        <div>
          <Button
            onClick={() => setDisplayAlert(false)}
          ><XMarkIcon /></Button>
          <Button
            onClick={() => setDisplayAlert(true)}
          ><PlayIcon /></Button>
          <Button
            onClick={() => resetRender(setDisplayAlert)}
          ><ArrowPathIcon /></Button>
        </div>
      </div>
      {displayAlert && children}
    </>
  )
}

export default AlertBlock