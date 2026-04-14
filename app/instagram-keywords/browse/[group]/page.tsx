import type { Metadata } from 'next'
import Link from 'next/link'
import { notFound } from 'next/navigation'

import SeoToolPageLayout from '@/app/components/SeoToolPageLayout'
import {
  getInstagramKeywordEntries,
  instagramKeywordBrowseGroups,
} from '@/lib/instagramSeo'

type Props = {
  params: Promise<{ group: string }>
}

function labelForGroup(group: string) {
  if (group === '0-9') return '0–9'
  return group.toUpperCase()
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { group } = await params
  if (!instagramKeywordBrowseGroups.includes(group as any)) notFound()

  return {
    title: `Instagram Keywords Starting With ${labelForGroup(group)} | Bio For IG`,
    description: `Browse Instagram SEO keyword pages starting with ${labelForGroup(group)}.`,
    alternates: { canonical: `/instagram-keywords/browse/${group}` },
    robots: { index: true, follow: true },
  }
}

export default async function Page({ params }: Props) {
  const { group } = await params
  if (!instagramKeywordBrowseGroups.includes(group as any)) notFound()

  const entries = getInstagramKeywordEntries().filter((e) => e.group === group)

  return (
    <SeoToolPageLayout
      title={`Browse keywords: ${labelForGroup(group)}`}
      description={`Keyword pages starting with ${labelForGroup(group)}. Click any keyword to open its SEO page.`}
      related={[
        {
          href: '/instagram-keywords',
          label: 'Keyword Hub',
          description: 'Search and browse all keyword groups.',
        },
        {
          href: '/instagram-fonts-generator',
          label: 'Instagram Fonts Generator',
          description: 'High-traffic SEO tool page.',
        },
        {
          href: '/instagram-hashtags-generator',
          label: 'Instagram Hashtags Generator',
          description: 'Generate niche hashtag packs.',
        },
      ]}
    >
      <section className="rounded-3xl border border-neutral-200 bg-neutral-50 p-6">
        <div className="text-sm font-semibold text-neutral-900">Jump to group</div>
        <div className="mt-3 flex flex-wrap gap-2">
          {instagramKeywordBrowseGroups.map((g) => (
            <Link
              key={g}
              href={`/instagram-keywords/browse/${g}`}
              className={`rounded-lg border px-3 py-1.5 text-sm font-semibold hover:bg-neutral-100 ${
                g === group
                  ? 'border-neutral-900 bg-neutral-900 text-white hover:bg-neutral-800'
                  : 'border-neutral-200 bg-white text-neutral-900'
              }`}
            >
              {labelForGroup(g)}
            </Link>
          ))}
        </div>
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-neutral-950">Keywords</h2>
        <div className="grid gap-2 sm:grid-cols-2">
          {entries.map((e) => (
            <Link
              key={e.slug}
              href={`/instagram-keywords/${e.slug}`}
              className="rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              {e.keyword}
            </Link>
          ))}
        </div>
      </section>
    </SeoToolPageLayout>
  )
}



