import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/app/components/JsonLd'
import SeoToolPageLayout from '@/app/components/SeoToolPageLayout'
import KeywordSearch from '@/app/components/instagram-tools/KeywordSearch'
import {
  getInstagramKeywordEntries,
  instagramKeywordBrowseGroups,
  instagramKeywordCount,
} from '@/lib/instagramSeo'

export const metadata: Metadata = {
  title: 'Instagram SEO Keywords (3,000+ Ideas) | Bio For IG',
  description:
    'Browse 3,000+ Instagram SEO keyword ideas with high ranking potential. Interlinked keyword pages, FAQs, and how-to sections for faster indexing.',
  keywords: [
    'instagram seo keywords',
    'instagram keywords',
    'instagram hashtags 2026',
    'instagram fonts generator',
    'instagram username generator',
    'instagram bio generator',
  ],
  alternates: { canonical: '/instagram-keywords' },
  robots: { index: true, follow: true },
}

export default function Page() {
  const entries = getInstagramKeywordEntries()

  const faq = [
    {
      q: 'How do these keyword pages help ranking?',
      a: 'They create topical authority: internal links connect related pages, and each page targets a long-tail query with a clear title, description, FAQ, and how-to.',
    },
    {
      q: 'How many pages should I publish?',
      a: 'Start with 5–10 hub pages (fonts, bio, username, captions, hashtags) and then add long-tail keyword pages consistently.',
    },
    {
      q: 'How do I get pages indexed faster?',
      a: 'Submit your sitemap in Google Search Console, interlink pages heavily, and publish unique helpful content per page.',
    },
  ]

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to build a multi-page Instagram SEO site',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Publish hub pages',
        text: 'Create core tools pages: bio generator, fonts generator, username generator, captions, and hashtags.',
      },
      {
        '@type': 'HowToStep',
        name: 'Add programmatic keyword pages',
        text: 'Create long-tail pages for 3,000+ keywords and include internal links between related pages.',
      },
      {
        '@type': 'HowToStep',
        name: 'Submit sitemap',
        text: 'Submit /sitemap.xml in Google Search Console and keep adding new pages over time.',
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
      title="Instagram SEO Keywords"
      description={`Browse ${instagramKeywordCount.toLocaleString()} keyword ideas with interlinked pages, FAQs, and how-to sections.`}
      related={[
        {
          href: '/instagram-fonts-generator',
          label: 'Instagram Fonts Generator',
          description: 'High-traffic tool category for SEO.',
        },
        {
          href: '/instagram-username-generator',
          label: 'Instagram Username Generator',
          description: 'Username ideas + long-tail keyword pages.',
        },
        {
          href: '/instagram-hashtags-generator',
          label: 'Instagram Hashtags Generator',
          description: 'Hashtags pages drive search + viral growth.',
        },
        {
          href: '/instagram-bio-generator',
          label: 'Instagram Bio Generator',
          description: 'Convert visitors with bios that match keywords.',
        },
      ]}
    >
      <JsonLd data={howTo} />
      <JsonLd data={faqLd} />

      <KeywordSearch entries={entries.map((e) => ({ keyword: e.keyword, slug: e.slug }))} />

      <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-2xl font-extrabold text-neutral-950">Browse by letter</h2>
        <p className="mt-2 text-sm text-neutral-700">
          Pick a letter to browse keyword pages. Each keyword has its own SEO page with FAQ and how-to.
        </p>
        <div className="mt-4 flex flex-wrap gap-2">
          {instagramKeywordBrowseGroups.map((g) => (
            <Link
              key={g}
              href={`/instagram-keywords/browse/${g}`}
              className="rounded-lg border border-neutral-200 bg-white px-3 py-1.5 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
            >
              {g.toUpperCase()}
            </Link>
          ))}
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

      <section className="rounded-3xl border border-neutral-200 bg-white p-6">
        <h2 className="text-2xl font-extrabold text-neutral-950">Start with these pages</h2>
        <ul className="mt-3 list-disc pl-5">
          <li><Link href="/instagram-fonts-generator" className="text-blue-600 underline">/instagram-fonts-generator</Link></li>
          <li><Link href="/instagram-username-generator" className="text-blue-600 underline">/instagram-username-generator</Link></li>
          <li><Link href="/instagram-bio-generator" className="text-blue-600 underline">/instagram-bio-generator</Link></li>
          <li><Link href="/instagram-hashtags-generator" className="text-blue-600 underline">/instagram-hashtags-generator</Link></li>
          <li><Link href="/instagram-captions-for-boys" className="text-blue-600 underline">/instagram-captions-for-boys</Link></li>
        </ul>
      </section>
    </SeoToolPageLayout>
  )
}
