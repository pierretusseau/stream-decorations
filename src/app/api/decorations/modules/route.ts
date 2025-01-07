'server-only'

import { createSupaClient } from '@/lib/supabase-service-decorations'

import {
  NextRequest,
  NextResponse
} from 'next/server'

export async function GET(
  req: NextRequest,
) {
  console.log('Fetching modules...')
  const { searchParams } = new URL(req.url)
  const key = searchParams.get('key')

  if (key !== process.env.SUPABASE_DECORATION_SERVICE_KEY) return NextResponse.json({
    code: 403,
    body: { message: 'Unauthorized' }
  })

  const supabase = await createSupaClient(key)
  const { data, error } = await supabase
    .from('modules')
    .select()
  
  if (error) return NextResponse.json({
    code: 500,
    body: { message: 'Error while fetching modules from Supabase' }
  })

  return NextResponse.json({
    code: 200,
    data: data,
    body: { message: 'Fetched modules from supabase with success' }
  })
}