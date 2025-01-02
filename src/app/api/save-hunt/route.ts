import 'server-only'

import { NextRequest, NextResponse } from 'next/server'
import { createSupaClient } from '@/lib/supabase-service'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  // { params }: { params: { id: number }}
) {
  const { service_key, monster, weapon, time, hunt_id, video_uri } = await req.json()
  const supabase = await createSupaClient(service_key)

  const newHunt = Object.fromEntries(
    Object.entries({
      monster: monster,
      weapon: weapon,
      time: time,
      id: hunt_id,
      video_uri: video_uri,
    })
      // eslint-disable-next-line @typescript-eslint/no-unused-vars
      .filter(([_, value]) => value !== undefined)
  ) as Hunt

  console.log('new hunt', newHunt)
  
  const { data, error } = await supabase
    .from('hunts')
    .upsert(newHunt)
  
  if (error) {
    console.log('Error upserting hunt')
    console.log(error)
    return NextResponse.json({
      code: 500,
      error: error,
      body: { message: `Error while upserting hunt`}
    })
  } else {
    console.log('Upserted hunt with success')
    console.log(data)
    return NextResponse.json({
      code: 200,
      body: { message: `${hunt_id ? 'Created new' : 'Edited'} hunt`}
    })
  }
}