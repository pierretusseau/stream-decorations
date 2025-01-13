'server-only'

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

import {
  NextRequest,
  NextResponse
} from 'next/server'
import { getHmac, getHmacMessage, verifyMessage } from '@/utils/twitch';
import TwitchWebhookParser from '@/utils/twitchWebhookParser';

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
      // Supabase Updates
      // console.log(JSON.stringify(body.event, null, 4));
      TwitchWebhookParser({
        type: body.subscription.type,
        event: body.event,
        serviceKey
      })
      
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