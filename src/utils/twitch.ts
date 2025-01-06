import type { SupabaseClient } from '@supabase/supabase-js'

export const refreshToken = (
  tokens: {
    access_token: string
    refresh_token: string
  },
  supabase: SupabaseClient
) => {
  console.log('Askin for a new token through refresh token...')
  fetch('https://id.twitch.tv/oauth2/token', {
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
      console.log('Refresh token response')
      console.log(refreshRes)
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
      }
    }).catch(err => {
      throw new Error(err)
    })
}
