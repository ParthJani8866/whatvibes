import { getAuthSession } from '@/lib/auth'
import {
  createBillingSubscription,
  getActiveBillingSubscriptionByEmail,
  type PlanKey,
} from '@/lib/billingSubscriptions'
import { getRazorpayPlanId, razorpayCreateSubscription } from '@/lib/razorpay'

export const runtime = 'nodejs'

export async function POST(req: Request) {
  const session = await getAuthSession()
  const email = session?.user?.email
  if (!email) {
    return new Response('Unauthorized', { status: 401 })
  }

  const body = await req.json().catch(() => null)
  const planKey = body?.planKey as PlanKey | undefined
  if (planKey !== 'basic' && planKey !== 'pro') {
    return new Response('Invalid planKey', { status: 400 })
  }

  const existing = await getActiveBillingSubscriptionByEmail(email)
  if (existing) {
    return Response.json({ subscriptionId: existing.razorpaySubscriptionId, reused: true })
  }

  const totalCount = Number.parseInt(
    process.env.RAZORPAY_SUBSCRIPTION_TOTAL_COUNT ?? '12',
    10,
  )
  if (!Number.isFinite(totalCount) || totalCount <= 0) {
    return new Response('Invalid RAZORPAY_SUBSCRIPTION_TOTAL_COUNT', { status: 500 })
  }

  const razorpayPlanId = getRazorpayPlanId(planKey)
  const created = await razorpayCreateSubscription({
    planId: razorpayPlanId,
    totalCount,
    customerNotify: 1,
    notes: {
      email,
      planKey,
    },
  })

  await createBillingSubscription({
    email,
    name: session?.user?.name ?? null,
    image: session?.user?.image ?? null,
    planKey,
    razorpayPlanId,
    razorpaySubscriptionId: created.id,
    status: created.status === 'active' ? 'active' : 'created',
  })

  return Response.json({ subscriptionId: created.id })
}
