import React, { useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function Announce({
  announce,
  timer
}: {
  announce: Announce
  timer: number
}) {
  // const container = useRef<HTMLDivElement>(null);
  const imageRef = useRef(null)
  const chipRef = useRef(null)
  const textRef = useRef(null)
  const timerRef = useRef(null)

  const timerInSecond = timer / 1000

  useGSAP(
    () => {
      const tl = gsap.timeline()
      tl.set(imageRef.current, {opacity: 0})
      tl.fromTo(
        imageRef.current, {
          x: '110%', opacity: 0
        }, { x: "0%", opacity: 1,
          duration: 1 
        }, "+=5")
      tl.fromTo(
        chipRef.current, {
          x: '-110%', opacity: 0,
        }, { x: "0%", opacity: 1,
          duration: 1 
        })
      tl.fromTo(
        textRef.current, {
          x: '-110%', opacity: 0,
        }, { x: "0%", opacity: 1,
          duration: 1 
        }, "<0.2")
      tl.fromTo(
        imageRef.current, {
          x: "0%", opacity: 1,
        }, {
          x: '110%', opacity: 0,
          duration: 0.4 
        }, timerInSecond - 1)
      tl.fromTo(chipRef.current, {
          x: "0%",
        }, {
          x: '-110%',
          duration: 0.4 
        }, timerInSecond - 1.9)
      tl.fromTo(textRef.current, {
          x: "0%",
        }, {
          x: '-110%',
          duration: 0.4 
        }, timerInSecond - 2)
      tl.set(timerRef.current, {
        "--announces-origin": 'left'
      }, '4.7')
      tl.fromTo(timerRef.current, {
        scaleX: '0%',
      }, {
        scaleX: '100%',
        duration: timerInSecond - 5, ease: 'linear'
      }, '4.8')
      tl.set(timerRef.current, { "--announces-origin": 'right' })
      tl.to(timerRef.current, {
        scaleX: "0%", duration: 0.2
      })
    },
    {
      dependencies: [announce]
      // scope: container
    }
  );

  const announceColor = announce.color || '#fff'

  const chipStyles = [
    'rounded-full',
    'py-1 px-3',
    'text-md font-bold'
  ].join(' ')

  const textStyles = [
    "font-bold text-xl"
  ].join(' ')

  return (
    <div
      // ref={container}
      className="w-full"
    >
      <div
        className={`group/announce ${[
          "relative overflow-hidden",
          "flex pt-2 pb-3 px-2 gap-4 items-center w-full",
          "rounded-b-lg"
        ].join(' ')}`}
      >
        {announce.image && <div><Image
          ref={imageRef}
          src={`/${announce.image}`}
          width={50}
          height={50}
          alt={announce.image}
        /></div>}
        <div className="flex flex-col gap-1 items-start overflow-hidden">
          {announce.chip && <div
            ref={chipRef}
            className={`group/announce-chip ${chipStyles}`}
            style={{
              backgroundColor: announceColor
            }}
          >{announce.chip}</div>}
          <div
            ref={textRef}
            className={`group/announce-text ${textStyles}`}
            style={{
              // backgroundColor: announceColor
            }}
          >{announce.message}</div>
        </div>
        <div
          ref={timerRef}
          className={`${[
            "absolute bottom-0 left-0",
            "w-full h-[6px]",
            "origin-left",
            "opacity-85"
          ].join(' ')}`}
          style={{
            transformOrigin: 'var(--announces-origin)',
            backgroundColor: announceColor
          }}
        ></div>
      </div>
    </div>
  )
}

export default Announce