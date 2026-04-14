import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/app/components/JsonLd'
import SeoToolPageLayout from '@/app/components/SeoToolPageLayout'
import InstagramUsernameTool from '@/app/components/instagram-tools/InstagramUsernameTool'

export const metadata: Metadata = {
  title: 'Instagram Username Generator (Unique & Aesthetic) | Bio For IG',
  description:
    'Generate cool Instagram usernames and unique name ideas. Create stylish usernames for boys, girls, business, and creators — fast copy and paste.',
  keywords: [
    'instagram username generator',
    'cool instagram usernames',
    'unique instagram names ideas',
    'stylish username for instagram',
    'aesthetic usernames for instagram',
    'rare instagram usernames',
  ],
  alternates: { canonical: '/instagram-username-generator' },
  robots: { index: true, follow: true },
}

export default function Page() {
  const faq = [
    {
      q: 'What makes a username easy to rank and remember?',
      a: 'Keep it short, readable, and consistent with your niche. Avoid too many dots/underscores and use one main keyword or brand phrase.',
    },
    {
      q: 'Should I use numbers in my Instagram username?',
      a: 'Use numbers only if needed for availability. Prefer meaningful numbers (like your birth year) over random digits.',
    },
    {
      q: 'Can I change my Instagram username later?',
      a: 'Yes, Instagram allows changes, but frequent changes can confuse followers and break old links.',
    },
  ]

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to generate an Instagram username',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Enter a base name',
        text: 'Type your name or brand into the generator.',
      },
      {
        '@type': 'HowToStep',
        name: 'Add your niche',
        text: 'Optionally add a niche like travel, fitness, or photography for better clarity.',
      },
      {
        '@type': 'HowToStep',
        name: 'Copy an idea',
        text: 'Copy your favorite username idea and test it on Instagram for availability.',
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
      title="Instagram Username Generator"
      description="Get cool, unique, and aesthetic Instagram usernames for creators, business, boys, and girls."
      related={[
        {
          href: '/instagram-fonts-generator',
          label: 'Instagram Fonts Generator',
          description: 'Stylish text and symbols for your name and bio.',
        },
        {
          href: '/instagram-bio-generator',
          label: 'Instagram Bio Generator',
          description: 'Turn your niche into a strong bio (with CTA).',
        },
        {
          href: '/instagram-keywords',
          label: 'Instagram SEO Keywords',
          description: 'Find keyword ideas for your niche pages.',
        },
      ]}
    >
      <JsonLd data={howTo} />
      <JsonLd data={faqLd} />

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-neutral-950">Username ideas</h2>
        <InstagramUsernameTool />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-neutral-950">Quick SEO tip</h2>
        <p>
          If you’re building a multi-page SEO site, align your username and bio with the same niche keywords you target on your website.
          Browse our keyword library here:{' '}
          <Link href="/instagram-keywords" className="text-blue-600 underline">
            3,000+ Instagram SEO keywords
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
