'use client'

import { useMemo, useState } from 'react'

type Mood = 'attitude' | 'funny' | 'love' | 'sad' | 'short' | 'reels'

const moodLabels: Record<Mood, string> = {
  attitude: 'Attitude',
  funny: 'Funny',
  love: 'Love',
  sad: 'Sad',
  short: 'Short',
  reels: 'Reels',
}

async function copyToClipboard(value: string) {
  await navigator.clipboard.writeText(value)
}

export default function InstagramCaptionsTool({ defaultMood = 'short' }: { defaultMood?: Mood }) {
  const [mood, setMood] = useState<Mood>(defaultMood)

  const captions = useMemo(() => {
    const bank: Record<Mood, string[]> = {
      attitude: [
        'Built different.',
        'No permission needed.',
        'I don’t chase. I attract.',
        'Quiet moves, loud results.',
        'Prove them wrong — again.',
      ],
      funny: [
        'Running on coffee and confidence.',
        'If I were you, I’d admire me too.',
        'BRB, making memories (and snacks).',
        'I came. I saw. I forgot why I came.',
        'Mood: unbothered.',
      ],
      love: [
        'Love looks good on you.',
        'Soft heart, strong mind.',
        'You + me = my favorite story.',
        'Keep the love loud.',
        'Grateful for this moment.',
      ],
      sad: [
        'Some days are heavy. Still here.',
        'Healing isn’t linear.',
        'Quietly rebuilding.',
        'I miss the old me sometimes.',
        'It’s okay to not be okay.',
      ],
      short: [
        'New post.',
        'Just vibes.',
        'Weekend mode.',
        'Stay wild.',
        'Be real.',
        'Less talking, more doing.',
      ],
      reels: [
        'Watch till the end 👀',
        'Wait for it…',
        'POV: you needed this.',
        'Sound on 🔊',
        'Save this for later.',
      ],
    }

    return bank[mood]
  }, [mood])

  return (
    <div className="space-y-6">
      <div>
        <label className="text-sm font-semibold text-neutral-900">Caption type</label>
        <select
          value={mood}
          onChange={(e) => setMood(e.target.value as Mood)}
          className="mt-2 w-full rounded-xl border border-neutral-300 bg-white px-4 py-3 text-sm shadow-sm outline-none focus:border-neutral-400"
        >
          {(Object.keys(moodLabels) as Mood[]).map((k) => (
            <option key={k} value={k}>
              {moodLabels[k]}
            </option>
          ))}
        </select>
      </div>

      <div className="rounded-2xl border border-neutral-200 bg-neutral-50 p-4">
        <div className="text-sm font-semibold text-neutral-900">Captions (tap to copy)</div>
        <div className="mt-3 grid gap-2">
          {captions.map((c) => (
            <button
              key={c}
              type="button"
              onClick={() => copyToClipboard(c)}
              className="text-left rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
            >
              {c}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
