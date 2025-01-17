import React from 'react'

function Event({
  event
}: {
  event: TwitchEvent
}) {
  console.log(event)
  const eventStyles = [
    'bg-neutral-950',
    'rounded-lg',
    'py-2 px-4',
    'flex justify-between items-center gap-8'
  ].join(' ')
  return (
    <div className={`group/twitch-event ${eventStyles}`}>
      <div>{event.user_name}</div>
      <div>{event.type}</div>
    </div>
  )
}

export default Event