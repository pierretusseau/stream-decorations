import React, { useEffect, useState } from 'react'
import useTwitchAppToken from '@/hooks/useTwitchAppToken'
import { Box, Button } from '@mui/material'
import useTwitchSubscriptions from '@/hooks/useTwitchSubscriptions'
import EventSubSingle from '@/app/components/Twitch/EventSubSingle'
import useTwitchStore from '@/store/useTwitchStore'
import { dateISOToRelativeDays } from '@/utils/utils'
import { TrashIcon } from '@heroicons/react/24/solid'

const clientID = process.env.NEXT_PUBLIC_AUTH_TWITCH_ID

function EventSub() {
  const { token, regenerateToken } = useTwitchAppToken()
  const subscriptions = useTwitchStore((state) => state.subscriptions)
  const { refreshSubscriptions } = useTwitchSubscriptions()
  const [displayOther, setDisplayOther] = useState(false)

  useEffect(() => {
    if (!subscriptions) refreshSubscriptions()
  }, [subscriptions, refreshSubscriptions, token])
  
  if (!subscriptions) return null

  const enabledSubs = subscriptions.data.filter(subscription => subscription.status === 'enabled')
  const otherSubs = subscriptions.data.filter(subscription => subscription.status !== 'enabled')

  const handleDeleteAllOther = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    e.stopPropagation()
    
    if (!clientID || !token) return

    let deleted = 0
    otherSubs.forEach(subscription => {
      fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscription.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
          'Client-Id': clientID
        }
      }).then(res => {
          console.log('Deleted Subscription response ----')
          if (res.ok) {
            deleted++
            console.log('Deleted', deleted, '/', otherSubs.length)
            if (deleted === otherSubs.length) refreshSubscriptions()
          } else {
            throw new Error(JSON.stringify(res))
          }
        })
        .catch(err => console.error(err))
    })
  }

  return (
    <div className="flex flex-col gap-6 min-w-screen-2xl">
      {token && <Box className="p-4 flex flex-col gap-4 border-[1px]">
        <pre>
          {Object.entries(token).map(([key, value]) => {
            return <div key={`debug-app-token-${key}`}>
              {key}: {value}
            </div>
          })}
        </pre>
        <Button onClick={() => regenerateToken()}>
          Regenerate Token {token.expiration_date && `(expire ${dateISOToRelativeDays(token?.expiration_date)})`}
        </Button>
      </Box>}
      {subscriptions && <Box className="flex flex-col gap-2 p-4 border-[1px]">
        <header className="flex justify-between items-center gap-2">
          <p>Total : {subscriptions.total}</p>
          <p>Total Cost : {subscriptions.total_cost}</p>
          <p>Max Total Cost : {subscriptions.max_total_cost}</p>
        </header>
        <div className="flex flex-col gap-4">
          <div className="flex flex-col gap-2">
            <p>Enabled {enabledSubs.length} / {subscriptions.total}</p>
            {enabledSubs.map(subscription => <EventSubSingle
              key={`subscription-${subscription.id}`}
              subscription={subscription}
              token={token}
            />)}
          </div>
          <div className="flex flex-col gap-2">
            <div
              onClick={() => setDisplayOther(!displayOther)}
              className="flex justify-between gap-2 items-center"
            >
              <p>Other  {otherSubs.length} / {subscriptions.total}</p>
              <Button
                color='error'
                onClick={(e) => handleDeleteAllOther(e)}
              ><TrashIcon className="size-4"/>Delete All</Button>
            </div>
            {displayOther && otherSubs.map(subscription => <EventSubSingle
              key={`subscription-${subscription.id}`}
              subscription={subscription}
              token={token}
            />)}
          </div>
        </div>
      </Box>}
    </div>
  )
}

export default EventSub