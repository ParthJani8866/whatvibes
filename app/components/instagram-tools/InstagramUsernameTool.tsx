'use client'

import { useMemo, useState } from 'react'

function normalizeBase(value: string) {
  return value
    .trim()
    .toLowerCase()
    .replace(/\s+/g, '')
    .replace(/[^a-z0-9._]/g, '')
}

function unique(values: string[]) {
  const seen = new Set<string>()
  const out: string[] = []
  for (const v of values) {
    const key = v.toLowerCase()
    if (!v) continue
    if (seen.has(key)) continue
    seen.add(key)
    out.push(v)
  }
  return out
}

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value)
}

export default function InstagramUsernameTool() {
  const [name, setName] = useState('')
  const [niche, setNiche] = useState('')

  const suggestions = useMemo(() => {
    const base = normalizeBase(name)
    const nicheBase = normalizeBase(niche)

    if (!base) return []

    const prefixes = ['its', 'iam', 'the', 'real', 'official', 'hey', 'mr', 'ms']
    const suffixes = ['hq', 'daily', 'world', 'studio', 'media', 'vibes', 'life', 'team']
    const separators = ['', '_', '.', '__', '._', '_.']
    const numbers = ['', '1', '7', '99', '101', '2026']

    const raw: string[] = []

    raw.push(base)
    raw.push(`${base}${nicheBase ? '_' + nicheBase : ''}`)

    for (const pre of prefixes) {
      for (const sep of separators) {
        raw.push(`${pre}${sep}${base}`)
      }
    }

    for (const suf of suffixes) {
      for (const sep of separators) {
        raw.push(`${base}${sep}${suf}`)
        if (nicheBase) raw.push(`${base}${sep}${nicheBase}${sep}${suf}`)
      }
    }

    for (const sep of separators) {
      for (const num of numbers) {
        if (!num) continue
        raw.push(`${base}${sep}${num}`)
        raw.push(`${base}${sep}${nicheBase || 'ig'}${sep}${num}`)
      }
    }

    return unique(raw)
      .map((v) => v.replace(/^\.+/, '').replace(/\.+$/, ''))
      .filter((v) => v.length >= 3 && v.length <= 30)
      .slice(0, 60)
  }, [name, niche])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-neutral-900">Base name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
            placeholder="e.g. Alex, StyleByMaya, FitRahul"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-900">Niche (optional)</label>
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
            placeholder="e.g. travel, fitness, photography"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="flex items-center justify-between gap-3">
          <div className="text-sm font-semibold text-neutral-900">Username ideas</div>
          <div className="text-xs text-neutral-600">Tip: keep it readable</div>
        </div>

        {suggestions.length === 0 ? (
          <p className="mt-3 text-sm text-neutral-600">Enter a base name to generate ideas.</p>
        ) : (
          <ul className="mt-3 grid gap-2 sm:grid-cols-2">
            {suggestions.map((s) => (
              <li key={s} className="flex items-center justify-between gap-2 rounded-xl border border-neutral-200 bg-white px-3 py-2">
                <span className="text-sm font-semibold text-neutral-900">{s}</span>
                <button
                  type="button"
                  onClick={() => copyToClipboard(s)}
                  className="rounded-lg border border-neutral-300 bg-white px-2.5 py-1 text-xs font-semibold hover:bg-neutral-100"
                >
                  Copy
                </button>
              </li>
            ))}
          </ul>
        )}

        <p className="mt-4 text-xs text-neutral-600">
          Note: We can’t check real Instagram availability automatically. Paste your favorite idea into Instagram to confirm.
        </p>
      </div>
    </div>
  )
}
