import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'

gsap.registerPlugin(useGSAP)

function RaidAlertText({
  alert,
  color,
  timingOut,
}: {
  alert: Alert
  color: string
  timingOut: string
}) {
  const textWrapperRef = useRef(null)
  const textRef = useRef(null)
  const contentRef = useRef(null)
  const [textDropColor, setTextDropColor] = useState('255,255,255')
  const [textDropSize, setTextDropSize] = useState(10)
  const [viewerCount, setViewerCount] = useState(0)
  
  useGSAP(() => {
    if (!textRef.current) return
    const splitText = new SplitType(textRef.current, { types: 'chars' })
    const tl = gsap.timeline()
    tl.set(splitText.chars, { opacity: 0 })
    // tl.set(contentRef.current, { opacity: 1 })

    // Starting TL
    tl.fromTo(textRef.current, {
      opacity: 0
    }, {
      opacity: 1,
      duration: 0.5
    }, '0')
    // tl.to(textRef.current, { color: `rgb(${color})`, duration: 0.2 }, '0.2')
    tl.to(textRef.current, {
      color: "#FFF",
      duration: 0.2
    }, '0.4')
    tl.fromTo(splitText.chars, {
      opacity: 0, y: -20
    }, {
      opacity: 1, y: 0,
      duration: 0.4, stagger: 0.01
    }, "0.5")
    tl.fromTo(splitText.chars, {
      color: `rgb(${color})`,
    }, {
      color: "#FFF",
      duration: 0.5, stagger: 0.025
    }, "0.5")
    if (alert.type === 'raid') {
      const textCountProxy = { value: viewerCount }
      tl.to(textCountProxy, {
        value: alert.viewers, duration: 5,
        ease: "power2.out",
        onUpdate: () => setViewerCount(textCountProxy.value)
      }, '0.5')
    }
    tl.to(contentRef.current, {
      opacity: 1, y: -10, duration: 1
    }, '0.5')
    tl.to(contentRef.current, {
      rotate: -5, scale: 4, duration: 4, ease: 'power1.out'
    }, '0.5')
    tl.to(contentRef.current, {
      scale: 1, rotate: 0, duration: 1.5, ease: "elastic.out(1,0.2)"
    }, '5.2')
    const textDropColorProxy = { value: textDropColor }
    tl.to(textDropColorProxy, {
      value: color, duration: 2,
      onUpdate: () => setTextDropColor(textDropColorProxy.value)
    }, '1')
    const textDropSizeProxy = { value: textDropSize }
    tl.to(textDropSizeProxy, {
      value: 5, duration: 2,
      onUpdate: () => setTextDropSize(textDropSizeProxy.value)
    }, '1')

    // Going out
    tl.to(textRef.current, {
      y: 20, duration: 2, ease: "expoScale(10,2.5,power2.out)"
    }, timingOut)
    tl.to(textRef.current, {
      opacity: 0, duration: 1.5
    }, timingOut)
    tl.to(contentRef.current, {
      opacity: 0, duration: 2
    }, ">0.3")
  })

  return (
    <div ref={textWrapperRef} className="absolute top-[180px] left-1/2 -translate-x-1/2">
      <div
        className={`${[
          "font-mhn text-[70px] absolute top-0 left-1/2 -translate-y-[20px] -translate-x-1/2",
        ].join(' ')}`}
        style={{
          whiteSpace: 'nowrap',
          filter: `drop-shadow(0 0 ${textDropSize}px rgba(${textDropColor},1))`
          // filter: `drop-shadow(0 0 ${textDropSize}px rgba(${color},1))`
        }}
        ref={textRef}
      >
        Raid de {alert.user_name}
      </div>
      <div
        className={`${[
          'font-mhn text-[120px] absolute top-[60px] left-1/2 -translate-x-1/2 flex items-center',
        ].join(' ')}`}
        ref={contentRef}
        style={{
          filter: `drop-shadow(0 0 ${textDropSize}px rgba(${textDropColor},1))`,
          // filter: `drop-shadow(0 0 ${textDropSize}px rgba(${color},1))`,
          opacity: 0,
          lineHeight: '60px'
        }}
      >
        {Math.ceil(viewerCount)}
      </div>
    </div>
  )
}

export default RaidAlertText