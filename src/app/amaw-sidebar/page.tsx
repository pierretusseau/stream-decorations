'use client';

import React from 'react'
import Image from 'next/image'
// Constants
const screen_height = 1440
const cam_height = 320
const sidebar_height = screen_height - cam_height
const sidebar_width = 420

function index() {
  
  return (
    <div
      className={`group/sidebar ${[
        "w-[340px]",
        'relative',
        'overflow-hidden',
        'flex flex-col'
      ].join(' ')}`}
      style={{
        height: sidebar_height
      }}
    >
      <div className={`group/sidebar-background ${[
        'w-full h-full',
        'absolute top-0 left-0',
        'z-0'
      ].join(' ')}`}>
        <Image
          src='/bronze-gradient.png'
          width={516}
          height={1176}
          alt="Background image"
          className="object-cover h-full"
        />
      </div>
      <div className={`group/sidebar-content ${[
        'relative z-10',
      ].join(' ')}`}>
        Content
      </div>
      <div className={`group/bottom-deco ${[
        'relative z-10',
        `w-[${sidebar_width}px] h-[79px]`,
        'overflow-hidden',
        'mt-auto',
      ].join(' ')}`}>
        <Image
          src='/white-bar-full.png'
          width={1016}
          height={79}
          alt="White bar full"
          className="h-full object-left min-w-[1016px] absolute left-0 top-0"
          style={{
            animation: "60s linear image_banner infinite"
          }}
        />
        <Image
          src='/white-bar-full.png'
          width={1016}
          height={79}
          alt="White bar full"
          className="h-full object-left min-w-[1016px] absolute left-[1016px] top-0"
          style={{
            animation: "60s linear image_banner infinite"
          }}
        />
      </div>
    </div>
  )
}

export default index