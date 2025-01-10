'server-only'

import {
  NextRequest,
  NextResponse
} from 'next/server'

export async function POST(
  req: NextRequest
) {
  console.log('Checking state code is valid...')
  const { state } = await req.json()

  const ENV_STATE = process.env.AUTH_TWITCH_STATE
  if (!ENV_STATE) return NextResponse.json({
    status: 500,
    body: { message: 'Missing AUTH_TWITCH_STATE' }
  })

  if (state !== process.env.AUTH_TWITCH_STATE) return NextResponse.json({
    status: 403,
    body: { message: 'Unauthorized' }
  })

  const clientID = process.env.NEXT_PUBLIC_AUTH_TWITCH_ID
  const clientSecret = process.env.AUTH_TWITCH_SECRET
  if (!clientID || !clientSecret) return NextResponse.json({
    status: '500',
    body: { message: 'Missing Client ID or Client Secret' }
  })

  const params = new URLSearchParams()
  params.append('client_id', clientID)
  params.append('client_secret', clientSecret)
  params.append('grant_type', 'client_credentials')

  const token = await fetch('https://id.twitch.tv/oauth2/token', {
    method: "POST",
    headers: { 'Content-Type': 'application/x-www-form-urlencoded' },
    body: params
  }).then(res => res.json())
    .then(res => res)
    .catch(err => NextResponse.json({
      status: 500,
      body: { message: err }
    }))
  
  const now = new Date();
  const expirationTime = now.getTime() + (token.expires_in * 1000)
  const expirationDate = new Date(expirationTime)
  
  const tokenWithExpirationDate = {
    ...token,
    expiration_date: expirationDate
  }

  return NextResponse.json({
    status: 200,
    token: tokenWithExpirationDate,
    body: { message : 'Ok' }
  })
}