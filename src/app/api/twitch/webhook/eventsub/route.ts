'server-only'

import {
  NextRequest,
  NextResponse
} from 'next/server'
import { getHmac, getHmacMessage, verifyMessage } from '@/utils/twitch';
// import TwitchWebhookParser from '@/utils/twitchWebhookParser';
import { createSupaClient } from "@/lib/supabase-service-decorations"

// DOCUMENTATION
/*----------------------------------------------------*/
// https://dev.twitch.tv/docs/eventsub/handling-webhook-events/
// https://dev.twitch.tv/docs/eventsub/handling-webhook-events/#verifying-the-event-message
/*----------------------------------------------------*/

export const dynamic = 'force-dynamic'

// Notification request headers
const TWITCH_MESSAGE_SIGNATURE = 'Twitch-Eventsub-Message-Signature'.toLowerCase();
const MESSAGE_TYPE = 'Twitch-Eventsub-Message-Type'.toLowerCase();

// Notification message types
const MESSAGE_TYPE_VERIFICATION = 'webhook_callback_verification';
const MESSAGE_TYPE_NOTIFICATION = 'notification';
const MESSAGE_TYPE_REVOCATION = 'revocation';

// Prepend this string to the HMAC that's created from the message
const HMAC_PREFIX = 'sha256=';

declare global {
  type TwitchSub = {
    duration_months: number,
    sub_tier: "1000" | "2000" | "3000",
    is_prime: boolean,
  }
  type TwitchResub = {
    cumulative_months: number,
    duration_months: number,
    streak_months: number,
    sub_tier: "1000" | "2000" | "3000",
    is_prime: boolean,
    is_gift: boolean,
    gifter_is_anonymous: boolean | null,
    gifter_user_id: string | null,
    gifter_user_name: string | null,
    gifter_user_login: string | null,
  }
  type TwitchCommunitySubGift = {
    id: string,
    total: number,
    cumulative_total: number,
    sub_tier: "1000" | "2000" | "3000",
  }
}

type FollowerEvent = {
  broadcaster_user_id: string
  broadcaster_user_login: string
  broadcaster_user_name: string
} & TwitchFollower

type SubEventBase = {
  notice_type: 'sub' | 'resub' | 'community_sub_gift'
  sub: TwitchSub | null
  resub: TwitchResub | null
  community_sub_gift: TwitchCommunitySubGift | null
}

type AnonymousSubEvent = {
  chatter_is_anonymous: true
  chatter_user_id: null,
  chatter_user_login: null,
  chatter_user_name: null,
}
type UserSubEvent = {
  chatter_is_anonymous: false
  chatter_user_id: string
  chatter_user_login: string
  chatter_user_name: string
}

type SubEvent = SubEventBase & (AnonymousSubEvent | UserSubEvent)

type RaidEvent = {
  from_broadcaster_user_id: string,
  from_broadcaster_user_login: string,
  from_broadcaster_user_name: string,
  viewers: number,
}

export async function POST(
  req: NextRequest
) {
  console.log('Webhook EventSub ================================')
  const body = await req.json()
  const secret = process.env.WEBHOOK_SECRET
  if (!secret) {
    console.log("Webhook secret isn't defined")
    return NextResponse.json({
      status: 500
    })
  }
  // console.log(req.headers)
  const signature = req.headers.get(TWITCH_MESSAGE_SIGNATURE)
  if (!signature) {
    console.log("Twitch Signature isn't defined")
    return NextResponse.json({
      status: 500,
      body: { message: 'Missing signature' }
    })
  }

  const serviceKey = process.env.SUPABASE_DECORATION_SERVICE_KEY
  if (!serviceKey) {
    console.log('Missing Supabase Service Key')
    return NextResponse.json({
      status: 500,
      body: { message: 'Missing signature' }
    })
  }

  const message = await getHmacMessage(req, JSON.stringify(body))
  const hmac = `${HMAC_PREFIX}${getHmac(secret, message)}`
  const isMessageValid = verifyMessage(hmac, signature)

  if (isMessageValid) {
    // Signature is valid
    console.log("Signatures match");
    if (MESSAGE_TYPE_NOTIFICATION  === req.headers.get(MESSAGE_TYPE)) {
      // Supabase inserts/upserts
      console.log(`=> Receive ${body.subscription.type} event`)
      const supabase = await createSupaClient(serviceKey)
      if (body.subscription.type === 'channel.follow') {
        const followEvent = body.event as FollowerEvent
        const newFollower = {
          user_id: parseInt(followEvent.user_id),
          user_login: followEvent.user_login,
          user_name: followEvent.user_name,
          followed_at: followEvent.followed_at
        }
        const { error } = await supabase
          .from('followers')
          .upsert(newFollower)
        if (error) console.error(error)
      } else if (body.subscription.type === 'channel.chat.notification') {

          const subEvent = body.event as SubEvent
          const newSub = {
            chatter_user_id: subEvent.chatter_is_anonymous ? null : parseInt(subEvent.chatter_user_id as string),
            chatter_user_login: subEvent.chatter_user_login,
            chatter_user_name: subEvent.chatter_user_name ?? undefined,
            notice_type: subEvent.notice_type,
            sub: subEvent.sub,
            resub: subEvent.resub,
            community_sub_gift: subEvent.community_sub_gift
          }
          const { error } = await supabase
            .from('subs')
            .insert(newSub)
          if (error) console.error(error)
      } else if (body.subscription.type === 'channel.raid') {
        const raidEvent = body.event as RaidEvent
        const newRaid = {
          from_broadcaster_user_id: raidEvent.from_broadcaster_user_id,
          from_broadcaster_user_login: raidEvent.from_broadcaster_user_login,
          from_broadcaster_user_name: raidEvent.from_broadcaster_user_name,
          viewers: raidEvent.viewers,
        }
        const { error } = await supabase
          .from('raids')
          .insert(newRaid)
        if (error) {
          console.log('Error adding raid to supabase')
          console.error(error)
        }
      }
      
      return NextResponse.json({
        status: 204
      });
    } else if (MESSAGE_TYPE_VERIFICATION === req.headers.get(MESSAGE_TYPE)) {
      // Send back validation for webhook
      console.log('Verification passed, sending response')
      return new NextResponse(body.challenge, {
        headers: {
          'Content-Type': 'text/plain'
        },
        status: 200,
      })
    } else if (MESSAGE_TYPE_REVOCATION === req.headers.get(MESSAGE_TYPE)) {
      // Received a revocation query
      console.log(`${body.subscription.type} notifications revoked!`);
      console.log(`reason: ${body.subscription.status}`);
      console.log(`condition: ${JSON.stringify(body.subscription.condition, null, 4)}`);
      return NextResponse.json({
        status: 204
      })
    } else {
      // Unknown message
      console.log(`Unknown message type: ${req.headers.get(MESSAGE_TYPE)}`);
      return NextResponse.json({
        status: 204
      })
    }
  } else {
    // Signature didn't match
    console.log("Signatures didn't match")
    return NextResponse.json({
      status: 403
    })
  }
}