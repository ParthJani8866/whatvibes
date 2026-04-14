import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/app/components/JsonLd'
import SeoToolPageLayout from '@/app/components/SeoToolPageLayout'
import InstagramBioTool from '@/app/components/instagram-tools/InstagramBioTool'

export const metadata: Metadata = {
  title: 'Instagram Bio Generator (Free Copy & Paste) | Bio For IG',
  description:
    'Generate Instagram bio ideas in seconds. Pick your niche and tone, add a call-to-action, and copy/paste a bio that converts.',
  keywords: [
    'instagram bio generator',
    'instagram bio ideas',
    'instagram bio copy paste',
    'short instagram bio',
    'cool instagram bio',
    'instagram bio for business',
  ],
  alternates: { canonical: '/instagram-bio-generator' },
  robots: { index: true, follow: true },
}

export default function Page() {
  const faq = [
    {
      q: 'What should an Instagram bio include?',
      a: 'A clear niche, a hint of personality, social proof (optional), and a call-to-action like “DM for collabs” or “Shop below”.',
    },
    {
      q: 'How long should my bio be?',
      a: 'Shorter is usually better. Use line breaks and symbols to make it scannable.',
    },
    {
      q: 'Can I use stylish fonts in my bio?',
      a: 'Yes — generate them with our fonts tool and paste them into your bio.',
    },
  ]

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to generate an Instagram bio',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Add your niche',
        text: 'Type your niche (travel, fitness, business, etc.).',
      },
      {
        '@type': 'HowToStep',
        name: 'Choose a tone',
        text: 'Pick aesthetic, professional, funny, attitude, or minimal.',
      },
      {
        '@type': 'HowToStep',
        name: 'Copy and paste',
        text: 'Tap a bio idea to copy it, then paste into Instagram.',
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
      title="Instagram Bio Generator"
      description="Free bio ideas for creators, business, boys, and girls — copy and paste in one click."
      related={[
        {
          href: '/instagram-fonts-generator',
          label: 'Instagram Fonts Generator',
          description: 'Add stylish text and symbols to your bio.',
        },
        {
          href: '/instagram-username-generator',
          label: 'Instagram Username Generator',
          description: 'Find unique usernames that fit your niche.',
        },
        {
          href: '/instagram-hashtags-generator',
          label: 'Instagram Hashtags Generator',
          description: 'Generate hashtag packs for reach and growth.',
        },
      ]}
    >
      <JsonLd data={howTo} />
      <JsonLd data={faqLd} />

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-neutral-950">Bio ideas generator</h2>
        <InstagramBioTool />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-neutral-950">Make it rank faster</h2>
        <p>
          If you’re publishing SEO pages, use the same phrases in your bio, page titles, and headings.
          Browse keyword ideas here:{' '}
          <Link href="/instagram-keywords" className="text-blue-600 underline">
            Instagram SEO keyword library
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
