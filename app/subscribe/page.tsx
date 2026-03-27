import Link from 'next/link'
import GoogleSignInButton from '@/app/components/GoogleSignInButton'
import { getAuthSession } from '@/lib/auth'
import { getLatestBillingSubscriptionByEmail } from '@/lib/billingSubscriptions'
import PlansClient from './PlansClient'

export const metadata = {
  title: 'Choose a plan | Bio For IG',
  description: 'Pick a subscription plan to unlock premium features.',
}

export default async function SubscribePage() {
  const session = await getAuthSession()
  const email = session?.user?.email ?? null

  if (!email) {
    return (
      <main className="mx-auto max-w-4xl px-4 py-12">
        <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
          Choose your plan
        </h1>
        <p className="mt-2 text-neutral-600">
          Sign in to see available packages and start a monthly subscription.
        </p>
        <div className="mt-6">
          <GoogleSignInButton callbackUrl="/subscribe" />
        </div>
        <p className="mt-6 text-sm text-neutral-500">
          Back to{' '}
          <Link href="/" className="font-semibold text-neutral-900 hover:underline">
            dashboard
          </Link>
          .
        </p>
      </main>
    )
  }

  const existing = await getLatestBillingSubscriptionByEmail(email)
  const isActive = existing?.status === 'active' || existing?.status === 'authenticated'

  return (
    <main className="mx-auto max-w-5xl px-4 py-12">
      <div className="flex flex-col gap-2 md:flex-row md:items-end md:justify-between">
        <div>
          <h1 className="text-3xl font-extrabold tracking-tight text-neutral-900">
            Choose your plan
          </h1>
          <p className="mt-2 text-neutral-600">
            Signed in as <span className="font-semibold text-neutral-900">{email}</span>
          </p>
        </div>

        <Link
          href="/"
          className="inline-flex w-fit rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
        >
          Back to dashboard
        </Link>
      </div>

      {existing ? (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm text-neutral-800">
          <div>
            Current status:{' '}
            <span className="font-semibold">
              {existing.status} ({existing.planKey})
            </span>
          </div>
          <div className="mt-1 text-neutral-600">
            Razorpay subscription id:{' '}
            <span className="font-mono">{existing.razorpaySubscriptionId}</span>
          </div>
        </div>
      ) : (
        <div className="mt-6 rounded-2xl border border-neutral-200 bg-white px-5 py-4 text-sm text-neutral-700">
          No subscription found for this account yet.
        </div>
      )}

      <PlansClient
        email={email}
        name={session?.user?.name ?? ''}
        activeSubscriptionId={isActive ? existing?.razorpaySubscriptionId : null}
      />
    </main>
  )
}

