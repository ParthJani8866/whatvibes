import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/app/components/JsonLd'
import SeoToolPageLayout from '@/app/components/SeoToolPageLayout'

export const metadata: Metadata = {
  title: 'Trending Instagram Hashtags (Reels + Growth) | Bio For IG',
  description:
    'A curated list of trending-style Instagram hashtags for reels, growth, and business niches — plus how to mix them for better reach.',
  keywords: [
    'trending hashtags for instagram',
    'viral hashtags for reels',
    'best hashtags for likes instagram',
    'instagram hashtags for reels',
    'instagram hashtags 2026',
  ],
  alternates: { canonical: '/trending-instagram-hashtags' },
  robots: { index: true, follow: true },
}

const hashtagLists = {
  reels: [
    '#reels',
    '#reelsinstagram',
    '#reelsoftheday',
    '#reelsvideo',
    '#reelsviral',
    '#explorepage',
    '#trending',
    '#viral',
    '#contentcreator',
    '#creator',
  ],
  growth: [
    '#instagram',
    '#instagood',
    '#newpost',
    '#photography',
    '#video',
    '#daily',
    '#foryou',
    '#discover',
    '#socialmedia',
    '#engagement',
  ],
  business: [
    '#smallbusiness',
    '#business',
    '#entrepreneur',
    '#marketing',
    '#branding',
    '#shoponline',
    '#supportsmallbusiness',
    '#digitalmarketing',
    '#startup',
    '#onlinebusiness',
  ],
} as const

export default function Page() {
  const faq = [
    {
      q: 'Are these hashtags truly “trending” right now?',
      a: 'They are popular, evergreen “trending-style” hashtags that often perform well. For real-time trends, adapt to your niche and current audio/topics.',
    },
    {
      q: 'What’s the best hashtag mix?',
      a: 'Use 2–5 broad/trending tags and 5–10 niche tags. Niche tags bring more targeted reach.',
    },
    {
      q: 'Where should I place hashtags?',
      a: 'Test both: in the caption vs the first comment. Many creators keep captions cleaner by placing tags in the first comment.',
    },
  ]

  const faqLd = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    mainEntity: faq.map((f) => ({
      '@type': 'Question',
      name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use trending hashtags on Instagram',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Choose your niche',
        text: 'Pick a topic-specific set (travel, fitness, food, etc.) and start with niche hashtags first.',
      },
      {
        '@type': 'HowToStep',
        name: 'Add a few broad tags',
        text: 'Add 2–5 broad or trending-style hashtags that match the post format (especially reels).',
      },
      {
        '@type': 'HowToStep',
        name: 'Track and rotate',
        text: 'Rotate hashtag sets every few posts and track saves, shares, and reach to find winners.',
      },
    ],
  }

  return (
    <SeoToolPageLayout
      title="Trending Instagram Hashtags"
      description="Curated hashtag lists for reels, growth, and business — plus a simple strategy to mix them for reach."
      related={[
        {
          href: '/instagram-hashtags-generator',
          label: 'Instagram Hashtags Generator',
          description: 'Generate niche hashtag packs for any topic.',
        },
        {
          href: '/ai-instagram-caption-generator',
          label: 'AI Instagram Caption Generator',
          description: 'Caption ideas you can copy/paste.',
        },
        {
          href: '/instagram-keywords',
          label: 'Instagram SEO Keywords',
          description: 'Build topical authority with long-tail pages.',
        },
      ]}
    >
      <JsonLd data={howTo} />
      <JsonLd data={faqLd} />

      <section className="space-y-6">
        <h2 className="text-2xl font-extrabold text-neutral-950">Hashtag lists</h2>

        {(
          [
            ['Viral reels hashtags', hashtagLists.reels],
            ['Growth hashtags', hashtagLists.growth],
            ['Business hashtags', hashtagLists.business],
          ] as const
        ).map(([label, list]) => (
          <div key={label} className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
            <div className="text-lg font-extrabold text-neutral-950">{label}</div>
            <p className="mt-2 text-sm text-neutral-600">Copy, then swap 5–10 tags with your niche-specific tags.</p>
            <div className="mt-3 break-words rounded-2xl border border-neutral-200 bg-white p-4 text-sm text-neutral-900">
              {list.join(' ')}
            </div>
          </div>
        ))}

        <div className="rounded-3xl border border-neutral-200 bg-white p-6">
          <h3 className="text-lg font-extrabold text-neutral-950">Want niche hashtags?</h3>
          <p className="mt-2 text-sm text-neutral-700">
            Use our generator to create niche hashtag packs that match your content:
            <Link href="/instagram-hashtags-generator" className="ml-1 text-blue-600 underline">
              Instagram hashtags generator
            </Link>
            .
          </p>
        </div>
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
