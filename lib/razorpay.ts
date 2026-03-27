import crypto from 'crypto'

import type { PlanKey } from '@/lib/billingSubscriptions'

function requiredEnv(name: string) {
  const val = process.env[name]
  if (!val) throw new Error(`Missing ${name}`)
  return val
}

export function getRazorpayKeySecret() {
  return requiredEnv('RAZORPAY_KEY_SECRET')
}

export function getRazorpayKeyId() {
  // Use server env by default, but allow sharing the same value with NEXT_PUBLIC_RAZORPAY_KEY_ID.
  return process.env.RAZORPAY_KEY_ID ?? requiredEnv('NEXT_PUBLIC_RAZORPAY_KEY_ID')
}

export function getRazorpayPlanId(planKey: PlanKey) {
  if (planKey === 'basic') return requiredEnv('RAZORPAY_PLAN_BASIC_ID')
  if (planKey === 'pro') return requiredEnv('RAZORPAY_PLAN_PRO_ID')
  throw new Error('Unknown planKey')
}

export function getRazorpayWebhookSecret() {
  return requiredEnv('RAZORPAY_WEBHOOK_SECRET')
}

function basicAuthHeader() {
  const keyId = getRazorpayKeyId()
  const keySecret = getRazorpayKeySecret()
  const token = Buffer.from(`${keyId}:${keySecret}`).toString('base64')
  return `Basic ${token}`
}

export async function razorpayCreateSubscription(input: {
  planId: string
  totalCount: number
  customerNotify?: 0 | 1
  notes?: Record<string, string>
}) {
  const res = await fetch('https://api.razorpay.com/v1/subscriptions', {
    method: 'POST',
    headers: {
      Authorization: basicAuthHeader(),
      'Content-Type': 'application/json',
    },
    body: JSON.stringify({
      plan_id: input.planId,
      total_count: input.totalCount,
      customer_notify: input.customerNotify ?? 1,
      notes: input.notes ?? {},
    }),
  })

  const data = await res.json().catch(() => null)
  if (!res.ok) {
    const msg =
      (data && (data.error?.description || data.error?.reason || data.error?.code)) ||
      `Razorpay create subscription failed (${res.status})`
    throw new Error(msg)
  }

  return data as { id: string; status: string; plan_id: string }
}

export function verifyRazorpayPaymentSignature(input: {
  razorpayPaymentId: string
  razorpaySubscriptionId: string
  razorpaySignature: string
}) {
  const secret = getRazorpayKeySecret()

  // For subscriptions, Razorpay returns a signature that signs:
  // `${razorpay_payment_id}|${razorpay_subscription_id}`
  const body = `${input.razorpayPaymentId}|${input.razorpaySubscriptionId}`
  const expected = crypto.createHmac('sha256', secret).update(body).digest('hex')

  const expectedBuf = Buffer.from(expected, 'utf8')
  const providedBuf = Buffer.from(input.razorpaySignature, 'utf8')
  if (expectedBuf.length !== providedBuf.length) return false

  return crypto.timingSafeEqual(expectedBuf, providedBuf)
}

export function verifyRazorpayWebhookSignature(input: {
  payload: string
  signature: string
  secret: string
}) {
  const expected = crypto
    .createHmac('sha256', input.secret)
    .update(input.payload)
    .digest('hex')

  const expectedBuf = Buffer.from(expected, 'utf8')
  const providedBuf = Buffer.from(input.signature, 'utf8')
  if (expectedBuf.length !== providedBuf.length) return false

  return crypto.timingSafeEqual(expectedBuf, providedBuf)
}
