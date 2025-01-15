import React, { useRef } from 'react'
import { StarIcon } from '@heroicons/react/24/solid'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function Stars({
  monster
}: {
  monster: Monster
}) {
  const starsRef = useRef(null)

  // console.log('starsRef', starsRef)

  useGSAP(() => {
    // @ts-expect-error: GSAP
    if (!starsRef.current || !starsRef.current.children) return
    const tl = gsap.timeline()
    // @ts-expect-error: GSAP
    const gsapStars = gsap.utils.toArray(starsRef.current.children)
    tl.fromTo(gsapStars, {
      opacity: 0, scale: 0.5, rotate: -20
    }, {
      opacity: 1, scale: 1, rotate: 0,
      duration: 0.2, stagger: 0.05
    }, '1.5')
  })

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
    <div
      className={`group/last-hunt-stars ${[
        "flex"
      ].join(' ')}`}
      ref={starsRef}
    >
      {stars.map((star, index) => <div
        key={`last-hunt-star-${index}`}>
          {star}
        </div>)}
    </div>
  )
}

export default Stars