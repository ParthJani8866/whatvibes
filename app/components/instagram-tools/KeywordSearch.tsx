'use client'

import Link from 'next/link'
import { useMemo, useState } from 'react'

type Entry = {
  keyword: string
  slug: string
}

export default function KeywordSearch({ entries }: { entries: Entry[] }) {
  const [query, setQuery] = useState('')

  const results = useMemo(() => {
    const q = query.trim().toLowerCase()
    if (!q) return []
    return entries
      .filter((e) => e.keyword.toLowerCase().includes(q))
      .slice(0, 20)
  }, [entries, query])

  return (
    <div className="rounded-3xl border border-neutral-200 bg-white p-6">
      <div className="text-lg font-extrabold text-neutral-950">Search keywords</div>
      <p className="mt-1 text-sm text-neutral-600">Type to find a keyword page instantly.</p>
      <input
        value={query}
        onChange={(e) => setQuery(e.target.value)}
        className="mt-4 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
        placeholder="e.g. instagram fonts generator, reels hashtags, bio ideas"
      />

      {query.trim() ? (
        <div className="mt-4 grid gap-2">
          {results.length === 0 ? (
            <div className="text-sm text-neutral-600">No matches yet.</div>
          ) : (
            results.map((r) => (
              <Link
                key={r.slug}
                href={`/instagram-keywords/${r.slug}`}
                className="rounded-xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-100"
              >
                {r.keyword}
              </Link>
            ))
          )}
        </div>
      ) : null}
    </div>
  )
}
