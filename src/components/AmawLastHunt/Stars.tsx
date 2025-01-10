import { StarIcon } from '@heroicons/react/24/solid'
import React from 'react'

function Stars({
  monster
}: {
  monster: Monster
}) {
  const quest_level = monster.quest_level || monster.mr_level
  if (!quest_level) return null

  const type = monster.quest_level ? 'hr' : 'mr'

  const starStyle = [
    "w-8 h-8 rounded-full",
    "flex items-center justify-center",
    type === 'hr'
      ? 'text-orange-500'
      : 'text-yellow-400 border-[1px] border-yellow-400'
  ].join(' ')
  const stars = []
  for (let i = 0; i < quest_level; i++) {
    stars.push(<div className={`${starStyle}`}>
      <StarIcon className={`${[
        type === 'hr'
          ? 'size-8'
          : 'size-6'
      ].join(' ')}`}/>
    </div>)
  }

  return (
    <div className={`group/last-hunt-stars ${[
      "flex"
    ].join(' ')}`}>
      {stars.map((star, index) => <div
        key={`last-hunt-star-${index}`}>
          {star}
        </div>)}
    </div>
  )
}

export default Stars