'server-only'

import { createSupaClient } from '@/lib/supabase-service-decorations'

import {
  NextRequest,
  NextResponse
} from 'next/server'
import { redirect } from 'next/navigation'

export async function GET(
  req: NextRequest,
) {
  const { searchParams } = new URL(req.url)
  const code = searchParams.get('code')
  const state = searchParams.get('state')

  if (!code) return NextResponse.json({
    code: 500,
    body: { message: `Missing Twitch code`}
  })
  if (process.env.AUTH_TWITCH_STATE !== state) return NextResponse.json({
    code: 401,
    body: { message: `Huun huuun vous n'avez pas dit le mot magique !` }
  })

  fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      "Content-Type" : "application/x-www-form-urlencoded"
    },
    body: new URLSearchParams({
      "client_id": process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
      "client_secret": process.env.AUTH_TWITCH_SECRET!,
      "code": code,
      "grant_type": "authorization_code",
      "redirect_uri": "http://localhost:3000/api/auth/callback/twitch"
    }),
  }).then(res => res.json())
    .then(async (res) => {
      console.log('Response from Twitch')
      console.log(res)
      const supabase = await createSupaClient(process.env.SUPABASE_DECORATION_SERVICE_KEY!)
      
      const { error } = await supabase
        .from('twitch_tokens')
        .upsert({
          id: 1,
          ...res
        })
      
      if (error) {
        throw new Error('Error while adding token in supabase')
      }
    })
    .catch(err => {
      console.log('Error while getting response from twitch')
      console.log(err)
    })

  redirect('/')
  return NextResponse.json({
    code: 200,
    body: { message: `Ok`}
  })
}

