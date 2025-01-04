import 'server-only'

import { NextRequest, NextResponse } from 'next/server'
import { createSupaClient } from '@/lib/supabase-service-amaw'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  // { params }: { params: { id: number }}
) {
  const { service_key, hunt_id } = await req.json()
  const supabase = await createSupaClient(service_key)
  
  const { data, error } = await supabase
    .from('hunts')
    .delete()
    .eq('id', hunt_id)
  
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