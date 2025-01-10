import useTwitchSubscriptions from '@/hooks/useTwitchSubscriptions'
import { TrashIcon } from '@heroicons/react/24/solid'
import { Button } from '@mui/material'
import React, { useState } from 'react'

const clientID = process.env.NEXT_PUBLIC_AUTH_TWITCH_ID

function EventSubSingle({
  subscription,
  token
}: {
  subscription: Subscription
  token?: TwitchAppToken
}) {
  const [deleting, setDeleting] = useState(false)
  const { refreshSubscriptions } = useTwitchSubscriptions()

  if (!clientID || !token) return null

  const handleClick = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    if (deleting) {
      fetch(`https://api.twitch.tv/helix/eventsub/subscriptions?id=${subscription.id}`, {
        method: 'DELETE',
        headers: {
          'Authorization': `Bearer ${token.access_token}`,
          'Client-Id': clientID
        }
      }).then(res => {
          console.log('Deleted Subscription response ----')
          if (res.ok) {
            console.log('Deleted :', res.url)
            refreshSubscriptions()
          } else {
            throw new Error(JSON.stringify(res))
          }
        })
        .catch(err => console.error(err))
    } else {
      setDeleting(true)
    }
  }
  const handleContextMenu = (e: React.MouseEvent<HTMLButtonElement, MouseEvent>) => {
    e.preventDefault()
    setDeleting(false)
  }

  return (
    <div className="flex gap-2 justify-between">
      <div
        className={[
          "bg-neutral-800 rounded-lg p-2 grow",
          "border-[1px] transition",
          deleting
            ? 'border-red-600'
            : 'border-[transparent]'
        ].join(' ')}
      >
        {Object.entries(subscription).map(([key, value]) => <pre
          key={`subscription-${subscription.id}-${key}`}
        >
          {key}: {typeof value === 'object' ? JSON.stringify(value) : value}
        </pre>)}
      </div>
      <Button
        color='error'
        onClick={(e) => handleClick(e)}
        onContextMenu={(e) => handleContextMenu(e)}
      ><TrashIcon className="size-6" /></Button>
    </div>
  )
}

export default EventSubSingle