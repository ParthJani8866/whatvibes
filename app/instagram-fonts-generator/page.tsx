import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/app/components/JsonLd'
import SeoToolPageLayout from '@/app/components/SeoToolPageLayout'
import InstagramFontsTool from '@/app/components/instagram-tools/InstagramFontsTool'

export const metadata: Metadata = {
  title: 'Instagram Fonts Generator (Copy & Paste) | Bio For IG',
  description:
    'Generate stylish Instagram fonts for your bio, name, captions, and stories. Copy and paste fancy text, cursive letters, and symbols instantly.',
  keywords: [
    'instagram fonts generator',
    'instagram bio fonts copy paste',
    'stylish text for instagram',
    'fancy font generator copy paste',
    'instagram symbols copy paste',
    'cool symbols for instagram',
  ],
  alternates: { canonical: '/instagram-fonts-generator' },
  robots: { index: true, follow: true },
}

export default function Page() {
  const faq = [
    {
      q: 'How do Instagram fonts work?',
      a: 'They are Unicode characters that look like different fonts. You can copy them and paste them into your Instagram bio, name, captions, or comments.',
    },
    {
      q: 'Will these fonts work on all phones?',
      a: 'Most modern devices display common Unicode styles. Some older devices may show squares for certain characters.',
    },
    {
      q: 'Can I use symbols in my Instagram name?',
      a: 'Yes, many symbols work. Keep it readable and avoid overusing special characters.',
    },
  ]

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use the Instagram Fonts Generator',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Type your text',
        text: 'Enter your name, bio line, or caption into the input box.',
      },
      {
        '@type': 'HowToStep',
        name: 'Pick a style',
        text: 'Choose a font style you like (bold, script, monospace, etc.).',
      },
      {
        '@type': 'HowToStep',
        name: 'Copy and paste',
        text: 'Copy the styled text and paste it into Instagram.',
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
      title="Instagram Fonts Generator"
      description="Copy and paste stylish Instagram fonts, fancy letters, cursive text, and symbols for your bio and captions."
      related={[
        {
          href: '/instagram-bio-generator',
          label: 'Instagram Bio Generator',
          description: 'Generate bios that fit your niche and vibe.',
        },
        {
          href: '/instagram-username-generator',
          label: 'Instagram Username Generator',
          description: 'Get unique and aesthetic username ideas.',
        },
        {
          href: '/instagram-keywords',
          label: 'Instagram SEO Keywords',
          description: 'Browse 3,000+ keyword ideas for fast ranking.',
        },
      ]}
    >
      <JsonLd data={howTo} />
      <JsonLd data={faqLd} />

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-neutral-950">Fonts generator</h2>
        <InstagramFontsTool />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-neutral-950">Why stylish text helps</h2>
        <ul className="list-disc pl-5">
          <li>Make your name and bio stand out in search and suggested profiles.</li>
          <li>Improve readability with consistent styling (don’t overdo it).</li>
          <li>Use symbols to separate lines and highlight your call-to-action.</li>
        </ul>
        <p>
          Next: generate a bio and pair it with fonts —{' '}
          <Link href="/instagram-bio-generator" className="text-blue-600 underline">
            try the Instagram bio generator
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
