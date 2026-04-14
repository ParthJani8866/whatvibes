'use client'

import { useMemo, useState } from 'react'

type Tone = 'professional' | 'aesthetic' | 'funny' | 'attitude' | 'minimal'

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value)
}

function titleCase(value: string) {
  return value
    .trim()
    .split(/\s+/)
    .filter(Boolean)
    .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
    .join(' ')
}

export default function InstagramBioTool() {
  const [name, setName] = useState('')
  const [niche, setNiche] = useState('')
  const [tone, setTone] = useState<Tone>('aesthetic')
  const [cta, setCta] = useState('DM for collabs')

  const bios = useMemo(() => {
    const n = titleCase(name || 'Your Name')
    const ni = niche.trim() || 'creator'
    const c = cta.trim() || 'DM for collabs'

    const templates: Record<Tone, string[]> = {
      professional: [
        `${n} • ${ni}\nHelping you level up • ${c}`,
        `${ni} • content & community\n📩 ${c}`,
        `${n} | ${ni}\nWork: ${c}`,
        `Building in public • ${ni}\nLet’s connect: ${c}`,
      ],
      aesthetic: [
        `${n} ✦ ${ni}\n✨ creating & growing\n${c}`,
        `☾ ${ni} vibes\n• daily moments •\n${c}`,
        `${n}\n${ni} • soft goals •\n${c}`,
        `a little bit of ${ni}\n& a lot of passion\n${c}`,
      ],
      funny: [
        `${n} • ${ni}\nI post so my mom thinks I’m famous\n${c}`,
        `${ni} by day, snack expert by night\n${c}`,
        `Professional overthinker • ${ni}\n${c}`,
        `If you’re reading this, we’re basically friends\n${c}`,
      ],
      attitude: [
        `${n} • ${ni}\nNo excuses. Just results.\n${c}`,
        `Main character energy • ${ni}\n${c}`,
        `Hustle. Create. Repeat.\n${c}`,
        `Stay real. Stay rare.\n${c}`,
      ],
      minimal: [
        `${n} • ${ni}\n${c}`,
        `${ni}\n${c}`,
        `${n}\n${ni}`,
        `${n} | ${ni}`,
      ],
    }

    return templates[tone]
  }, [name, niche, tone, cta])

  return (
    <div className="space-y-6">
      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-neutral-900">Name</label>
          <input
            value={name}
            onChange={(e) => setName(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
            placeholder="e.g. Maya"
          />
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-900">Niche</label>
          <input
            value={niche}
            onChange={(e) => setNiche(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
            placeholder="e.g. travel, fitness, business"
          />
        </div>
      </div>

      <div className="grid gap-4 sm:grid-cols-2">
        <div>
          <label className="text-sm font-semibold text-neutral-900">Tone</label>
          <select
            value={tone}
            onChange={(e) => setTone(e.target.value as Tone)}
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
          >
            <option value="aesthetic">Aesthetic</option>
            <option value="professional">Professional</option>
            <option value="funny">Funny</option>
            <option value="attitude">Attitude</option>
            <option value="minimal">Minimal</option>
          </select>
        </div>
        <div>
          <label className="text-sm font-semibold text-neutral-900">Call to action</label>
          <input
            value={cta}
            onChange={(e) => setCta(e.target.value)}
            className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
            placeholder="e.g. DM for collabs"
          />
        </div>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="text-sm font-semibold text-neutral-900">Bio ideas (tap to copy)</div>
        <div className="mt-3 grid gap-3">
          {bios.map((b, idx) => (
            <button
              key={idx}
              type="button"
              onClick={() => copyToClipboard(b)}
              className="text-left rounded-2xl border border-neutral-200 bg-white p-4 hover:bg-neutral-50"
            >
              <div className="whitespace-pre-line text-sm font-semibold text-neutral-900">{b}</div>
              <div className="mt-2 text-xs text-neutral-600">Click to copy</div>
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
