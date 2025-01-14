import React, { useEffect, useRef, useState, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import MHWQuestComplete from '@/components/Svg/MHWQuestComplete'
import SplitType from 'split-type'
import Image from 'next/image'
import { Howl } from 'howler'
import { removeAlert } from '@/store/useAlertStore'

gsap.registerPlugin(useGSAP)

const yellowHex = "#FFE84A"
const yellowRGB = "255,232,74"
const orangeRGB = "255,191,77"
const blueRGB = "56,189,248"
const numberOfParticles = 60

function SubAlert({
  alert,
}: {
  alert: Alert
}) {
  const containerRef = useRef(null)
  const svgRef = useRef(null)
  const lensRef = useRef(null)
  const raysRef = useRef(null)
  const bgRef = useRef(null)
  const textWrapperRef = useRef(null)
  const textRef = useRef(null)
  const contentRef = useRef(null)
  const complementRef = useRef(null)
  const particlesRef = useRef(null)
  const [opacity, setOpacity] = useState(1)
  const [splitText, setSplitText] = useState<SplitType|null>()
  const [particles, setParticles] = useState<React.ReactElement[]>([])
  const [textDropColor, setTextDropColor] = useState('255,255,255')
  const [textDropSize, setTextDropSize] = useState(10)
  const [svgColor, setSvgColor] = useState("255,255,255")

  const isPrime = alert.type === 'sub' && alert.notice_type === 'sub' && alert.sub.is_prime
    || alert.type === 'sub' && alert.notice_type === 'resub' && alert.resub.is_prime

  const callSound = useCallback((src: string, fadeTimer?: number) => {
    const sound = new Howl({
      src,
      html5: true,
    })
    sound.play()
    if (fadeTimer) sound.fade(1, 0, fadeTimer)
    
    return sound
  }, [])

  useEffect(() => {   
    const sfx = callSound('/sounds/mhw_quest_complete_cleaned.mp3', 2500)
    const music = callSound('/sounds/quest_complete_music.mp3')
    return () => {
      sfx.unload()
      music.unload()
    }
  }, [callSound])

  useEffect(() => {
    if (!contentRef.current) return
    const splitText = new SplitType(contentRef.current, { types: 'chars' })
    setSplitText(splitText)
  }, [contentRef])

  useEffect(() => {
    const particlesArray = []
    for (let index = 0; index < numberOfParticles; index++) {
      const randomSize = Math.floor(Math.random() * 5) + 1
      const randomX = Math.floor(Math.random() * -200) + 200
      const randomY = Math.floor(Math.random() * 500)

      const style = {
        width: `${randomSize}px`,
        height: `${randomSize}px`,
        boxShadow: `0 0 5px rgba(${isPrime ? blueRGB : orangeRGB}, 1)`,
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
    setParticles(particlesArray)
  }, [isPrime])
  
  useGSAP(
    () => {
      const tl = gsap.timeline()
      if (splitText) {
        tl.set(splitText.chars, { opacity: 0 })
        tl.set(contentRef.current, { opacity: 1 })
      }
      tl.fromTo(containerRef.current, {
        rotation: 90, scale: 1.5
      }, {
        rotation: 0, scale: 1,
        duration: 0.8,
        ease: "bounce.out"          
      })
      tl.fromTo(textRef.current, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.5
      }, '0')
      tl.to(textRef.current, { color: yellowHex, duration: 0.2 }, '0.2')
      tl.fromTo(svgRef.current, {
        opacity: 0
      }, {
        opacity: 1,
        duration: 0.2
      }, '0.2')
      const svgProxyColor = { value: svgColor }
      tl.to(svgProxyColor, {
        value: yellowRGB, duration: 1,
        onUpdate: () => setSvgColor(svgProxyColor.value)
      }, '0.4')
      const textDropColorProxy = { value: textDropColor }
      tl.to(textDropColorProxy, {
        value: isPrime ? blueRGB : orangeRGB, duration: 2,
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
      tl.fromTo(lensRef.current, {
        opacity: 0, scale: 0.8
      }, {
        opacity: 1, scale: 1.25,
        duration: 0.5
      }, '0.2')
      tl.fromTo(raysRef.current, {
        opacity: 0, scale: 0.8, rotate: 0
      }, {
        opacity: 0.1, scale: 1.5, rotate: 15,
        duration: 0.5
      }, '0.2')
      tl.to(lensRef.current, {
        scale: 1.15, opacity: 0,
        duration: 2.5
      }, '0.7')
      tl.to(raysRef.current, {
        opacity: 0, scale: 1, rotate: 30,
        duration: 2.5
      }, '0.7')
      tl.fromTo(bgRef.current, { scale: 0 }, { scale: 1, duration: 2 }, '0.2')
      // tl.fromTo(bgRef.current, { maskPosition: '0% 1600%' }, { maskPosition: '0% 0%', duration: 1, ease: "steps(16)" }, '0.2')
      const svgOpacity = { value: opacity }
      tl.to(svgOpacity, {
        value: 0.25, duration: 2,
        onUpdate: () => setOpacity(svgOpacity.value)
      }, '0.5')
      tl.to(complementRef.current, { opacity: 1, duration: 0.5 }, '1.2')
      tl.to(complementRef.current, { y: 50, scale: 1, duration: 4, ease: 'power1.out' }, '1.2')
      tl.to(complementRef.current, { opacity: 0, duration: 2 }, '3.2')
      if (splitText) {
        tl.fromTo(splitText.chars, { opacity: 0 }, { opacity: 1, duration: 0.4, stagger: 0.01 }, "0.5")
        tl.fromTo(splitText.chars, { color: yellowHex, }, { color: "#FFF", duration: 0.5, stagger: 0.025 }, "0.5")
      }
      tl.to(svgRef.current, {
        opacity: 0, scale: 0.8, duration: 2, ease: 'power4.out'
      }, "5.7")
      tl.to(bgRef.current, {
        opacity: 0, duration: 2
      }, "5.7")
      tl.set(textRef.current, {autoAlpha:0, scale:0, z:0.01, transformStyle: "preserve-3d"});
      tl.to(textRef.current, {
        scale: 1.5, duration: 2, ease: "expoScale(10,2.5,power2.out)"
      }, "5.7")
      tl.to(textRef.current, {
        opacity: 0, duration: 0.4
      }, "5.7")
      tl.to(contentRef.current, {
        opacity: 0, duration: 2
      }, "6")
    },
    {
      dependencies: [splitText]
      // scope: container
    }
  );

  useGSAP(() => {
    // @ts-expect-error: GSAP
    if (!particlesRef.current || !particlesRef.current.children) return
    const tl = gsap.timeline()
    // @ts-expect-error: GSAP
    gsap.utils.toArray(particlesRef.current.children).forEach((element, i) => {
      const odd = i % 2 === 1
      const duration = Math.floor(Math.random() * 5) + 2
      const y = Math.floor((Math.random() * -500) + 300)
      const x = Math.floor((Math.random() * 200) + 100)
      // @ts-expect-error: GSAP
      tl.fromTo(element, { opacity: 0 }, { opacity: 1, duration: 1 }, '0.5')
      // @ts-expect-error: GSAP
      tl.to(element, { x: odd ? x : x * -1, y, duration }, '0.5')
      // @ts-expect-error: GSAP
      tl.to(element, { opacity: 0, duration: duration - 1.5 }, '2')
    })
  }, {
    dependencies: [particles]
  })

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!alert.created_at) return
      removeAlert(alert.created_at)
    }, 12000)
  
    return () => clearTimeout(timer)
  }, [alert.created_at])

  return (
    <div className="w-[1200px] h-[1000px] overflow-hidden flex items-center justify-center">
      <div className="relative p-10 flex item-center justify-center" ref={containerRef}>
        <div
          className={`${[
            "bg-neutral-950 opacity-50 blur-[50px] w-[800px] h-[250px]",
            "absolute top-1/2 -translate-y-1/2 rounded-full left-1/2 -translate-x-1/2"
          ].join(' ')}`}
          ref={bgRef}
        ></div>
        <Image
          src='/lens-blur.png'
          width={500}
          height={500}
          alt='Image of a lens blur'
          className="absolute scale-125 top-0 -translate-y-[20px] -translate-x-[10px]"
          ref={lensRef}
        />
        <Image
          src='/lens-rays.png'
          width={500}
          height={500}
          alt='Image of a lens blur'
          className="absolute scale-125 top-0 -translate-y-[20px] -translate-x-[10px]"
          ref={raysRef}
        />
        <div ref={svgRef}>
          <MHWQuestComplete
            className={`${[].join(' ')}`}
            color={`rgba(${svgColor},${opacity})`}
            bgColor={`rgba(${orangeRGB},1)`}
            size="500px"
          />
        </div>
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
            {alert.type === 'sub' && alert.notice_type === 'sub' && alert.sub.sub_tier !== '1000' && <div>Tier&nbsp;{parseInt(alert.sub.sub_tier) / 1000}</div>}
            {alert.type === 'sub' && alert.notice_type === 'resub' && <div className="whitespace-nowrap">Resub{alert.resub.cumulative_months > 1 && ` x${alert.resub.cumulative_months}`}</div>}
            {isPrime && <div>Prime</div>}
          </div>
        </div>
        <div ref={particlesRef}>
          {particles.length > 0 && particles.map(particle => particle)}
        </div>
      </div>
    </div>
  )
}

export default SubAlert