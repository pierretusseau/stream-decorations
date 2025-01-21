import React, { useRef } from 'react'
import gsap from 'gsap';
import { useGSAP } from '@gsap/react';

gsap.registerPlugin(useGSAP);

function TextAnnounce({
  announce,
  timer,
  follower,
  sub,
  raid,
}: {
  announce: Announce
  timer: number
  follower: AlertBase & FollowAlert | null
  sub: AlertBase & (SubAlert | ResubAlert | CommunitySubGiftAlert) | null
  raid?: AlertBase & RaidAlert
}) {
  const userRef = useRef(null)
  const textRef = useRef(null)

  const timerInSecond = timer / 1000

  useGSAP(() => {
    const tl = gsap.timeline()
    tl.fromTo(textRef.current, {
      opacity: 0, x: -10
    }, {
      opacity: 1, x: 0, duration: 0.4
    })
    tl.fromTo(userRef.current, {
      opacity: 0, x: 10
    }, {
      opacity: 1, x: 0, duration: 1, ease: 'power1.out'
    })
    tl.to(textRef.current, { opacity: 0, x: -10, duration: 0.2 }, timerInSecond - 0.4)
    tl.to(userRef.current, { opacity: 0, x: 10, duration: 0.2 }, timerInSecond - 0.4)
  }, [announce])

  const subText = announce.type === 'sub'
    ? sub && sub.notice_type === 'sub'
      ? `Sub ${sub.sub.is_prime && 'Prime'}`
      : sub && sub.notice_type === 'resub'
      ? `Resub${sub.resub.is_prime && ' Prime'} x${sub.resub.cumulative_months}`
      : sub && sub.notice_type === 'community_sub_gift'
      ? `Subgift x${sub.community_sub_gift.total}`
      : null
    : null

  const raidText = announce.type === 'raid' && raid
    ? `Raid of ${raid.viewers}`
    : null

  return (
    <div className="overflow-hidden flex justify-between items-center w-full px-4">
      <div
        ref={textRef}
        className="text-3xl font-teko font-light"
      >
        {announce.type === 'follow' && 'Follow'}
        {subText}
        {raidText}
      </div>
      <div
        ref={userRef}
        className="text-3xl font-teko"
      >
        {announce.type === 'follow' && follower && follower.user_name}
        {announce.type === 'sub' && sub && sub.user_name}
        {announce.type === 'raid' && raid && raid.user_name}
      </div>
    </div>
  )
}

export default TextAnnounce