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

  const timerInSecond = timer / 1000

  useGSAP(
    () => {
      const tl = gsap.timeline()
      tl.set(imageRef.current, {opacity: 0})
      tl.fromTo(
        imageRef.current,
        {
          x: '110%',
          opacity: 0
        },
        {
          x: "0%",
          opacity: 1,
          duration: 1 
        }, "+=5")
      tl.fromTo(
        chipRef.current,
        {
          x: '-110%',
          opacity: 0,
        },
        {
          x: "0%",
          opacity: 1,
          duration: 1 
        })
      tl.fromTo(
        textRef.current,
        {
          x: '-110%',
          opacity: 0,
        },
        {
          x: "0%",
          opacity: 1,
          duration: 1 
        }, "<0.2")
      tl.fromTo(
        imageRef.current,
        {
          x: "0%",
          opacity: 1,
        },
        {
          x: '110%',
          opacity: 0,
          duration: 0.4 
        }, timerInSecond - 1)
      tl.fromTo(
        chipRef.current,
        {
          x: "0%",
        },
        {
          x: '-110%',
          duration: 0.4 
        }, timerInSecond - 1.9)
      tl.fromTo(
        textRef.current,
        {
          x: "0%",
        },
        {
          x: '-110%',
          duration: 0.4 
        }, timerInSecond - 2)
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
    "font-bold text-2xl"
  ].join(' ')

  return (
    <div
      // ref={container}
    >
      <div
        className="group/announce flex gap-4 items-center"
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
      </div>
    </div>
  )
}

export default Announce