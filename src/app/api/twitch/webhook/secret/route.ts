'server-only'

import { createSupaClient } from '@/lib/supabase-service-decorations'

import {
  NextRequest,
  NextResponse
} from 'next/server'

export async function POST(
  req: NextRequest,
) {
  console.log('Asking for Webhook secret...')
  const { moduleCode } = await req.json()

  if (!moduleCode) return NextResponse.json({
    code: 500,
    body: { message: 'You didn\'t provide a module code' }
  })

  // Env variable checks
  const serviceKey = process.env.SUPABASE_DECORATION_SERVICE_KEY

  if (!serviceKey) return NextResponse.json({
    code: 500,
    body: { message: 'Supabase Service Key not setup in env variables' }
  })

  // Accessing DB
  const supabase = await createSupaClient(serviceKey as string)
  const { data: foundModules, error } = await supabase
    .from('modules')
    .select('code, type')
    .eq('code', moduleCode)
    // .single()

  if (error) return NextResponse.json({
    code: 500,
    body: { message: 'Error while getting modules list from Supabase' }
  })
  
  console.log('Module found :', foundModules)

  // Verify if module exists
  if (!foundModules.length) return NextResponse.json({
    code: 403,
    body: { message: 'Module code is invalid' }
  })

  const secret = process.env.WEBHOOK_SECRET
  if (!secret) return NextResponse.json({
    code: 500,
    body: { message: 'Webhook secret is missing in env variables' }
  })

  return NextResponse.json({
    code: 200,
    secret,
    body: { message: 'Ok' }
  })
}