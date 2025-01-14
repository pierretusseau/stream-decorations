import React, { useRef, useState } from 'react'
import MHWQuestFailed from '@/components/Svg/MHWQuestFailed'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

function RaidAlertSvg({
  mainColor,
  secondaryColor,
  timingOut
}: {
  mainColor: string
  secondaryColor: string
  timingOut: string
}) {
  const svgRef = useRef(null)
  const [opacity, setOpacity] = useState(1)
  const [svgColor, setSvgColor] = useState(mainColor)
  const [svgBgColor, setSvgBgColor] = useState(secondaryColor)

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.fromTo(svgRef.current, {
      opacity: 0,
    }, {
      opacity: 1,
      duration: 0.2,
    }, '0.2')
    tl.to(svgRef.current, { scale: 1.3, duration: 8, ease: 'power1.out' }, '0.2')
    const svgProxyColor = { value: svgColor }
    tl.to(svgProxyColor, {
      value: mainColor, duration: 1,
      onUpdate: () => setSvgColor(svgProxyColor.value)
    }, '0.4')
    const svgBgProxyColor = { value: svgBgColor }
    tl.to(svgBgProxyColor, {
      value: secondaryColor, duration: 1,
      onUpdate: () => setSvgBgColor(svgBgProxyColor.value)
    }, '0.4')
    const svgOpacity = { value: opacity }
    tl.to(svgOpacity, {
      value: 0.25, duration: 2,
      onUpdate: () => setOpacity(svgOpacity.value)
    }, '0.5')
    tl.to(svgRef.current, {
      opacity: 0, scale: 0.8, duration: 5, ease: 'power4.out'
    }, timingOut)
  })

  return (
    <div ref={svgRef}>
      <MHWQuestFailed
        className={`${[].join(' ')}`}
        color={`rgba(${svgColor},${opacity})`}
        bgColor={`rgba(${svgBgColor},1)`}
        size="400px"
      />
    </div>
  )
}

export default RaidAlertSvg