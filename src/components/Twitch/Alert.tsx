import React from 'react'
import FollowerAlert from '@/components/Twitch/Alert/FollowerAlert'

function Alert({
  type,
  content,
  timestamp,
  animationFinished
}: {
  type: 'follower'
  content: string
  timestamp: number
  animationFinished: (timestamp: number) => void
}) {
  if (type === 'follower') {
    return <FollowerAlert
      content={content}
      timestamp={timestamp}
      animationFinished={animationFinished}
    />
  } else {
    return <div>Unknown alert</div> 
  }
}

export default Alert