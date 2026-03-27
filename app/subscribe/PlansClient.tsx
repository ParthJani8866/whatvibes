'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'

type RazorpaySuccessResponse = {
  razorpay_payment_id: string
  razorpay_subscription_id: string
  razorpay_signature: string
}

type RazorpayOptions = {
  key: string
  subscription_id: string
  name?: string
  description?: string
  prefill?: {
    name?: string
    email?: string
  }
  handler?: (response: RazorpaySuccessResponse) => void | Promise<void>
  modal?: {
    ondismiss?: () => void
  }
}

type RazorpayInstance = {
  open: () => void
}

declare global {
  interface Window {
    Razorpay?: new (options: RazorpayOptions) => RazorpayInstance
  }
}

type PlanKey = 'basic' | 'pro'

async function loadRazorpayScript(): Promise<boolean> {
  if (typeof window === 'undefined') return false
  if (window.Razorpay) return true

  return await new Promise((resolve) => {
    const script = document.createElement('script')
    script.src = 'https://checkout.razorpay.com/v1/checkout.js'
    script.async = true
    script.onload = () => resolve(true)
    script.onerror = () => resolve(false)
    document.body.appendChild(script)
  })
}

export default function PlansClient(props: {
  email: string
  name: string
  activeSubscriptionId?: string | null
}) {
  const router = useRouter()
  const [loadingPlan, setLoadingPlan] = useState<PlanKey | null>(null)
  const [error, setError] = useState<string | null>(null)

  const keyId = useMemo(() => process.env.NEXT_PUBLIC_RAZORPAY_KEY_ID, [])

  async function onSubscribe(planKey: PlanKey) {
    setError(null)
    setLoadingPlan(planKey)

    try {
      if (!keyId) throw new Error('Missing NEXT_PUBLIC_RAZORPAY_KEY_ID')

      const scriptOk = await loadRazorpayScript()
      if (!scriptOk) throw new Error('Failed to load Razorpay checkout')
      if (!window.Razorpay) throw new Error('Razorpay checkout is not available')

      const createRes = await fetch('/api/billing/create-subscription', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ planKey }),
      })
      if (!createRes.ok) {
        const msg = await createRes.text()
        throw new Error(msg || 'Failed to create subscription')
      }

      const created = (await createRes.json()) as { subscriptionId: string }

      const rzp = new window.Razorpay({
        key: keyId,
        subscription_id: created.subscriptionId,
        name: 'WhatVibes',
        description: 'Monthly subscription',
        prefill: { name: props.name, email: props.email },
        handler: async (response) => {
          const verifyRes = await fetch('/api/billing/verify-payment', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(response),
          })
          if (!verifyRes.ok) {
            const msg = await verifyRes.text()
            throw new Error(msg || 'Payment verification failed')
          }
          router.refresh()
        },
        modal: {
          ondismiss: () => setLoadingPlan(null),
        },
      })

      rzp.open()
    } catch (e: unknown) {
      setError(e instanceof Error ? e.message : 'Something went wrong')
      setLoadingPlan(null)
    }
  }

  const disabled = Boolean(props.activeSubscriptionId)

  return (
    <div className="mt-8">
      {props.activeSubscriptionId ? (
        <div className="rounded-2xl border border-emerald-200 bg-emerald-50 px-5 py-4 text-sm text-emerald-900">
          Active subscription: <span className="font-mono">{props.activeSubscriptionId}</span>
        </div>
      ) : null}

      {error ? (
        <div className="mt-4 rounded-2xl border border-red-200 bg-red-50 px-5 py-4 text-sm text-red-900">
          {error}
        </div>
      ) : null}

      <div className="mt-6 grid grid-cols-1 gap-4 md:grid-cols-2">
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-600">Basic</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">INR 199</div>
          <div className="mt-1 text-sm text-neutral-600">per month</div>
          <ul className="mt-5 space-y-2 text-sm text-neutral-700">
            <li>Premium templates</li>
            <li>Custom domain support</li>
            <li>Email support</li>
          </ul>
          <button
            type="button"
            disabled={disabled || loadingPlan !== null}
            onClick={() => onSubscribe('basic')}
            className="mt-6 w-full rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {loadingPlan === 'basic' ? 'Opening checkout...' : 'Subscribe monthly'}
          </button>
        </div>

        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
          <div className="text-sm font-semibold text-neutral-600">Pro</div>
          <div className="mt-2 text-3xl font-extrabold tracking-tight">INR 499</div>
          <div className="mt-1 text-sm text-neutral-600">per month</div>
          <ul className="mt-5 space-y-2 text-sm text-neutral-700">
            <li>Everything in Basic</li>
            <li>Advanced analytics</li>
            <li>Priority support</li>
          </ul>
          <button
            type="button"
            disabled={disabled || loadingPlan !== null}
            onClick={() => onSubscribe('pro')}
            className="mt-6 w-full rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {loadingPlan === 'pro' ? 'Opening checkout...' : 'Subscribe monthly'}
          </button>
        </div>
      </div>
    </div>
  )
}
