import React, {
  useCallback,
  useEffect,
  useRef,
} from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import { Howl } from 'howler'
import { pauseAlerts, removeAlert } from '@/store/useAlertStore'
import Particles from '@/components/Twitch/Alert/Particles'
import RaidAlertSvg from '@/components/Twitch/Alert/RaidAlert/RaidAlertSvg'
import RaidAlertText from '@/components/Twitch/Alert/RaidAlert/RaidAlertText'

// https://www.twitch.tv/kanaioshimi/clip/JoyousInterestingGoatPogChamp-iBOp3b5xqYIOCt0v
const redRGB = "197,12,12"
const timingOut = "9.3"

function RaidAlert({
  alert,
}: {
  alert: Alert
}) {
  const containerRef = useRef(null)
  const imageRef = useRef(null)
  const bgRef = useRef(null)
  
  const callSound = useCallback((src: string, fade?: {
    from?: number
    to?: number
    duration: number
    id?: number
  }) => {
    const sound = new Howl({
      src,
      // html5: true,
    })
    sound.play()
    console.log(fade)
    if (fade) sound.fade(fade.from || 0, fade.to || 1, fade.duration)
    
    return sound
  }, [])
  
  useEffect(() => {
    const sfx = callSound('/sounds/bazelgeuse.mp3')
    const music = callSound('/sounds/bazel_music.mp3', {from: 0, to: 1, duration: 2000})
    return () => {
      sfx.unload()
      music.unload()
    }
  }, [callSound])
  
  useGSAP(
    () => {
      const tl = gsap.timeline()
      tl.set(containerRef.current, {opacity: 0})
      tl.to(containerRef.current, {opacity: 1, duration: 1})
      tl.fromTo(containerRef.current, {
        scale: 0.5,
      }, {
        scale: 1,
        duration: 0.8,
        ease: "power1.out"          
      }, '0')
      tl.fromTo(bgRef.current,
        { scale: 0 }, { scale: 1, duration: 2 },
      '0.2')
      tl.fromTo(imageRef.current, {
        opacity: 0, scale: 0.8
      }, {
        opacity: 0.1, scale: 1.7,
        duration: 7, ease: 'power1.out'
      }, '0.3')
      tl.to(imageRef.current, {
        opacity: 0, scale: 1, duration: 1
      }, timingOut)
      tl.to(bgRef.current, {
        opacity: 0, duration: 2
      }, timingOut)
      tl.to(containerRef.current, {
        rotate: -5, duration: 6
      }, timingOut)
      tl.to(containerRef.current, {
        y: 50, opacity: 0, duration: 6, ease: "power4.out"
      }, timingOut)
    }
  )
  
  useEffect(() => {
    const timer = setTimeout(() => {
      if (!alert.created_at) return
      removeAlert(alert.created_at)
      pauseAlerts()
    }, 18000)
  
    return () => clearTimeout(timer)
  }, [alert.created_at])

  return (
    <div className="w-[1200px] h-[1000px] overflow-hidden flex items-center justify-center">
      <div className="relative p-10 flex item-center justify-center" ref={containerRef}>
        <div
          className={`${[
            "bg-neutral-950 opacity-50 blur-[50px] w-[800px] h-[600px]",
            "absolute top-1/2 -translate-y-1/2 rounded-full left-1/2 -translate-x-1/2"
          ].join(' ')}`}
          ref={bgRef}
        ></div>
        <RaidAlertSvg
          mainColor={redRGB}
          secondaryColor={redRGB}
          timingOut={timingOut}
        />
        <RaidAlertText
          alert={alert}
          color={redRGB}
          timingOut={timingOut}
        />
        
        <Particles
          color={redRGB}
          bgColor={redRGB}
          numberOfParticles={90}
        />
      </div>
    </div>
  )
}

export default RaidAlert