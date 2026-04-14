import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/app/components/JsonLd'
import SeoToolPageLayout from '@/app/components/SeoToolPageLayout'
import InstagramHashtagsTool from '@/app/components/instagram-tools/InstagramHashtagsTool'

export const metadata: Metadata = {
  title: 'Instagram Hashtags Generator (Reels + Niche) | Bio For IG',
  description:
    'Generate Instagram hashtags for reels, niche growth, and business. Create hashtag packs for any topic and copy them instantly.',
  keywords: [
    'instagram hashtags generator',
    'instagram hashtags for reels',
    'trending hashtags for instagram',
    'hashtags for instagram growth',
    'niche hashtags for instagram',
    'hashtags for business instagram',
  ],
  alternates: { canonical: '/instagram-hashtags-generator' },
  robots: { index: true, follow: true },
}

export default function Page() {
  const faq = [
    {
      q: 'How many hashtags should I use on Instagram?',
      a: 'Test different counts. Many creators use 5–15 targeted hashtags instead of 30 generic ones.',
    },
    {
      q: 'Should I use trending hashtags?',
      a: 'Use a mix: 2–5 trending + 5–10 niche hashtags. Niche tags often bring more relevant engagement.',
    },
    {
      q: 'Do hashtags still work in 2026?',
      a: 'They can help discovery, but strong content + captions + consistency matter most. Use hashtags as a boost, not a crutch.',
    },
  ]

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to generate Instagram hashtags',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter a topic',
        text: 'Type your content topic (travel, food, fitness, etc.).',
      },
      {
        '@type': 'HowToStep',
        name: 'Copy a pack',
        text: 'Copy the general, niche, reels, or business hashtag pack.',
      },
      {
        '@type': 'HowToStep',
        name: 'Paste into caption',
        text: 'Paste hashtags into your caption or first comment and track performance.',
      },
    ],
  }

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  return (
    <SeoToolPageLayout
      title="Instagram Hashtags Generator"
      description="Generate viral reels hashtags, niche hashtags, and business hashtag packs — copy and paste."
      related={[
        {
          href: '/trending-instagram-hashtags',
          label: 'Trending Instagram Hashtags',
          description: 'Quick lists you can reuse and customize.',
        },
        {
          href: '/ai-instagram-caption-generator',
          label: 'AI Instagram Caption Generator',
          description: 'Caption ideas built for engagement (no login).',
        },
        {
          href: '/instagram-keywords',
          label: 'Instagram SEO Keywords',
          description: 'Long-tail keywords for fast Google indexing.',
        },
      ]}
    >
      <JsonLd data={howTo} />
      <JsonLd data={faqLd} />

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-neutral-950">Hashtag packs generator</h2>
        <InstagramHashtagsTool />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-neutral-950">Pro growth strategy</h2>
        <ul className="list-disc pl-5">
          <li>Use 70% niche tags + 30% broader tags.</li>
          <li>Rotate hashtag sets to avoid repetition.</li>
          <li>Pair with strong captions and a clear hook in the first line.</li>
        </ul>
        <p>
          Need caption ideas?{' '}
          <Link href="/instagram-captions-for-boys" className="text-blue-600 underline">
            captions for boys
          </Link>{' '}
          and{' '}
          <Link href="/instagram-captions-for-girls" className="text-blue-600 underline">
            captions for girls
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-neutral-950">FAQ</h2>
        <div className="space-y-3">
          {faq.map((f) => (
            <details key={f.q} className="rounded-2xl border border-neutral-200 bg-white p-4">
              <summary className="cursor-pointer text-sm font-extrabold text-neutral-950">
                {f.q}
              </summary>
              <p className="mt-2 text-sm text-neutral-700">{f.a}</p>
            </details>
          ))}
        </div>
      </section>
    </SeoToolPageLayout>
  )
}
