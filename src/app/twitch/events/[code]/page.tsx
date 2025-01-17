import React from 'react'
import TwitchEvents from '@/components/TwitchEvents'

export const dynamic = 'force-dynamic'

export default async function TwitchEventsPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  return <TwitchEvents code={code} />
}