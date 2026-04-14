'use client'

import { useMemo, useState } from 'react'

function toHashtag(value: string) {
  const cleaned = value
    .trim()
    .toLowerCase()
    .replace(/[^a-z0-9\s_]/g, '')
    .replace(/\s+/g, '')

  if (!cleaned) return null
  return `#${cleaned}`
}

function unique(values: Array<string | null>) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const v of values) {
    if (!v) continue
    const key = v.toLowerCase()
    if (seen.has(key)) continue
    seen.add(key)
    out.push(v)
  }
  return out
}

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value)
}

export default function InstagramHashtagsTool() {
  const [topic, setTopic] = useState('')
  const [audience, setAudience] = useState('')

  const packs = useMemo(() => {
    const t = topic.trim()
    if (!t) return null

    const base = toHashtag(t)
    const aud = audience ? toHashtag(audience) : null

    const general = unique([
      base,
      '#instagram',
      '#instagood',
      '#reels',
      '#explorepage',
      '#viral',
      '#trending',
      '#creator',
      '#contentcreator',
      '#socialmedia',
    ])

    const niche = unique([
      base,
      aud,
      toHashtag(`${t}tips`),
      toHashtag(`${t}life`),
      toHashtag(`${t}daily`),
      toHashtag(`${t}lover`),
      toHashtag(`${t}community`),
      toHashtag(`learn${t}`),
      toHashtag(`${t}inspo`),
      toHashtag(`${t}ideas`),
    ])

    const reels = unique([
      base,
      '#reelsinstagram',
      '#reelsvideo',
      '#reelsoftheday',
      '#reelsviral',
      '#reelscreator',
      '#reelsdaily',
      '#reelsedit',
      '#reelsmusic',
      '#reelsindia',
    ])

    const business = unique([
      base,
      '#smallbusiness',
      '#business',
      '#entrepreneur',
      '#marketing',
      '#branding',
      '#shoponline',
      '#supportsmallbusiness',
      '#digitalmarketing',
      '#startuplife',
    ])

    return {
      general,
      niche,
      reels,
      business,
    }
  }, [topic, audience])

  const allText = useMemo(() => {
    if (!packs) return ''
    const all = [...packs.general, ...packs.niche, ...packs.reels, ...packs.business]
    return unique(all).join(' ')
  }, [packs])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-neutral-900">Topic</label>
          <input
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
            placeholder="e.g. travel, fitness, makeup"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-900">Audience (optional)</label>
          <input
            value={audience}
            onChange={(e) => setAudience(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
            placeholder="e.g. india, women, beginners"
          />
        </div>
      </div>

      {!packs ? (
        <p className="text-sm text-neutral-600">Enter a topic to generate hashtag packs.</p>
      ) : (
        <div className="space-y-4">
          <div className="flex items-center justify-between gap-3">
            <div className="text-sm font-semibold text-neutral-900">All hashtags</div>
            <button
              type="button"
              onClick={() => copyToClipboard(allText)}
              className="rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-xs font-semibold text-neutral-900 hover:bg-neutral-100"
            >
              Copy all
            </button>
          </div>
          <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4 text-sm leading-6 text-neutral-900 break-words">
            {allText}
          </div>

          <div className="grid gap-3 sm:grid-cols-2">
            {(
              [
                ['General', packs.general],
                ['Niche', packs.niche],
                ['Reels', packs.reels],
                ['Business', packs.business],
              ] as const
            ).map(([label, list]) => (
              <div key={label} className="rounded-2xl border border-neutral-200 bg-white p-4">
                <div className="flex items-center justify-between gap-3">
                  <div className="text-sm font-semibold text-neutral-900">{label}</div>
                  <button
                    type="button"
                    onClick={() => copyToClipboard(list.join(' '))}
                    className="rounded-lg border border-neutral-300 bg-white px-3 py-1 text-xs font-semibold hover:bg-neutral-100"
                  >
                    Copy
                  </button>
                </div>
                <div className="mt-2 text-sm leading-6 text-neutral-800 break-words">{list.join(' ')}</div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
