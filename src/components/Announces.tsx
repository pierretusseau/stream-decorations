'use client'

import React, { useCallback, useEffect, useState } from 'react'
import Announce from '@/components/Announces/Announce'
import TextAnnounce from '@/components/Announces/TextAnnounce'
import { initAnnounces } from '@/store/useAnnounceStore'
import useEventStore, { subscribeToAllTables, fetchAllTables } from '@/store/useEventStore'

const announceTimer = 30000

function Announces({
  code,
  announces
}: {
  code: string
  announces: Announce[]
}) {
  const [activeAnnounce, setActiveAnnounce] = useState<number>(0)
  const [serviceKey, setServiceKey] = useState()
  const followers = useEventStore((state) => state.followers)
  const subs = useEventStore((state) => state.subs)
  const events = useEventStore((state) => state.events)

  useEffect(() => {
    fetch('/api/decorations/service-key', {
      method: 'POST',
      body: JSON.stringify({code})
    }).then(res => res.json())
      .then(res => {
        const { status, ok, service_key, body } = res
        if (status !== 200 || !ok) throw new Error(body.message)
        setServiceKey(service_key)
      })
      .catch(err => console.error(err))
  }, [code])

  useEffect(() => {
    initAnnounces()
  }, [])

  useEffect(() => {
    if (!serviceKey) return
    fetchAllTables(serviceKey, false)
    subscribeToAllTables(serviceKey)
  }, [serviceKey])

  const nextAnnounce = useCallback(() => {
    const hasRaid = events.filter(event => event.type === 'raid')[0]
    if (activeAnnounce >= 0 && announces[activeAnnounce + 1].type === 'raid' && !hasRaid) {
      setActiveAnnounce(-4) // Twice amount of wait between two full loops
    } else if (announces.length > activeAnnounce + 1) {
      setActiveAnnounce(activeAnnounce + 1)
    } else {
      setActiveAnnounce(-4) // Twice amount of wait between two full loops
    }
  }, [announces, activeAnnounce, events])
  
  useEffect(() => {
    const intervalID = setInterval(nextAnnounce, announceTimer)
    return () => clearInterval(intervalID)
  }, [nextAnnounce])

  const currentAnnounce = announces
    .filter(announce => {
      if (announce.type === 'raid' && !events.some(event => event.type === 'raid')) return false
      return true
    })
    .find((_,i) => i === activeAnnounce)

  const lastFollower = events.some(event => event.type === 'follower')
    ? events.filter(event => event.type === 'follower')[0]
    : followers.length > 0
    ? {
      type: 'follower',
      created_at: new Date(followers[0].followed_at).getTime(),
      user_name: followers[0].user_name,
    } as AlertBase & FollowAlert
    : null
  const lastSub = events.some(event => event.type === 'sub')
    ? events.filter(event => event.type === 'sub')[0]
    : subs.length > 0
    ? Object.assign({
      type: 'sub',
      created_at: new Date(subs[0].created_at).getTime(),
      user_name: subs[0].chatter_user_name,
      notice_type: subs[0].notice_type,
      resub: subs[0].resub,
      community_sub_gift: subs[0].community_sub_gift
    }) as AlertBase & (SubAlert | ResubAlert | CommunitySubGiftAlert)
    : null
  const raid = events.filter(event => event.type === 'raid')[0]

  const textAnnouncesTypes = ['follow', 'sub', 'raid']

  return (
    <div
      className="w-[457px] h-[80px] rounded-lg flex items-center overflow-hidden transition"
      style={{
        backgroundColor: activeAnnounce < 0 || !currentAnnounce ? 'rgba(0,0,0,0)' : 'rgba(0,0,0,0.5)'
      }}
    >
      {activeAnnounce < 0 || !currentAnnounce
        ? <div></div>
        : textAnnouncesTypes.some(a => a === announces[activeAnnounce].type)
        ? <TextAnnounce
          announce={currentAnnounce}
          timer={announceTimer}
          follower={lastFollower}
          sub={lastSub}
          raid={raid}
        />
        : <Announce
          announce={currentAnnounce}
          timer={announceTimer}
        />
      }
    </div>
  )
}

export default Announces