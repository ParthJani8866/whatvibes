import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/app/components/JsonLd'
import SeoToolPageLayout from '@/app/components/SeoToolPageLayout'
import InstagramCaptionsTool from '@/app/components/instagram-tools/InstagramCaptionsTool'

export const metadata: Metadata = {
  title: 'Instagram Captions for Girls (Love + Aesthetic) | Bio For IG',
  description:
    'Copy and paste Instagram captions for girls — love, short, funny, reels captions and more. Trending caption ideas for your posts.',
  keywords: [
    'instagram captions for girls',
    'love captions for instagram',
    'short instagram captions',
    'funny instagram captions',
    'instagram captions for reels',
  ],
  alternates: { canonical: '/instagram-captions-for-girls' },
  robots: { index: true, follow: true },
}

export default function Page() {
  const faq = [
    {
      q: 'What are good aesthetic captions?',
      a: 'Short, soft phrases work best. Use line breaks, minimal symbols, and consistent tone across your feed.',
    },
    {
      q: 'Do captions help SEO?',
      a: 'Captions can help Instagram understand your content and improve engagement. For Google SEO, publish keyword pages and interlink them.',
    },
    {
      q: 'Can I use stylish fonts in captions?',
      a: 'Yes — generate fonts and paste them, but keep the first line readable.',
    },
  ]

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use captions for girls',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Choose a mood',
        text: 'Pick love, funny, reels, or short captions based on the post.',
      },
      {
        '@type': 'HowToStep',
        name: 'Copy a caption',
        text: 'Tap a caption to copy it instantly.',
      },
      {
        '@type': 'HowToStep',
        name: 'Add finishing touches',
        text: 'Add emojis, fonts, and 5–15 niche hashtags for reach.',
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
      title="Instagram Captions for Girls"
      description="Love, short, funny, and reels caption ideas — tap to copy."
      related={[
        {
          href: '/instagram-captions-for-boys',
          label: 'Instagram Captions for Boys',
          description: 'Attitude, reels, funny, and short captions.',
        },
        {
          href: '/instagram-fonts-generator',
          label: 'Instagram Fonts Generator',
          description: 'Aesthetic text and symbols for captions.',
        },
        {
          href: '/instagram-hashtags-generator',
          label: 'Instagram Hashtags Generator',
          description: 'Hashtag packs for niche growth.',
        },
      ]}
    >
      <JsonLd data={howTo} />
      <JsonLd data={faqLd} />

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-neutral-950">Caption generator</h2>
        <InstagramCaptionsTool defaultMood="love" />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-neutral-950">Next steps</h2>
        <p>
          Want to make captions stand out?{' '}
          <Link href="/instagram-fonts-generator" className="text-blue-600 underline">
            Use stylish Instagram fonts
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
