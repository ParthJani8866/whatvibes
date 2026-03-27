'use client'

import { useMemo, useState } from 'react'
import { useRouter } from 'next/navigation'
import {
  LayoutTemplate,
  ShieldCheck,
  Globe,
  Search,
  BarChart,
  Mail,
  CheckCircle,
  ShoppingBag,
  TrendingUp,
  Headphones,
} from 'lucide-react'

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
        name: 'Bio For IG',
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

  // Helper to render a feature list item with an icon
  const FeatureItem = ({ icon: Icon, text }: { icon: React.ElementType; text: string }) => (
    <li className="flex items-start gap-2 text-sm text-neutral-700">
      <Icon className="mt-0.5 h-4 w-4 flex-shrink-0 text-neutral-500" />
      <span>{text}</span>
    </li>
  )

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

      <div className="mt-6 grid grid-cols-1 gap-6 md:grid-cols-2">
        {/* Basic Plan */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="text-sm font-semibold text-neutral-600">Basic</div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tight">INR 425</span>
            <span className="text-sm text-neutral-500">/ month</span>
          </div>
          <ul className="mt-6 space-y-3">
            <FeatureItem icon={LayoutTemplate} text="Premium templates" />
            <FeatureItem icon={ShieldCheck} text="Verified Badge" />
            <FeatureItem icon={Globe} text="Custom domain support" />
            <FeatureItem icon={Search} text="SEO for Google" />
            <FeatureItem icon={BarChart} text="Page View & clicks analysis" />
            <FeatureItem icon={Mail} text="Email subscriptions" />
          </ul>
          <button
            type="button"
            disabled={disabled || loadingPlan !== null}
            onClick={() => onSubscribe('basic')}
            className="mt-8 w-full rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {loadingPlan === 'basic' ? 'Opening checkout...' : 'Subscribe monthly'}
          </button>
        </div>

        {/* Pro Plan */}
        <div className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm transition-shadow hover:shadow-md">
          <div className="text-sm font-semibold text-neutral-600">Pro</div>
          <div className="mt-2 flex items-baseline gap-1">
            <span className="text-3xl font-extrabold tracking-tight">INR 849</span>
            <span className="text-sm text-neutral-500">/ month</span>
          </div>
          <ul className="mt-6 space-y-3">
            <FeatureItem icon={LayoutTemplate} text="Premium templates" />
            <FeatureItem icon={ShieldCheck} text="Verified Badge" />
            <FeatureItem icon={Globe} text="Custom domain support" />
            <FeatureItem icon={Search} text="SEO for Google" />
            <FeatureItem icon={BarChart} text="Page View & clicks analysis" />
            <FeatureItem icon={Mail} text="Email subscriptions" />
            <FeatureItem icon={ShoppingBag} text="Ecommerce Listings" />
            <FeatureItem icon={Search} text="2 Backlinks for better visibility in google" />
            <FeatureItem icon={TrendingUp} text="Advanced analytics" />
            <FeatureItem icon={Headphones} text="Priority support" />
          </ul>
          <button
            type="button"
            disabled={disabled || loadingPlan !== null}
            onClick={() => onSubscribe('pro')}
            className="mt-8 w-full rounded-2xl bg-black px-5 py-3 text-sm font-semibold text-white transition-colors hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-neutral-300"
          >
            {loadingPlan === 'pro' ? 'Opening checkout...' : 'Subscribe monthly'}
          </button>
        </div>
      </div>
    </div>
  )
}