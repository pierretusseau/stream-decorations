import React, { useCallback, useEffect, useState } from 'react'
import { createClient } from '@supabase/supabase-js'
import { Button } from '@mui/material'

const randomIDGenerator = () => {
  return Math.floor(Math.random() * 100000)
}

function AlertTester({
  serviceKey
}: {
  serviceKey: string
}) {
  const [displayingAlert, setDisplayingAlert] = useState(false)
  const [randomID, setRandomID] = useState<number>()

  useEffect(() => {
    setRandomID(randomIDGenerator())
  }, [])

  const handleAddFollower = useCallback(() => {
    setDisplayingAlert(true)
    const addDeleteFollower = async () => {
      const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_DECORATIONS_URL!, serviceKey)
      const { data, error } = await supabase
        .from('followers')
        .insert({
          user_id: randomID,
          user_login: `${randomID}`,
          user_name: `${randomID}`,
          followed_at: new Date().toISOString()
        })
        .select('user_id')
        .single()
      if (error) console.error(error)
      if (data) {
        console.log('Created test follower')
        setTimeout(async () => {
          const response = await supabase
            .from('followers')
            .delete()
            .eq('user_id', randomID)
          if (response) {
            setDisplayingAlert(false)
            setRandomID(randomIDGenerator())
          }
        }, 100)
      }
    }
    addDeleteFollower()
  }, [serviceKey, randomID])

  const handleAddSub = useCallback((options: {
    notice_type: string
    sub?: TwitchSub
    resub?: TwitchResub
    community_sub_gift?: TwitchCommunitySubGift
  }) => {
    setDisplayingAlert(true)
    const addDeleteSub = async () => {
      const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_DECORATIONS_URL!, serviceKey)
      const { data, error } = await supabase
        .from('subs')
        .insert({
          chatter_user_id: randomID,
          chatter_user_login: `${randomID}`,
          chatter_user_name: `${randomID}`,
          notice_type: options.notice_type,
          sub: options.sub,
          resub: options.resub,
          community_sub_gift: options.community_sub_gift
        })
        .select('id')
      if (error) console.error(error)
      if (data) {
        console.log('Created test sub')
        setTimeout(async () => {
          const { id } = data[0]
          const response = await supabase
            .from('subs')
            .delete()
            .eq('id', id)
          if (response) {
            setDisplayingAlert(false)
            setRandomID(randomIDGenerator())
          }
        }, 100)
      }
    }
    addDeleteSub()
  }, [serviceKey, randomID])

  const handleAddRaid = useCallback(() => {
    setDisplayingAlert(true)
    const addDeleteRaid = async () => {
      const supabase = await createClient(process.env.NEXT_PUBLIC_SUPABASE_DECORATIONS_URL!, serviceKey)
      const { data, error } = await supabase
        .from('raids')
        .insert({
          from_broadcaster_user_id: randomID,
          from_broadcaster_user_login: `${randomID}`,
          from_broadcaster_user_name: `${randomID}`,
          viewers: Math.floor(Math.random() * 1000)
        })
        .select('id')
      if (error) console.error(error)
      if (data) {
        console.log('Created test sub')
        setTimeout(async () => {
          const { id } = data[0]
          const response = await supabase
            .from('raids')
            .delete()
            .eq('id', id)
          if (response) {
            setDisplayingAlert(false)
            setRandomID(randomIDGenerator())
          }
        }, 100)
      }
    }
    addDeleteRaid()
  }, [serviceKey, randomID])

  return (
    <div>
      <div>
        <Button
          onClick={() => handleAddFollower()}
          disabled={displayingAlert}
        >New Follower ({randomID})</Button>
        <Button
          onClick={() => handleAddSub({
            notice_type: 'sub',
            sub: {
              duration_months: 1,
              sub_tier: "3000",
              is_prime: false,
            }
          })}
          disabled={displayingAlert}
        >New Sub T3({randomID})</Button>
        <Button
          onClick={() => handleAddSub({
            notice_type: 'sub',
            sub: {
              duration_months: 1,
              sub_tier: "1000",
              is_prime: true,
            }
          })}
          disabled={displayingAlert}
        >New Sub Prime({randomID})</Button>
        <Button
          onClick={() => handleAddSub({
            notice_type: 'resub',
            resub: {
              cumulative_months: 100,
              duration_months: 1,
              streak_months: 99,
              sub_tier: "1000",
              is_prime: false,
              is_gift: false,
              gifter_is_anonymous: null,
              gifter_user_id: null,
              gifter_user_name: null,
              gifter_user_login: null,
            }
          })}
          disabled={displayingAlert}
        >Resub x100({randomID})</Button>
        <Button
          onClick={() => handleAddSub({
            notice_type: 'community_sub_gift',
            community_sub_gift: {
              id: '123456789',
              total: 1,
              cumulative_total: 20,
              sub_tier: "2000",
            }
          })}
          disabled={displayingAlert}
        >Sub Gift x1 T2({randomID})</Button>
        <Button
          onClick={() => handleAddSub({
            notice_type: 'community_sub_gift',
            community_sub_gift: {
              id: '123456789',
              total: 20,
              cumulative_total: 20,
              sub_tier: "1000",
            }
          })}
          disabled={displayingAlert}
        >Sub Gift x20({randomID})</Button>
        <Button
          onClick={() => handleAddRaid()}
          disabled={displayingAlert}
        >Raid ({randomID})</Button>
      </div>
    </div>
  )
}

export default AlertTester