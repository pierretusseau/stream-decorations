import React, {
  useEffect,
  useRef,
  // useState
} from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
// import MHWQuestComplete from '@/components/Svg/MHWQuestComplete'
// import SplitType from 'split-type'
import Image from 'next/image'
import { Howl } from 'howler'
import { removeAlert } from '@/store/useAlertStore'
import Particles from '@/components/Twitch/Alert/Particles'
import SubAlertSvg from '@/components/Twitch/Alert/SubAlert/SubAlertSvg'
import SubAlertText from './SubAlert/SubAlertText'

gsap.registerPlugin(useGSAP)

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
  const lensRef = useRef(null)
  const raysRef = useRef(null)
  const bgRef = useRef(null)
  const particlesRef = useRef(null)

  const isPrime = alert.type === 'sub' && alert.notice_type === 'sub' && alert.sub.is_prime
    || alert.type === 'sub' && alert.notice_type === 'resub' && alert.resub.is_prime

  const callSound = (src: string, fadeTimer?: number) => {
    const sound = new Howl({
      src,
      html5: true,
    })
    sound.play()
    if (fadeTimer) sound.fade(1, 0, fadeTimer)
    
    return sound
  }

  useEffect(() => {
    const sfx = callSound('/sounds/mhw_quest_complete_cleaned.mp3', 2500)
    const music = callSound('/sounds/quest_complete_music.mp3')
    return () => {
      sfx.unload()
      music.unload()
    }
  }, [])
  
  useGSAP(() => {
    const tl = gsap.timeline()
    tl.fromTo(containerRef.current, {
      rotation: 90, scale: 1.5
    }, {
      rotation: 0, scale: 1,
      duration: 0.8,
      ease: "bounce.out"          
    }, '0')
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
    tl.to(bgRef.current, {
      opacity: 0, duration: 2
    }, "5.7")
  }, {
    dependencies: []
  });

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
        <SubAlertSvg
          mainColor={isPrime ? blueRGB : yellowRGB}
          secondaryColor={isPrime ? blueRGB : orangeRGB}
        />
        <SubAlertText
          color={isPrime ? blueRGB : yellowRGB}
          alert={alert}
          isPrime={isPrime}
        />
        <Particles
          numberOfParticles={numberOfParticles}
          prime={{
            isPrime,
            primeColor: blueRGB,
            nonPrimeColor: orangeRGB
          }}
          ref={particlesRef}
        />
      </div>
    </div>
  )
}

export default SubAlert