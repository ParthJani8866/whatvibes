import type { Metadata } from 'next'
import Link from 'next/link'

import JsonLd from '@/app/components/JsonLd'
import SeoToolPageLayout from '@/app/components/SeoToolPageLayout'
import InstagramCaptionsTool from '@/app/components/instagram-tools/InstagramCaptionsTool'

export const metadata: Metadata = {
  title: 'Instagram Captions for Boys (Attitude + Short) | Bio For IG',
  description:
    'Copy and paste Instagram captions for boys — attitude, short, funny, reels captions and more. Updated caption ideas for growth.',
  keywords: [
    'instagram captions for boys',
    'attitude captions for instagram',
    'short instagram captions',
    'instagram captions for reels',
    'trending captions for instagram',
  ],
  alternates: { canonical: '/instagram-captions-for-boys' },
  robots: { index: true, follow: true },
}

export default function Page() {
  const faq = [
    {
      q: 'What captions work best for reels?',
      a: 'Short hooks that match the video: “Wait for it…”, “Sound on 🔊”, “Save this for later”, and one clear CTA.',
    },
    {
      q: 'Should I add hashtags in captions?',
      a: 'Yes, but keep them targeted. Use our hashtag generator to create a niche set for each post.',
    },
    {
      q: 'How long should an Instagram caption be?',
      a: 'For reels, shorter is usually better. For carousel posts, longer captions can increase saves and shares.',
    },
  ]

  const howTo = {
    '@context': 'https://schema.org',
    '@type': 'HowTo',
    name: 'How to use captions for boys',
    step: [
      {
        '@type': 'HowToStep',
        name: 'Pick a caption style',
        text: 'Choose attitude, funny, reels, or short captions depending on your post.',
      },
      {
        '@type': 'HowToStep',
        name: 'Copy a caption',
        text: 'Tap a caption to copy it to your clipboard.',
      },
      {
        '@type': 'HowToStep',
        name: 'Add hashtags',
        text: 'Add a niche hashtag pack for reach and consistency.',
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
      title="Instagram Captions for Boys"
      description="Attitude, short, funny, and reels caption ideas — tap to copy."
      related={[
        {
          href: '/instagram-captions-for-girls',
          label: 'Instagram Captions for Girls',
          description: 'Love, funny, short, and reels captions.',
        },
        {
          href: '/instagram-hashtags-generator',
          label: 'Instagram Hashtags Generator',
          description: 'Niche hashtag packs for reels and posts.',
        },
        {
          href: '/instagram-fonts-generator',
          label: 'Instagram Fonts Generator',
          description: 'Stylish text for bios and captions.',
        },
      ]}
    >
      <JsonLd data={howTo} />
      <JsonLd data={faqLd} />

      <section className="space-y-4">
        <h2 className="text-2xl font-extrabold text-neutral-950">Caption generator</h2>
        <InstagramCaptionsTool defaultMood="attitude" />
      </section>

      <section className="space-y-3">
        <h2 className="text-2xl font-extrabold text-neutral-950">Level up your reach</h2>
        <ul className="list-disc pl-5">
          <li>Use a 1-line hook, then a short CTA (save/share/DM).</li>
          <li>Keep one consistent “voice” across your profile.</li>
          <li>Pair captions with niche hashtags for discoverability.</li>
        </ul>
        <p>
          Try: <Link href="/instagram-hashtags-generator" className="text-blue-600 underline">Instagram hashtags generator</Link>
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
