import React from 'react'
import TwitchAlerts from '@/components/TwitchAlerts'

export const dynamic = 'force-dynamic'

export default async function TwitchAlertsPage({
  params,
}: {
  params: Promise<{ code: string }>
}) {
  const { code } = await params

  if (!code) {
    return <div>Provide a code</div>
  } else {
    return <TwitchAlerts
      code={code}
    />
  }
}