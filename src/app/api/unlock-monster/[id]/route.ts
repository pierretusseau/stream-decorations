import 'server-only'

import { NextRequest, NextResponse } from 'next/server'
import { createSupaClient } from '@/lib/supabase-service'

export const dynamic = 'force-dynamic'

export async function POST(
  req: NextRequest,
  { params }: { params: { id: number }}
) {
  const { id } = await params
  const { service_key } = await req.json()
  const supabase = await createSupaClient(service_key)
  
  console.log('Changed monster unlock state')
  
  const { data: monsterToChange, error: errorMonsterToChange } = await supabase
    .from('monsters')
    .select('unlocked')
    .eq('id', id)
    .single()
  
  if (errorMonsterToChange) {
    console.log('Error selecting monster')
    console.log(errorMonsterToChange)
    return NextResponse.json({
      code: 500,
      error: errorMonsterToChange,
      body: { message: `Error while selecting monster`}
    })
  }

  const { data, error } = await supabase
    .from('monsters')
    .update({ unlocked: !monsterToChange.unlocked})
    .eq('id', id)
    .select()
    .single()
  
    if (error) {
      console.log('Error updating monster')
      console.log(errorMonsterToChange)
      return NextResponse.json({
        code: 500,
        error: errorMonsterToChange,
        body: { message: `Error while updating monster`}
      })
    }
  
  
  console.log('Changed monster lock with')
  console.log(data)
  return NextResponse.json({
    code: 200,
    unlocked: data.unlocked,
    body: { message: `Monster updated with success`}
  })
}