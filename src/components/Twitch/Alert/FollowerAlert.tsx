import React, { useEffect, useRef, useCallback } from 'react'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'
import Image from 'next/image'
import { Howl } from 'howler'
import { pauseAlerts, removeAlert } from '@/store/useAlertStore'
import FollowerAlertSvg from '@/components/Twitch/Alert/FollowerAlert/FollowerAlertSvg'
import FollowerAlertText from '@/components/Twitch/Alert/FollowerAlert/FollowerAlertText'

gsap.registerPlugin(useGSAP)

const greenRGB = "37,122,47"
const timingOut = "7"

function FollowerAlert({ alert }:{ alert: Alert }) {
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
    if (fade) sound.fade(fade.from || 0, fade.to || 1, fade.duration)
    
    return sound
  }, [])

  useEffect(() => {
    const sfx = callSound('/sounds/mhw_quest_start_horn.mp3')
    const music = callSound('/sounds/rotten_vale_day_jingle.mp3', {from: 0, to: 1, duration: 2000})
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
        duration: 5, ease: 'power1.out'
      }, '0.3')
      tl.to(imageRef.current, {
        opacity: 0, scale: 1, duration: 1
      }, timingOut)
      tl.to(bgRef.current, {
        opacity: 0, duration: 2
      }, timingOut)
    }
  )

  useEffect(() => {
    const timer = setTimeout(() => {
      if (!alert.created_at) return
      removeAlert(alert.created_at)
      pauseAlerts()
    }, 12000)
  
    return () => clearTimeout(timer)
  }, [alert.created_at])

  return (
    <div className="w-[1200px] h-[1000px] overflow-hidden flex items-center justify-center">
      <div className="relative p-10 flex item-center justify-center" ref={containerRef}>
        <div
          className={`${[
            "bg-neutral-950 opacity-70 blur-[100px] w-[600px] h-[400px]",
            "absolute top-1/2 -translate-y-1/2 rounded-full left-1/2 -translate-x-1/2"
          ].join(' ')}`}
          ref={bgRef}
        ></div>
        <Image
          src='/heading_back_bg.png'
          width={790}
          height={317}
          alt='Background of heading back'
          className="absolute top-1/2 -translate-y-[50px] z-[-1]"
          ref={imageRef}
        />
        <FollowerAlertSvg
          mainColor={greenRGB}
          secondaryColor={greenRGB}
          timingOut={timingOut}
        />
        <FollowerAlertText
          alert={alert}
          color={greenRGB}
          timingOut={timingOut}
        />
      </div>
    </div>
  )
}

export default FollowerAlert