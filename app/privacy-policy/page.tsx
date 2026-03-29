import type { Metadata } from 'next'

import InfoPageLayout from '@/app/components/InfoPageLayout'

export const metadata: Metadata = {
  title: 'Privacy Policy | Bio For IG',
  description:
    'Read the Bio For IG Privacy Policy to understand what information we collect, how we use it, and how users can contact us about privacy matters.',
}

export default function PrivacyPolicyPage() {
  return (
    <InfoPageLayout
      title="Privacy Policy"
      description="This Privacy Policy explains how Bio For IG collects, uses, and protects information when you use our website and services."
    >
      <div>
        <p>
          Effective date: March 29, 2026. Bio For IG operates the website at
          bioforig.com and related services. By using the service, you
          acknowledge the practices described in this Privacy Policy.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          Information we collect
        </h2>
        <p className="mt-3">
          We may collect information you provide directly, including your name,
          email address, profile details, links you add to your public page, and
          messages you send to us. We also collect limited usage information
          such as page views, link clicks, device and browser details, and other
          analytics events needed to operate and improve the service.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          Sign-in and third-party services
        </h2>
        <p className="mt-3">
          Bio For IG offers Google sign-in. When you sign in with Google, we may
          receive profile data such as your name, email address, and profile
          image, subject to the permissions you approve with Google. We also use
          service providers and infrastructure tools to support website hosting,
          email delivery, subscription billing, database storage, and analytics.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">How we use data</h2>
        <p className="mt-3">
          We use personal information to create and maintain accounts, provide
          bio pages, authenticate users, process subscriptions, respond to
          support requests, send service-related emails, prevent abuse, and
          analyze product performance. We may also use aggregated or
          de-identified information to improve the platform.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          Cookies and analytics
        </h2>
        <p className="mt-3">
          We may use cookies, similar technologies, and analytics tools
          including Google Analytics to understand traffic, measure engagement,
          and improve site functionality. Your browser settings may allow you to
          limit or block some cookies, but some features may not function
          properly if you do so.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Data sharing</h2>
        <p className="mt-3">
          We do not sell personal information. We may share information with
          vendors and service providers that help us operate the platform, when
          required by law, to enforce our terms, or to protect the rights,
          safety, and security of Bio For IG, our users, or others.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          Data retention and security
        </h2>
        <p className="mt-3">
          We retain information for as long as reasonably necessary to provide
          the service, comply with legal obligations, resolve disputes, and
          enforce agreements. We use reasonable administrative, technical, and
          organizational safeguards, but no method of storage or transmission is
          completely secure.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Your choices</h2>
        <p className="mt-3">
          Depending on your location, you may have rights to request access to,
          correction of, deletion of, or restriction of processing of your
          personal information. To make a request, contact us at{' '}
          <a
            href="mailto:info@bioforig.com"
            className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2"
          >
            info@bioforig.com
          </a>
          .
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          Children&apos;s privacy
        </h2>
        <p className="mt-3">
          Bio For IG is not directed to children under 13, and we do not
          knowingly collect personal information from children under 13. If you
          believe a child has provided personal information, contact us so we
          can review and delete it where appropriate.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">
          Changes to this policy
        </h2>
        <p className="mt-3">
          We may update this Privacy Policy from time to time. When we do, we
          will post the updated version on this page and revise the effective
          date above.
        </p>
      </div>
    </InfoPageLayout>
  )
}
