import React, { useMemo } from 'react'

function Particles({
  numberOfParticles,
  prime,
  ref,
}: {
  numberOfParticles: number
  prime: {
    isPrime: boolean
    primeColor: string
    nonPrimeColor: string
  }
  ref: React.RefObject<HTMLDivElement|null> 
}) {
  const { isPrime, primeColor, nonPrimeColor } = prime

  const particles = useMemo(() => {
    const particlesArray = []
    for (let index = 0; index < numberOfParticles; index++) {
      const randomSize = Math.floor(Math.random() * 5) + 1
      const randomX = Math.floor(Math.random() * -200) + 200
      const randomY = Math.floor(Math.random() * 500)
  
      const style = {
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        boxShadow: `0 0 5px rgba(${isPrime ? primeColor : nonPrimeColor}, 1)`,
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
          isPrime ? 'bg-blue-400' : 'bg-yellow-300'
        ].join(' ')}`}
        style={finalStyle}
      ></div>)
    }
    return particlesArray
  }, [isPrime, nonPrimeColor, numberOfParticles, primeColor])

  return (
    <div ref={ref}>
      {particles.length > 0 && particles.map(particle => particle)}
    </div>
  )
}

export default Particles