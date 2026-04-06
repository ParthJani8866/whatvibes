import type { Metadata } from 'next'

import InfoPageLayout from '@/app/components/InfoPageLayout'

export const metadata: Metadata = {
  title: 'About | Bio For IG',
  description:
    'Learn about Bio For IG, the link-in-bio platform built to help creators, businesses, and brands share everything from one page.',
}

export default function AboutPage() {
  return (
    <InfoPageLayout
      title="About Bio For IG"
      description="Bio For IG helps creators, brands, and small businesses turn one bio link into a clean, high-converting landing page for social audiences."
    >
      <div>
        <h2 className="text-2xl font-bold text-neutral-950">What we do</h2>
        <p className="mt-3">
          Bio For IG is a simple link-in-bio platform designed for Instagram,
          TikTok, YouTube, and other social channels where you need one central
          place for your links. Instead of sending followers to multiple
          profiles, stores, and offers, you can share one page that brings
          everything together.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Who it is for</h2>
        <p className="mt-3">
          The platform is built for creators, freelancers, local businesses,
          online sellers, and anyone who wants a fast mobile-friendly page to
          showcase content, collect leads, and guide visitors to the right
          destination.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Core features</h2>
        <p className="mt-3">
          Users can create a public bio page, add social links, personalize
          their profile, track views and clicks, capture email subscribers, and
          share a QR code that points to their page. Bio For IG also supports
          Google sign-in for faster account access.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Our goal</h2>
        <p className="mt-3">
          Our goal is to make online discovery easier. We focus on giving users
          an accessible, straightforward tool that works well on mobile devices,
          loads quickly, and helps audiences find the right links without extra
          friction.
        </p>
      </div>

      <div>
        <h2 className="text-2xl font-bold text-neutral-950">Contact</h2>
        <p className="mt-3">
          Questions about the service, partnerships, or support can be sent to{' '}
          <a
            href="mailto:info@bioforig.com"
            className="font-medium text-neutral-900 underline decoration-neutral-300 underline-offset-2"
          >
            info@bioforig.com
          </a>
          .
        </p>
      </div>
    </InfoPageLayout>
  )
}
