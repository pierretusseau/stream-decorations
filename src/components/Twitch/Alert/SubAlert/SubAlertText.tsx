import React, { useRef, useState } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import SplitType from 'split-type'

gsap.registerPlugin(useGSAP)

function SubAlertText({
  alert,
  color,
  subTier,
  isPrime,
  timingOut,
}: {
  alert: Alert
  color: string
  subTier: number
  isPrime: boolean
  timingOut: string
}) {
  const textWrapperRef = useRef(null)
  const textRef = useRef(null)
  const contentRef = useRef(null)
  const complementRef = useRef(null)
  const [textDropColor, setTextDropColor] = useState('255,255,255')
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
    tl.to(textRef.current, { color: `rgb(${color})`, duration: 0.2 }, '0.2')
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
    tl.to(textRef.current, {
      color: "#FFF",
      duration: 0.2
    }, '0.4')
    tl.to(complementRef.current, { opacity: 1, duration: 0.5 }, '1.2')
    tl.to(complementRef.current, { y: 50, scale: 1, duration: 4, ease: 'power1.out' }, '1.2')
    tl.to(complementRef.current, { opacity: 0, duration: 2 }, '3.2')
    tl.fromTo(splitText.chars, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.01 }, "0.5")
    tl.fromTo(splitText.chars, { color: `rgb(${color})`, }, { color: "#FFF", duration: 0.5, stagger: 0.025 }, "0.5")
    tl.to(textRef.current, {
      scale: 1.5, duration: 2, ease: "expoScale(10,2.5,power2.out)"
    }, timingOut)
    tl.to(textRef.current, {
      opacity: 0, duration: 0.4
    }, timingOut)
    tl.to(contentRef.current, {
      opacity: 0, duration: 2
    }, ">0.3")
  })

  return (
    <div ref={textWrapperRef} className="absolute top-[180px] left-1/2 -translate-x-1/2">
      <div
        className={`${[
          "font-mhn text-[60px] absolute top-0 left-1/2 -translate-x-1/2",
        ].join(' ')}`}
        style={{
          whiteSpace: 'nowrap',
          filter: `drop-shadow(0 0 ${textDropSize}px rgba(${textDropColor},1))`
        }}
        ref={textRef}
      >
        New Sub!
      </div>
      <div
        className={`${[
          'font-mhn text-[90px] absolute top-[40px] left-1/2 -translate-x-1/2 flex',
        ].join(' ')}`}
        ref={contentRef}
        style={{
          filter: `drop-shadow(0 0 ${textDropSize}px rgba(${textDropColor},1))`,
          opacity: 0
        }}
      >
        {alert.user_name}
      </div>
      <div
        className={`${[
          'font-mhn text-[70px] absolute top-[200px] left-1/2 -translate-x-1/2 flex flex-col items-center',
        ].join(' ')}`}
        ref={complementRef}
        style={{
          filter: `drop-shadow(0 0 ${textDropSize}px rgba(${textDropColor},1))`,
          opacity: 0,
          lineHeight: '60px'
        }}
      >
        {subTier > 1 && <div>Tier&nbsp;{subTier}</div>}
        {
          alert.type === 'sub' && alert.notice_type === 'resub'
          && <div className="whitespace-nowrap">
            Resub{alert.resub.cumulative_months > 1 && ` x${alert.resub.cumulative_months}`}
            </div>
        }
        {
          alert.type === 'sub' && alert.notice_type === 'community_sub_gift'
          && <div className="whitespace-nowrap">
            Gift{alert.community_sub_gift.total > 1 && ` x${alert.community_sub_gift.total}`}
          </div>
        }
        {isPrime && <div>Prime</div>}
      </div>
    </div>
  )
}

export default SubAlertText