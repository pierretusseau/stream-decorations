import React, { useMemo, useRef } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function Particles({
  color,
  primeColor,
  bgColor,
  numberOfParticles = 60
}: {
  color: string
  primeColor?: string
  bgColor?: string
  numberOfParticles?: number
}) {
  const particlesRef = useRef(null)
  
  useGSAP(() => {
    // @ts-expect-error: GSAP
    if (!particlesRef.current || !particlesRef.current.children) return
    const tl = gsap.timeline()
    // @ts-expect-error: GSAP
    gsap.utils.toArray(particlesRef.current.children).forEach((element, i) => {
      const odd = i % 2 === 1
      const duration = Math.floor(Math.random() * 10) + 5
      const y = Math.floor((Math.random() * -500) + 200)
      const x = Math.floor((Math.random() * 200) + 100)
      // @ts-expect-error: GSAP
      tl.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 1 }, '0.5')
      // @ts-expect-error: GSAP
      tl.to(element, { x: odd ? x : x * -1, y, duration }, '0.5')
      // @ts-expect-error: GSAP
      tl.to(element, { opacity: 0, duration: duration - 1.5 }, '2')
    })
  })

  const particles = useMemo(() => {
    const particlesArray = []
    for (let index = 0; index < numberOfParticles; index++) {
      const randomSize = Math.floor(Math.random() * 5) + 1
      const randomX = Math.floor(Math.random() * -200) + 200
      const randomY = Math.floor(Math.random() * 500)
  
      const style = {
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        boxShadow: `0 0 5px rgba(${primeColor || color}, 1)`,
        top: `${randomY}px`,
      }
      const positionStyle = index % 2 === 0
        ? { left: randomX }
        : { right: randomX}
      const finalStyle = {...style, ...positionStyle}
  
      particlesArray.push(<div
        key={`particle-${index}`}
        className={`${[
          'absolute',
          'rounded-full',
          primeColor
            ? 'bg-blue-400'
            : 'bg-yellow-200'
        ].join(' ')}`}
        style={{
          ...finalStyle,
          backgroundColor: bgColor
        }}
      ></div>)
    }
    return particlesArray
  }, [color, primeColor, bgColor, numberOfParticles])

  return (
    <div ref={particlesRef}>
      {particles.length > 0 && particles.map(particle => particle)}
    </div>
  )
}

export default Particles