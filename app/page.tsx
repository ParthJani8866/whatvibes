// app/page.tsx
import { revalidatePath } from 'next/cache'
import { redirect } from 'next/navigation'
import Image from 'next/image'
import Link from 'next/link'
import AuthButtons from '@/app/components/AuthButtons'
import { Footer } from '@/app/components/Footer'
import { getAuthSession } from '@/lib/auth'
import {
  getUserLinksByEmail,
  normalizeLinks,
  upsertUserLinksByEmail,
} from '@/lib/userLinks'
import { QRCodeSVG } from 'qrcode.react'
import {
  BarChart3,
  Mail,
  QrCode,
  Link2,
  TrendingUp,
  Eye,
  MousePointer,
  ChevronDown,
  CheckCircle,
  Share2,
  Rocket,
  Pencil,
} from 'lucide-react'
import {
  FaInstagram,
  FaYoutube,
  FaFacebook,
  FaTwitter,
  FaPinterest,
  FaGithub,
  FaLinkedin,
  FaTiktok,
} from 'react-icons/fa'
import { SiShopify, SiLinktree } from 'react-icons/si'
import { GrGlobe } from 'react-icons/gr'

export const metadata = {
  title: 'Bio For IG | #1 Free Link in Bio Tool for Instagram & Creators',
  description:
    'Bio For IG is the best free link in bio tool for Instagram, TikTok, and YouTube. Create a stunning Instagram bio page with analytics, QR code, email capture, and SEO backlinks. Join 50k+ creators.',
  keywords: [
    'link in bio',
    'bio for ig',
    'bio for instagram',
    'instagram bio links',
    'linktree alternative',
    'free link in bio tool',
    'social links page',
    'Bio For IG',
    'instagram bio page',
    'bio link',
    'link in bio for instagram',
    'best link in bio tool',
    'free instagram bio links',
    'link in bio analytics',
    'qr code for bio',
    'email capture link in bio',
    'backlinks for seo',
    'instagram growth tool',
    'tiktok bio link',
    'youtube bio link',
    'link in bio free forever',
    'bio for instagram free',
    'create link in bio page',
  ],
  openGraph: {
    title: 'Bio For IG — The Ultimate Free Link in Bio Tool for Instagram',
    description:
      'Create your own beautiful link in bio page. Add all your social links, customise your profile, track analytics, and share it everywhere. Free forever.',
    type: 'website',
    siteName: 'Bio For IG',
    url: 'https://bioforig.com',
    images: [
      {
        url: '/opengraph-image.jpg',
        width: 1200,
        height: 630,
        alt: 'Bio For IG Link in Bio Tool Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bio For IG — Best Free Link in Bio Tool',
    description:
      'Create a stunning Instagram bio page with analytics, QR code, email capture, and SEO backlinks. Free forever. Sign in with Google.',
    images: ['/twitter-image.jpg'],
  },
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      'max-video-preview': -1,
      'max-image-preview': 'large',
      'max-snippet': -1,
    },
  },
  alternates: {
    canonical: 'https://bioforig.com',
  },
  verification: {
    google: 'your-google-verification-code',
  },
}

// Helper components
function LinkButton(props: { href: string; label: string; icon?: React.ReactNode }) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      className="group flex w-full items-center justify-center gap-2 rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-sm transition-all hover:scale-[1.02] hover:border-neutral-300 hover:shadow-md"
    >
      {props.icon}
      {props.label}
    </a>
  )
}

function Benefit({
  icon,
  title,
  desc,
}: {
  icon: React.ReactNode
  title: string
  desc: string
}) {
  return (
    <div className="flex flex-col gap-4 md:flex-row md:items-start">
      <div className="flex-shrink-0 rounded-xl bg-black/5 p-3 text-black">{icon}</div>
      <div>
        <h3 className="text-2xl font-bold">{title}</h3>
        <p className="mt-2 text-neutral-600">{desc}</p>
      </div>
    </div>
  )
}

function FaqItem({ question, answer }: { question: string; answer: string }) {
  return (
    <details className="group rounded-xl border border-neutral-200 bg-white/60 p-4">
      <summary className="flex cursor-pointer items-center justify-between font-semibold">
        {question}
        <ChevronDown className="h-5 w-5 transition-transform group-open:rotate-180" />
      </summary>
      <p className="mt-3 text-neutral-600">{answer}</p>
    </details>
  )
}

// ---------- Marketing Page (signed out) ----------
function MarketingPage() {
  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'SoftwareApplication',
    name: 'Bio For IG Link in Bio Tool',
    applicationCategory: 'WebApplication',
    operatingSystem: 'All',
    description:
      'A free tool to create a beautiful page with all your social links. Perfect for Instagram bio, TikTok, and more.',
    offers: {
      '@type': 'Offer',
      price: '0',
      priceCurrency: 'USD',
    },
    aggregateRating: {
      '@type': 'AggregateRating',
      ratingValue: '4.9',
      ratingCount: '1250',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <div className="space-y-20">
        {/* Hero */}
        <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
          <div className="grid items-center gap-10 lg:grid-cols-2">
            {/* LEFT: Content */}
            <div className="relative z-10">
              <div className="mb-4 inline-flex items-center gap-2 rounded-full bg-amber-100 px-3 py-1 text-xs font-semibold text-amber-800">
                <span className="relative flex h-2 w-2">
                  <span className="absolute inline-flex h-full w-full animate-ping rounded-full bg-amber-400 opacity-75"></span>
                  <span className="relative inline-flex h-2 w-2 rounded-full bg-amber-500"></span>
                </span>
                #1 Link in Bio Tool for Instagram
              </div>
              <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
                The <span className="bg-gradient-to-r from-amber-600 to-black bg-clip-text text-transparent">Ultimate</span>{' '}
                Link in Bio Tool
              </h1>
              <p className="mt-4 text-xl text-neutral-600">
                Create a stunning <strong className="text-black">link in bio page</strong>{' '}
                with all your social links, track every click, collect emails, and grow your audience on{' '}
                <strong>Instagram, TikTok, and YouTube</strong>.
              </p>

              <div className="mt-8">
                <AuthButtons signedIn={false} />
              </div>

              <div className="mt-6 flex flex-wrap gap-4 text-sm text-neutral-500">
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Free forever
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  No credit card
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Google sign-in
                </div>
                <div className="flex items-center gap-1">
                  <CheckCircle className="h-4 w-4 text-green-600" />
                  Real-time analytics
                </div>
              </div>
            </div>

            {/* RIGHT: Video */}
            <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 shadow-md">
              <video
                className="w-full h-full object-cover rounded-2xl"
                autoPlay
                loop
                muted
                playsInline
                poster="/demo-poster.jpg"
              >
                <source src="/demo.mp4" type="video/mp4" />
                Your browser does not support the video tag.
              </video>
            </div>
          </div>

          {/* Decorative blobs */}
          <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 opacity-50 blur-3xl" />
          <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-200 opacity-50 blur-3xl" />
        </section>

        {/* Feature Grid */}
        <section>
          <div className="text-center max-w-2xl mx-auto mb-12">
            <h2 className="text-3xl font-bold md:text-4xl">
              Everything you need for your{' '}
              <span className="underline decoration-amber-400">Instagram bio link</span>
            </h2>
            <p className="mt-3 text-neutral-600">
              Bio For IG combines essential growth tools into one beautiful page.
            </p>
          </div>
          <div className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
            {[
              {
                icon: <BarChart3 className="h-8 w-8" />,
                title: 'Real-time Analytics',
                desc: 'Track views, clicks, and engagement for every link. Know what your audience loves and optimize your Instagram bio page.',
              },
              {
                icon: <Mail className="h-8 w-8" />,
                title: 'Email Capture + CSV Export',
                desc: 'Add an email signup form to your link page. Grow your newsletter and download contacts as CSV — build your direct audience.',
              },
              {
                icon: <QrCode className="h-8 w-8" />,
                title: 'Dynamic QR Code',
                desc: 'Every page gets a QR code. Use on business cards, flyers, or store windows — scans lead directly to your bio link page.',
              },
              {
                icon: <Link2 className="h-8 w-8" />,
                title: '2 High-Quality Backlinks',
                desc: 'Boost your SEO automatically. Your page receives two authoritative backlinks from our trusted network — gain domain authority.',
              },
              {
                icon: <TrendingUp className="h-8 w-8" />,
                title: 'Social Visibility Boost',
                desc: 'Optimised for Instagram, TikTok & YouTube algorithms. Fast, mobile-first design keeps users engaged longer.',
              },
              {
                icon: <Share2 className="h-8 w-8" />,
                title: 'Easy Sharing',
                desc: 'One short, memorable link to rule all your content. Share it across socials, email signatures, and stories.',
              },
            ].map((feature, idx) => (
              <div
                key={idx}
                className="rounded-2xl border border-neutral-200 bg-white/60 p-6 shadow-sm transition-all hover:shadow-md"
              >
                <div className="mb-4 inline-block rounded-xl bg-black/5 p-2 text-black">
                  {feature.icon}
                </div>
                <h3 className="text-xl font-bold">{feature.title}</h3>
                <p className="mt-2 text-neutral-600">{feature.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Detailed Benefits */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">
            Why creators choose <span className="bg-black text-white px-4 py-1 rounded-xl">Bio For IG</span>
          </h2>
          <div className="space-y-12 max-w-4xl mx-auto">
            <Benefit
              icon={<BarChart3 className="h-12 w-12" />}
              title="On Page SEO & Dashboard Analytics"
              desc="Your link page is fully optimised for search engines. Dashboard shows total views, unique visitors, top links, and geographic performance. Turn data into growth."
            />
            <Benefit
              icon={<Mail className="h-12 w-12" />}
              title="Email Subscriptions & Contact Downloads"
              desc="Turn anonymous visitors into subscribers. Add a signup form to your link in bio page; download all contacts as CSV with one click. Build your tribe while you sleep."
            />
            <Benefit
              icon={<QrCode className="h-12 w-12" />}
              title="QR Code for Your Link Page"
              desc="Dynamic QR code that always points to your latest links. Perfect for menu cards, stickers, and conference booths — bridge offline and online marketing."
            />
            <Benefit
              icon={<Link2 className="h-12 w-12" />}
              title="2 Quality Backlinks for Your Page"
              desc="We automatically add two authoritative backlinks from our partner network to your page. This boosts your domain authority and helps you rank higher on Google — built-in SEO boost."
            />
            <Benefit
              icon={<TrendingUp className="h-12 w-12" />}
              title="Boost Instagram, YouTube & Facebook Visibility"
              desc="Our link in bio page is designed to work with social algorithms. Clean interface = higher time-on-site, which signals quality to platforms. Track which source sends most traffic."
            />
            <Benefit
              icon={<Rocket className="h-12 w-12" />}
              title="How This Helps You Compete"
              desc="With Bio For IG, you're not just listing links — you're building a professional hub that showcases your brand. Analytics help you double down on what works. Email capture builds a direct line to your fans. Backlinks boost your SEO. And the QR code bridges offline and online. Together, these tools give you the edge to stand out and grow faster than competitors."
            />
          </div>
        </section>

        {/* How It Works */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">
            How to create your Instagram bio link page
          </h2>
          <div className="grid gap-8 md:grid-cols-3">
            {[
              {
                step: '1',
                title: 'Sign in with Google',
                desc: 'One click, no password to remember. Your profile is created instantly with your avatar and name.',
                icon: 'fa-google',
              },
              {
                step: '2',
                title: 'Add Your Links',
                desc: 'Paste your social media URLs. YouTube, Instagram, TikTok, custom links — all supported.',
                icon: 'fa-plus-circle',
              },
              {
                step: '3',
                title: 'Share & Grow',
                desc: 'Get your unique URL and QR code. Share it everywhere and watch your audience grow.',
                icon: 'fa-chart-line',
              },
            ].map((item, idx) => (
              <div
                key={idx}
                className="relative rounded-2xl border border-neutral-200 bg-white/60 p-6 text-center"
              >
                <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-1 text-sm font-bold text-white">
                  Step {item.step}
                </div>
                <div className="mt-4 text-4xl">📌</div>
                <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
                <p className="mt-2 text-neutral-600">{item.desc}</p>
              </div>
            ))}
          </div>
        </section>

        {/* Free Instagram Tools */}
        <section className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
          <h2 className="text-3xl font-bold">Explore our free Instagram tools ecosystem</h2>
          <p className="mt-2 text-neutral-600">
            Fonts, usernames, bios, hashtags, captions, and 3,000+ SEO keywords — all interlinked for faster indexing.
          </p>
          <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
            <Link href="/instagram-fonts-generator" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50 transition">
              <div className="text-lg font-extrabold">Instagram Fonts Generator</div>
              <div className="mt-1 text-sm text-neutral-600">Copy/paste stylish fonts and symbols.</div>
            </Link>
            <Link href="/instagram-username-generator" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50 transition">
              <div className="text-lg font-extrabold">Instagram Username Generator</div>
              <div className="mt-1 text-sm text-neutral-600">Unique + aesthetic username ideas.</div>
            </Link>
            <Link href="/instagram-bio-generator" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50 transition">
              <div className="text-lg font-extrabold">Instagram Bio Generator</div>
              <div className="mt-1 text-sm text-neutral-600">Bios with niche + CTA (copy/paste).</div>
            </Link>
            <Link href="/instagram-hashtags-generator" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50 transition">
              <div className="text-lg font-extrabold">Instagram Hashtags Generator</div>
              <div className="mt-1 text-sm text-neutral-600">Hashtag packs for reels and growth.</div>
            </Link>
            <Link href="/instagram-captions-for-boys" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50 transition">
              <div className="text-lg font-extrabold">Instagram Captions</div>
              <div className="mt-1 text-sm text-neutral-600">Captions for boys & girls + reels hooks.</div>
            </Link>
            <Link href="/instagram-keywords" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50 transition">
              <div className="text-lg font-extrabold">Instagram SEO Keywords</div>
              <div className="mt-1 text-sm text-neutral-600">Browse 3,000+ keyword pages.</div>
            </Link>
          </div>
        </section>

        {/* FAQ */}
        <section>
          <h2 className="text-3xl font-bold text-center mb-12">
            Frequently Asked Questions about{' '}
            <span className="bg-gradient-to-r from-amber-600 to-black bg-clip-text text-transparent">link in bio tool</span>
          </h2>
          <div className="mx-auto max-w-3xl space-y-4">
            <FaqItem
              question="Is Bio For IG really free?"
              answer="Yes! Bio For IG is completely free forever. Unlimited links, analytics, QR code, email capture, and backlinks included. No credit card required. Premium features may come later but core stays free."
            />
            <FaqItem
              question="How do I add links to my Instagram bio page?"
              answer="After signing in, you'll see a dashboard where you paste any URL or social handle (e.g., @username). We auto-convert to proper links. You can also add custom links for anything else — blog, store, etc."
            />
            <FaqItem
              question="What kind of analytics will I see?"
              answer="You can track total page views, link clicks, click-through rate by link, top referrers (which platforms send traffic), and views over time. Advanced geo analytics coming soon."
            />
            <FaqItem
              question="How do I get my QR code?"
              answer="Once you're signed in, your dashboard automatically displays a dynamic QR code linking to your page. You can download it as PNG and print it anywhere — the QR code stays updated if you change links."
            />
            <FaqItem
              question="What are the backlinks and why do I need them for SEO?"
              answer="Backlinks are links from other websites to yours, which is a major ranking factor for Google. We provide two high-authority backlinks from our partner network to boost your page's domain authority automatically."
            />
            <FaqItem
              question="Will this help me on Instagram / YouTube / TikTok?"
              answer="Absolutely. Instagram only allows one link in bio — make it count. Our mobile-optimized, fast-loading link page keeps users engaged, which algorithms love. Plus you can track which platform drives most traffic."
            />
          </div>
        </section>

        {/* Final CTA */}
        <section className="rounded-3xl bg-gradient-to-r from-black to-neutral-800 p-8 text-center text-white">
          <h2 className="text-3xl font-bold">Ready to upgrade your Instagram bio link? 🚀</h2>
          <p className="mt-2 text-neutral-300">
            Join thousands of creators using Bio For IG — the smart link in bio tool with analytics, QR & backlinks.
          </p>
          <div className="mt-6">
            <AuthButtons signedIn={false} />
          </div>
          <p className="text-neutral-400 text-sm mt-4">
            No credit card • Free forever • Cancel anytime
          </p>
        </section>
      </div>
    </>
  )
}

// ---------- Dashboard (signed in) ----------
function Dashboard({
  session,
  profile,
  links,
}: {
  session: any
  profile: any
  links: any
}) {
  const stats = {
    views: profile?.views ?? 0,
    clicks: profile?.clicks ?? 0,
    emails: profile?.subscribersCount ?? 0,
  }

  const backlinks = [
    { url: 'https://example.com/backlink1', label: 'Creator Spotlight' },
    { url: 'https://example.com/backlink2', label: 'Top Link Pages' },
  ]

  const pageUrl = profile?.publicId
    ? `${process.env.NEXT_PUBLIC_SITE_URL}/u/${profile.publicId}`
    : ''

  const profilePic = profile?.profilePic || session?.user?.image

  const socials = [
    { key: 'instagram', icon: <FaInstagram className="mr-2 h-4 w-4" />, label: 'Instagram' },
    { key: 'youtube', icon: <FaYoutube className="mr-2 h-4 w-4" />, label: 'YouTube' },
    { key: 'facebook', icon: <FaFacebook className="mr-2 h-4 w-4" />, label: 'Facebook' },
    { key: 'x', icon: <FaTwitter className="mr-2 h-4 w-4" />, label: 'X (Twitter)' },
    { key: 'tiktok', icon: <FaTiktok className="mr-2 h-4 w-4" />, label: 'TikTok' },
    { key: 'pinterest', icon: <FaPinterest className="mr-2 h-4 w-4" />, label: 'Pinterest' },
    { key: 'linkedin', icon: <FaLinkedin className="mr-2 h-4 w-4" />, label: 'LinkedIn' },
    { key: 'shopify', icon: <SiShopify className="mr-2 h-4 w-4" />, label: 'Shopify' },
    { key: 'github', icon: <FaGithub className="mr-2 h-4 w-4" />, label: 'GitHub' },
    { key: 'website', icon: <GrGlobe className="mr-2 h-4 w-4" />, label: 'Website' },
  ]

  return (
    <div className="grid gap-8 lg:grid-cols-2">
      {/* Edit Links Card */}
      <section className="rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
        <div className="flex items-center justify-between">
          <h2 className="text-2xl font-bold">Edit your links</h2>
          <Link
            href="/link-in-my-bio?edit=true"
            className="flex items-center gap-1 rounded-full bg-neutral-100 px-3 py-1.5 text-sm font-medium hover:bg-neutral-200"
          >
            <Pencil className="h-3.5 w-3.5" /> Edit Profile
          </Link>
        </div>
        {profile?.publicId ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-2 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
            <span className="font-medium">Your public page:</span>
            <Link
              className="font-semibold text-black underline decoration-neutral-300 underline-offset-2 hover:text-neutral-700"
              href={`/u/${profile.publicId}`}
            >
              /u/{profile.publicId}
            </Link>
            <span className="text-xs text-neutral-400">
              Share this link in your Instagram bio!
            </span>
          </div>
        ) : null}
        <form action={saveLinksAction} className="mt-6 grid gap-5">
          {socials.map(({ key, label }) => (
            <div key={key} className="grid gap-2">
              <label className="text-sm font-semibold capitalize" htmlFor={key}>
                {label}
              </label>
              <input
                id={key}
                name={key}
                placeholder={`https://${key}.com/yourusername or @username`}
                defaultValue={links[key] ?? ''}
                className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
              />
            </div>
          ))}

          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="other">
              Other links (one per line)
            </label>
            <textarea
              id="other"
              name="other"
              rows={4}
              placeholder={'https://your.site\nhttps://another.link'}
              defaultValue={(links.other ?? []).join('\n')}
              className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <button
            type="submit"
            className="mt-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white shadow-md transition-all hover:scale-[1.02] hover:bg-black/90 active:scale-[0.98]"
          >
            Save links
          </button>
        </form>
      </section>

      {/* Right column: Preview + Analytics */}
      <div className="space-y-8">
        {/* Preview Card */}
        <section className="rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm transition-all hover:shadow-xl">
          <h2 className="text-2xl font-bold">Live Preview</h2>
          {profile?.banner && (
            <div className="mt-4 h-32 w-full overflow-hidden rounded-xl">
              <Image
                src={profile.banner}
                alt="Banner"
                width={800}
                height={200}
                className="h-full w-full object-cover"
              />
            </div>
          )}
          <div className="mt-6 flex flex-col items-center gap-4">
            {profilePic ? (
              <Image
                src={profilePic}
                alt={session?.user?.name ?? 'Profile'}
                width={96}
                height={96}
                className="size-24 rounded-full border-2 border-neutral-200 shadow-sm object-cover"
              />
            ) : (
              <div className="size-24 rounded-full bg-neutral-200 shadow-inner" />
            )}
            <div className="text-center">
              <div className="text-xl font-bold">
                {session?.user?.name ?? 'You'}
              </div>
              <div className="text-sm text-neutral-500">{session.user.email}</div>
            </div>

            {profile?.bio && (
              <p className="max-w-sm text-center text-neutral-700">{profile.bio}</p>
            )}

            {/* Social Links */}
            <div className="w-full max-w-sm space-y-3">
              {socials.map(
                ({ key, icon, label }) =>
                  links[key] && (
                    <LinkButton key={key} href={links[key]} label={label} icon={icon} />
                  )
              )}
              {(links.other ?? []).map((href: string) => (
                <LinkButton
                  key={href}
                  href={href}
                  label={href.replace(/^https?:\/\//, '')}
                />
              ))}
              {Object.values(links).filter(Boolean).length === 0 && (
                <div className="rounded-xl border border-dashed border-neutral-300 bg-neutral-50 p-4 text-center text-sm text-neutral-600">
                  Add links on the left to see your beautiful link‑in‑bio page.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Analytics Dashboard */}
        <section className="rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" /> Dashboard Analytics
          </h2>
          <div className="mt-4 grid grid-cols-3 gap-4">
            <div className="rounded-xl bg-neutral-50 p-3 text-center">
              <Eye className="mx-auto h-6 w-6 text-neutral-600" />
              <div className="mt-1 text-2xl font-bold">{stats.views}</div>
              <div className="text-xs text-neutral-500">Total Views</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 text-center">
              <MousePointer className="mx-auto h-6 w-6 text-neutral-600" />
              <div className="mt-1 text-2xl font-bold">{stats.clicks}</div>
              <div className="text-xs text-neutral-500">Link Clicks</div>
            </div>
            <div className="rounded-xl bg-neutral-50 p-3 text-center">
              <Mail className="mx-auto h-6 w-6 text-neutral-600" />
              <div className="mt-1 text-2xl font-bold">{stats.emails}</div>
              <div className="text-xs text-neutral-500">Email Subs</div>
            </div>
          </div>

          {/* QR Code */}
          {pageUrl && (
            <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4 text-center">
              <h3 className="font-semibold flex items-center justify-center gap-2">
                <QrCode className="h-5 w-5" /> Your QR Code
              </h3>
              <div className="mt-2 flex justify-center">
                <QRCodeSVG value={pageUrl} size={128} />
              </div>
              <p className="mt-2 text-xs text-neutral-500">
                Scan to visit your page. Right‑click to save.
              </p>
            </div>
          )}

          {/* Backlinks */}
          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Link2 className="h-5 w-5" /> 2 Quality Backlinks (SEO Boost)
            </h3>
            <ul className="mt-2 space-y-1 text-sm">
              {backlinks.map((bl, i) => (
                <li key={i}>
                  <a
                    href={bl.url}
                    target="_blank"
                    rel="noreferrer"
                    className="text-blue-600 underline"
                  >
                    {bl.label}
                  </a>
                </li>
              ))}
            </ul>
            <p className="mt-2 text-xs text-neutral-500">
              These links boost your SEO automatically.
            </p>
          </div>

          {/* Social Boost Tips */}
          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <TrendingUp className="h-5 w-5" /> Boost Your Social Visibility
            </h3>
            <ul className="mt-2 space-y-1 text-sm text-neutral-700">
              <li>✅ Use your QR code on business cards and flyers.</li>
              <li>✅ Add your link to your Instagram bio, YouTube channel, and TikTok profile.</li>
              <li>✅ Share your page in stories with a "link in bio" sticker.</li>
              <li>✅ Ask followers to save your page as a shortcut on their phone.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

// Server action for saving links
async function saveLinksAction(formData: FormData) {
  'use server'
  const session = await getAuthSession()
  const email = session?.user?.email
  if (!email) throw new Error('Unauthorized')

  const nextLinks = normalizeLinks({
    youtube: String(formData.get('youtube') ?? ''),
    instagram: String(formData.get('instagram') ?? ''),
    linkedin: String(formData.get('linkedin') ?? ''),
    facebook: String(formData.get('facebook') ?? ''),
    x: String(formData.get('x') ?? ''),
    tiktok: String(formData.get('tiktok') ?? ''),
    pinterest: String(formData.get('pinterest') ?? ''),
    shopify: String(formData.get('shopify') ?? ''),
    github: String(formData.get('github') ?? ''),
    website: String(formData.get('website') ?? ''),
    other: String(formData.get('other') ?? ''),
  })

  await upsertUserLinksByEmail({
    email,
    name: session.user?.name ?? null,
    image: session.user?.image ?? null,
    links: nextLinks,
  })

  revalidatePath('/')
}

export default async function Page() {
  const session = await getAuthSession()
  const email = session?.user?.email ?? null

  const profile = email ? await getUserLinksByEmail(email) : null

  // Redirect to profile completion if user is signed in but missing bio
  if (email && !profile?.bio) {
    redirect('/link-in-my-bio')
  }

  const links = profile?.links ?? {}

  return (
    <main className="relative min-h-screen bg-gradient-to-br from-white via-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-5xl px-4 py-10">
        <header className="mb-12 flex items-center justify-between gap-4">
          <div className="flex items-center gap-3">
            <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-black to-neutral-800 text-white shadow-md">
              <Link2 className="h-6 w-6" />
            </div>
            <div>
              <h1 className="text-2xl font-extrabold tracking-tight">
                Bio For IG
              </h1>
              <p className="text-sm text-neutral-600">
                Your all in one link in bio tool for Instagram — Free forever.
              </p>
            </div>
          </div>
          <div className="flex items-center gap-3">
            {email ? (
              <Link
                href="/subscribe"
                className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
              >
                Upgrade
              </Link>
            ) : null}
            <AuthButtons signedIn={Boolean(email)} />
          </div>
        </header>

        {!email ? <MarketingPage /> : <Dashboard session={session} profile={profile} links={links} />}

        <Footer />
      </div>
    </main>
  )
}