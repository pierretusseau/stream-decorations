import type { SupabaseClient } from '@supabase/supabase-js'
import { NextRequest } from 'next/server';
import crypto from 'crypto'

const TWITCH_MESSAGE_ID = 'Twitch-Eventsub-Message-Id'.toLowerCase();
const TWITCH_MESSAGE_TIMESTAMP = 'Twitch-Eventsub-Message-Timestamp'.toLowerCase();

export const refreshToken = async (
  tokens: {
    access_token: string
    refresh_token: string
  },
  supabase: SupabaseClient
) => {
  console.log('Askin for a new token through refresh token...')
  const access_token = await fetch('https://id.twitch.tv/oauth2/token', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/x-www-form-urlencoded'
    },
    body: new URLSearchParams({
      "client_id": process.env.NEXT_PUBLIC_AUTH_TWITCH_ID!,
      "client_secret": process.env.AUTH_TWITCH_SECRET!,
      "grant_type": "refresh_token",
      "refresh_token": tokens.refresh_token
    })
  }).then(refreshRes => refreshRes.json())
    .then(async (refreshRes) => {
      const { error: refreshTokenError } = await supabase
        .from('twitch_tokens')
        .update({
          access_token: refreshRes.access_token,
          expires_in: refreshRes.expires_in,
          refresh_token: refreshRes.refresh_token,
          scope: refreshRes.scope,
          token_type: refreshRes.token_type,
        })
        .eq('id', 1)
      if (refreshTokenError) {
        console.log('Error while update Supabase tokens')
        console.log(refreshTokenError)
        throw new Error('Error while update Supabase tokens')
      } else {
        return refreshRes.access_token
      }
    }).catch(err => {
      throw new Error(err)
    })
  
  return access_token
}

export const getHmacMessage = async (request: NextRequest, body: string) => {
  const values = [
    request.headers.get(TWITCH_MESSAGE_ID),
    request.headers.get(TWITCH_MESSAGE_TIMESTAMP),
    body
  ]
  return values.join('');
}

export const getHmac = (secret: string, message: string) => {
  return crypto.createHmac('sha256', secret)
    .update(message)
    .digest('hex');
}

export const verifyMessage = (hmac: string, verifySignature: string) => {
  return crypto.timingSafeEqual(Buffer.from(hmac), Buffer.from(verifySignature));
}