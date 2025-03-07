import React from 'react'
import TwitchFollowers from '@/components/TwitchFollowers'

export const dynamic = 'force-dynamic'

export default async function TwitchFollowersPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  if (!code) {
    return <div>Provide a code</div>
  } else {
    return <TwitchFollowers
      code={code}
    />
  }
}