import React from 'react'
import TwitchFollowers from '@/app/components/TwitchFollowers'

export const dynamic = 'force-dynamic'

export default async function TwitchFollowersPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params
  return <TwitchFollowers
    code={code}
  />
}