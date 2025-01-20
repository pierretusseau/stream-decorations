'use client'

import React, { useState, useRef } from 'react'
import Image from 'next/image'
import gsap from 'gsap'
import { useGSAP } from '@gsap/react'

gsap.registerPlugin(useGSAP)

const camera_width = 314
const camera_height = 228
// const circles1_size = 100
// const circles4_size = 30

function CamLayout() {
  const imageRef = useRef(null)
  const [borderTurn, setBorderTurn] = useState(0)
  const [imageBrightness, setImageBrightness] = useState(0)

  useGSAP(() => {
    const tl = gsap.timeline({ repeat: -1 })
    const borderProxyTurn = { value: borderTurn }
    tl.to(borderProxyTurn, {
      value: 1, duration: 60, ease: 'linear',
      onUpdate: () => setBorderTurn(borderProxyTurn.value)
    })
    const imageProxyBrightness = { test: imageBrightness }
    tl.to(imageProxyBrightness, {
      test: 50, duration: 0.3,
      onUpdate: () => setImageBrightness(imageProxyBrightness.test)
    }, '0.2')
    tl.to(imageRef.current, { opacity: 0, duration: 0.3 }, '0.2')
    tl.to(imageProxyBrightness, {
      test: 0, duration: 0.1,
      onUpdate: () => setImageBrightness(imageProxyBrightness.test)
    }, '0.5')
    tl.to(imageRef.current, { opacity: 1, duration: 1 }, '0.6')
  })

  return (
    <div
      className="p-20"
    >
      <div
        className={[
          'relative',
          'border-[2.5px]',
        ].join(' ')}
        style={{
          width: `${(camera_width * 1)}px`,
          height: `${(camera_height * 1)}px`,
          borderWidth: '1px',
          borderImageSlice: 1,
          borderImageSource: `conic-gradient(from ${borderTurn}turn, white 0.5%, black 1%, black 40%, white 50%, black 50.5%, black 90%, white 100%)`,
        }}
      >
        <Image
          ref={imageRef}
          src='/corner-double-2.png'
          width={camera_width}
          height={camera_height}
          alt="Video corner"
          className="absolute -top-[0px] -left-[0px] z-10"
          style={{
            filter: `brightness(${imageBrightness})`
          }}
        />
        {/* <Image
          src='/circles-1.png'
          width={circles1_size}
          height={circles1_size}
          alt="Circles 1"
          className={[
            `absolute z-0 opacity-50`,
          ].join(' ')}
          style={{
            animation: 'full_spin infinite 120s linear -z-10',
            top: `-${circles1_size / 2}px`,
            left: `-${circles1_size / 2}px`,
          }}
        /> */}
        {/* <Image
          src='/circles-4.png'
          width={circles4_size}
          height={circles4_size}
          alt="Circles 4"
          className={[
            `absolute z-20`,
          ].join(' ')}
          style={{
            animation: 'full_spin infinite reverse 60s linear',
            top: `-${circles4_size / 2}px`,
            left: `-${circles4_size / 2}px`,
          }}
        /> */}
      </div>
    </div>
  )
}

export default CamLayout