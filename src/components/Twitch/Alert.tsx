import React from 'react'
import FollowerAlert from '@/components/Twitch/Alert/FollowerAlert'
import SubAlert from '@/components/Twitch/Alert/SubAlert'
import RaidAlert from '@/components/Twitch/Alert/RaidAlert'

function Alert({
  alert
}: {
  alert: Alert
}) {
  if (alert.type === 'follower') {
    return <FollowerAlert
      alert={alert}
    />
  } else if (alert.type === 'sub' && alert.notice_type !== 'community_sub_gift') {
    // Exception for the gifted resub
    if (alert.notice_type === 'resub' && alert.resub.is_gift) return null
    return <SubAlert
      alert={alert}
    />
  } else if (alert.type === 'sub' && alert.notice_type === 'community_sub_gift') {
    return <SubAlert
      alert={alert}
    />
  } else if (alert.type === 'raid') {
    return <RaidAlert
      alert={alert}
    />
  } else {
    return <div>Unknown alert</div> 
  }
}

export default Alert