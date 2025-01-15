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

function PlaygroundBlock({
  children,
  title,
  tabValue,
  value,
  endButton,
}: {
  children: React.ReactNode
  title: string
  tabValue: number
  value: number
  endButton?: React.ReactElement,
}) {
  const [displayAlert, setDisplayAlert] = useState(false)
  
  return (
    <div role="tabpanel" hidden={tabValue !== value}>
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
          {endButton}
        </div>
      </div>
      {displayAlert && children}
    </div>
  )
}

export default PlaygroundBlock