'server-only'

import { createSupaClient } from '@/lib/supabase-service-decorations'

import {
  NextRequest,
  NextResponse
} from 'next/server'

export async function POST(
  req: NextRequest,
) {
  console.log('Fetching service key...')
  const { code } = await req.json()

  if (!code) return NextResponse.json({
    status: 500,
    body: { message: 'Module code not provided' }
  })
  const envServiceKey = process.env.SUPABASE_DECORATION_SERVICE_KEY
  if (!envServiceKey) return NextResponse.json({
    status: 500,
    body: { message: 'Missing env service key' }
  })

  const supabase = await createSupaClient(envServiceKey)
  const { data, error } = await supabase
    .from('modules')
    .select()

  if (error) return NextResponse.json({
    status: 500,
    body: { message: 'Error while fetching modules list from Supabase' }
  })

  const deco_module = data?.find(mod => mod.code === code)
  if (deco_module) {
    return NextResponse.json({
      status: 200,
      ok: true,
      service_key: envServiceKey,
      body: { message: `Module ${deco_module.type} found, sending service key` }
    })
  }
  
  return NextResponse.json({
    status: 403,
    body: { message: 'Unauthorized' }
  })
}