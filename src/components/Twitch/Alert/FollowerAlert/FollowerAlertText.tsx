import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'

gsap.registerPlugin(useGSAP)

function FollowerAlertText({
  alert,
  color,
}: {
  alert: Alert
  color: string
}) {
  const textWrapperRef = useRef(null)
  const textRef = useRef(null)
  const contentRef = useRef(null)
  // const [textDropColor, setTextDropColor] = useState('255,255,255')
  const [textDropSize, setTextDropSize] = useState(10)
  
  useGSAP(() => {
    if (!contentRef.current) return
    const splitText = new SplitType(contentRef.current, { types: 'chars' })
    const tl = gsap.timeline()
    tl.set(splitText.chars, { opacity: 0 })
    tl.set(contentRef.current, { opacity: 1 })
    tl.fromTo(textRef.current, {
      opacity: 0
    }, {
      opacity: 1,
      duration: 0.5
    }, '0')
    // tl.to(textRef.current, { color: `rgb(${color})`, duration: 0.2 }, '0.2')
    // const textDropColorProxy = { value: textDropColor }
    // tl.to(textDropColorProxy, {
    //   value: color, duration: 2,
    //   onUpdate: () => setTextDropColor(textDropColorProxy.value)
    // }, '1')
    const textDropSizeProxy = { value: textDropSize }
    tl.to(textDropSizeProxy, {
      value: 5, duration: 2,
      onUpdate: () => setTextDropSize(textDropSizeProxy.value)
    }, '1')
    tl.to(textRef.current, {
      color: "#FFF",
      duration: 0.2
    }, '0.4')
    tl.fromTo(splitText.chars, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.01 }, "0.5")
    tl.fromTo(splitText.chars, { color: `rgb(${color})`, }, { color: "#FFF", duration: 0.5, stagger: 0.025 }, "0.5")
    tl.to(textRef.current, {
      scale: 1.5, duration: 2, ease: "expoScale(10,2.5,power2.out)"
    }, "5.7")
    tl.to(textRef.current, {
      opacity: 0, duration: 0.4
    }, "5.7")
    tl.to(contentRef.current, {
      opacity: 0, duration: 2
    }, "6")
  })

  return (
    <div ref={textWrapperRef} className="absolute top-[160px] left-1/2 -translate-x-1/2">
      <div
        className={`${[
          "font-mhn text-[60px] absolute top-0 left-1/2 -translate-x-1/2",
        ].join(' ')}`}
        style={{
          whiteSpace: 'nowrap',
          // filter: `drop-shadow(0 0 ${textDropSize}px rgba(${textDropColor},1))`
          filter: `drop-shadow(0 0 ${textDropSize}px rgba(${color},1))`
        }}
        ref={textRef}
      >
        New follower
      </div>
      <div
        className={`${[
          'font-mhn text-[90px] absolute top-[40px] left-1/2 -translate-x-1/2 flex',
        ].join(' ')}`}
        ref={contentRef}
        style={{
          // filter: `drop-shadow(0 0 ${textDropSize}px rgba(${textDropColor},1))`,
          filter: `drop-shadow(0 0 ${textDropSize}px rgba(${color},1))`,
          opacity: 0
        }}
      >
        {alert.user_name}
      </div>
    </div>
  )
}

export default FollowerAlertText