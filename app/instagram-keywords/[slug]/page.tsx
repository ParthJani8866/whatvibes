import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import JsonLd from '@/app/components/JsonLd'
import SeoToolPageLayout from '@/app/components/SeoToolPageLayout'
import {
  getInstagramKeywordEntries,
  getInstagramKeywordEntryBySlug,
} from '@/lib/instagramSeo'

type Props = {
  params: Promise<{ slug: string }>
}

function bestToolForKeyword(keyword: string) {
  const k = keyword.toLowerCase()
  if (k.includes('font') || k.includes('symbols') || k.includes('stylish text')) {
    return { href: '/instagram-fonts-generator', label: 'Instagram Fonts Generator' }
  }
  if (k.includes('username') || k.includes('name')) {
    return { href: '/instagram-username-generator', label: 'Instagram Username Generator' }
  }
  if (k.includes('hashtag')) {
    return { href: '/instagram-hashtags-generator', label: 'Instagram Hashtags Generator' }
  }
  if (k.includes('caption')) {
    return { href: '/ai-instagram-caption-generator', label: 'Instagram Caption Generator' }
  }
  if (k.includes('bio')) {
    return { href: '/instagram-bio-generator', label: 'Instagram Bio Generator' }
  }
  return { href: '/instagram-keywords', label: 'Instagram SEO Keywords' }
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params
  const entry = getInstagramKeywordEntryBySlug(slug)
  if (!entry) notFound()

  return {
    title: `${entry.keyword} | Instagram SEO Keyword`,
    description: `SEO page for “${entry.keyword}”. Includes how-to steps, FAQs, and internal links to related Instagram tools.`,
    alternates: { canonical: `/instagram-keywords/${entry.slug}` },
    robots: { index: true, follow: true },
  }
}

export default async function Page({ params }: Props) {
  const { slug } = await params
  const entry = getInstagramKeywordEntryBySlug(slug)
  if (!entry) notFound()

  const all = getInstagramKeywordEntries()
  const idx = all.findIndex((e) => e.slug === entry.slug)
  const related = all.slice(Math.max(0, idx - 6), Math.min(all.length, idx + 7)).filter((e) => e.slug !== entry.slug)

  const tool = bestToolForKeyword(entry.keyword)

  const faq = [
    {
      q: `How do I rank for “${entry.keyword}” on Google?`,
      a: 'Create a dedicated page targeting the exact phrase, add a clear title, helpful content, internal links to related pages, and include FAQ + HowTo schema.',
    },
    {
      q: 'Should I create one page per keyword?',
      a: 'For long-tail keywords, yes — one page per keyword works well when each page provides unique, useful info (not just a list of words).',
    },
    {
      q: 'How do I interlink keyword pages?',
      a: 'Link to the closest related keywords (same topic) and always link back to the relevant hub/tool page.',
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
    name: `How to use the keyword: ${entry.keyword}`,
    step: [
      {
        '@type': 'HowToStep',
        name: 'Use it in the title',
        text: `Make “${entry.keyword}” the main page title and first heading.`,
      },
      {
        '@type': 'HowToStep',
        name: 'Answer intent',
        text: 'Add examples, templates, or a simple tool that solves the user’s intent.',
      },
      {
        '@type': 'HowToStep',
        name: 'Link to related pages',
        text: 'Add 5–15 internal links to similar keyword pages and one hub/tool page.',
      },
    ],
  }

  return (
    <SeoToolPageLayout
      title={entry.keyword}
      description="Programmatic SEO keyword page with interlinking, FAQs, and how-to."
      related={[
        {
          href: tool.href,
          label: tool.label,
          description: 'Best matching tool page for this keyword.',
        },
        {
          href: '/instagram-keywords',
          label: 'Keyword Hub',
          description: 'Search all keywords and browse groups.',
        },
        {
          href: `/instagram-keywords/browse/${entry.group}`,
          label: `Browse ${entry.group.toUpperCase()} keywords`,
          description: 'More keyword pages in this group.',
        },
      ]}
    >
      <JsonLd data={howTo} />
      <JsonLd data={faqLd} />

      <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
        <h2 className="text-2xl font-extrabold text-neutral-950">Best next action</h2>
        <p className="mt-2 text-sm text-neutral-700">
          For this keyword, the most relevant tool page is:{' '}
          <Link href={tool.href} className="text-blue-600 underline">
            {tool.label}
          </Link>
          .
        </p>
        <p className="mt-2 text-sm text-neutral-700">
          Want to browse more?{' '}
          <Link href={`/instagram-keywords/browse/${entry.group}`} className="text-blue-600 underline">
            Browse keywords starting with {entry.group.toUpperCase()}
          </Link>
          .
        </p>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-neutral-950">How to rank for this keyword</h2>
        <ol className="list-decimal pl-5">
          <li>Use the exact keyword in your page title and first heading.</li>
          <li>Add examples, templates, and a simple generator or tool (if relevant).</li>
          <li>Include an FAQ section and a short how-to section (like this page).</li>
          <li>Interlink 5–15 related pages and keep adding new pages weekly.</li>
        </ol>
      </section>

      {related.length > 0 ? (
        <section className="space-y-3">
          <h2 className="text-2xl font-extrabold text-neutral-950">Related keyword pages</h2>
          <div className="grid gap-2 sm:grid-cols-2">
            {related.map((r) => (
              <Link
                key={r.slug}
                href={`/instagram-keywords/${r.slug}`}
                className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                {r.keyword}
              </Link>
            ))}
          </div>
        </section>
      ) : null}

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



