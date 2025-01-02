import React from 'react'

function ProgressionBackground({
  value,
  total
}: {
  value: number
  total: number
}) {
  const progressionBackgroundStyle = [
    "w-full h-full absolute bottom-0 left-0 z-0",
    "bg-green-900 opacity-75 transition origin-bottom"
  ].join(' ')

  return (
    <div
      className={`group/progression-bg ${progressionBackgroundStyle}`}
      style={{ transform: `scaleY(${(100 / total) * value}%)` }}
    ></div>
  )
}

export default ProgressionBackground