import { getAuthSession } from '@/lib/auth'
import { markBillingSubscriptionAuthenticated } from '@/lib/billingSubscriptions'
import { verifyRazorpayPaymentSignature } from '@/lib/razorpay'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await getAuthSession()
  const email = session?.user?.email
  if (!email) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json().catch(() => null)

  const razorpayPaymentId = body?.razorpay_payment_id
  const razorpaySubscriptionId = body?.razorpay_subscription_id
  const razorpaySignature = body?.razorpay_signature

  if (!razorpayPaymentId || !razorpaySubscriptionId || !razorpaySignature) {
    return new Response('Missing Razorpay fields', { status: 400 })
  }

  const ok = verifyRazorpayPaymentSignature({
    razorpayPaymentId,
    razorpaySubscriptionId,
    razorpaySignature,
  })

  if (!ok) {
    return new Response('Invalid signature', { status: 400 })
  }

  await markBillingSubscriptionAuthenticated({
    email,
    razorpaySubscriptionId,
    razorpayPaymentId,
  })

  return Response.json({ ok: true })
}
