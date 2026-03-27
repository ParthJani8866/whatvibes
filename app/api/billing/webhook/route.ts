import { getRazorpayWebhookSecret, verifyRazorpayWebhookSignature } from '@/lib/razorpay'
import {
  updateBillingSubscriptionFromWebhook,
  type BillingSubscriptionStatus,
} from '@/lib/billingSubscriptions'

export const runtime = 'nodejs'

type RazorpayWebhook = {
  event?: string
  payload?: {
    subscription?: {
      entity?: {
        id?: string
      }
    }
  }
}

function mapEventToStatus(event: string): BillingSubscriptionStatus | undefined {
  switch (event) {
    case 'subscription.activated':
    case 'subscription.charged':
    case 'payment.captured':
      return 'active'
    case 'subscription.cancelled':
      return 'cancelled'
    case 'subscription.completed':
      return 'completed'
    case 'subscription.halted':
      return 'failed'
    case 'subscription.pending':
      return 'created'
    default:
      return undefined
  }
}

export async function POST(req: Request) {
  const signature = req.headers.get('x-razorpay-signature')
  if (!signature) {
    return new Response('Missing signature', { status: 400 })
  }

  const payload = await req.text()

  const secret = getRazorpayWebhookSecret()
  const ok = verifyRazorpayWebhookSignature({ payload, signature, secret })
  if (!ok) {
    return new Response('Invalid signature', { status: 400 })
  }

  const parsed = JSON.parse(payload) as RazorpayWebhook
  const event = parsed.event
  const subscriptionId = parsed.payload?.subscription?.entity?.id

  if (!event || !subscriptionId) {
    // Not a subscription event (or payload shape mismatch). Ack anyway.
    return Response.json({ ok: true })
  }

  await updateBillingSubscriptionFromWebhook({
    razorpaySubscriptionId: subscriptionId,
    status: mapEventToStatus(event),
    event,
  })

  return Response.json({ ok: true })
}
