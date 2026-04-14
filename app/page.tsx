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
} from 'react-icons/fa'
import { SiShopify, SiLinktree } from 'react-icons/si'
import { GrGlobe } from 'react-icons/gr'

export const metadata = {
  title: 'Link in Bio Tool | Create Your Instagram Bio Page | Bio For IG',
  description:
    'The best free link in bio tool for Instagram, TikTok, and more. Sign in with Google to create a beautiful page with all your social links. Perfect for creators and businesses.',
  keywords: [
    'link in bio',
    'bio for instagram',
    'instagram bio links',
    'linktree alternative',
    'social links page',
    'free link in bio tool',
    'Bio For IG',
  ],
  openGraph: {
    title: 'Bio For IG â€“ The Ultimate Link in Bio Tool',
    description:
      'Create your own beautiful linkâ€‘inâ€‘bio page. Add all your social links, customise your profile, and share it everywhere.',
    type: 'website',
    siteName: 'Bio For IG',
    images: [
      {
        url: '/opengraph-image',
        width: 1200,
        height: 630,
        alt: 'Bio For IG Link in Bio Preview',
      },
    ],
  },
  twitter: {
    card: 'summary_large_image',
    title: 'Bio For IG â€“ Link in Bio Tool',
    description:
      'Create your own beautiful linkâ€‘inâ€‘bio page. Free, fast, and easy. Sign in with Google.',
    images: ['/opengraph-image'],
  },
  robots: {
    index: true,
    follow: true,
  },
}

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

// ---------- Marketing Page (signed out) ----------
function MarketingPage() {
  return (
    <div className="space-y-20">
      {/* Hero */}
      <section className="relative overflow-hidden rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
        <div className="grid items-center gap-10 lg:grid-cols-2">

          {/* LEFT: Video */}

          {/* RIGHT: Content */}
          <div className="relative z-10">
            <h1 className="text-5xl font-extrabold tracking-tight sm:text-6xl">
              The #1 Link in Bio Tool
            </h1>

            <p className="mt-4 text-xl text-neutral-600">
              Create a stunning page with all your links, grow your audience, and
              track everything. Perfect for Instagram, TikTok, and more.
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
            </div>
          </div>

          <div className="relative w-full overflow-hidden rounded-2xl border border-neutral-200 shadow-md">
            <video
              className="w-full h-full object-cover rounded-2xl"
              autoPlay
              loop
              muted
              playsInline
            >
              <source src="../demo.mp4" type="video/mp4" />
              Your browser does not support the video tag.
            </video>
          </div>
        </div>

        {/* Decorative blobs */}
        <div className="absolute -right-20 -top-20 h-64 w-64 rounded-full bg-gradient-to-br from-yellow-200 to-orange-200 opacity-50 blur-3xl" />
        <div className="absolute -bottom-20 -left-20 h-64 w-64 rounded-full bg-gradient-to-tr from-blue-200 to-indigo-200 opacity-50 blur-3xl" />
      </section>

      {/* Feature Grid */}
      <section className="grid gap-8 md:grid-cols-2 lg:grid-cols-3">
        {[
          {
            icon: <BarChart3 className="h-8 w-8" />,
            title: 'Realâ€‘time Analytics',
            desc: 'Track views, clicks, and engagement for every link. Know what your audience loves.',
          },
          {
            icon: <Mail className="h-8 w-8" />,
            title: 'Email Capture',
            desc: 'Collect emails directly from your link page. Grow your newsletter effortlessly.',
          },
          {
            icon: <QrCode className="h-8 w-8" />,
            title: 'QR Code',
            desc: 'Generate a QR code for your page. Perfect for business cards, posters, and offline sharing.',
          },
          {
            icon: <Link2 className="h-8 w-8" />,
            title: '2 Highâ€‘Quality Backlinks',
            desc: 'Boost your SEO with backlinks from our trusted network. Your page automatically gains authority.',
          },
          {
            icon: <TrendingUp className="h-8 w-8" />,
            title: 'Social Visibility Boost',
            desc: 'Optimise your page for Instagram, YouTube, and Facebook algorithms. More views, more followers.',
          },
          {
            icon: <Share2 className="h-8 w-8" />,
            title: 'Easy Sharing',
            desc: 'One link to rule them all. Share your page everywhere with a single, memorable URL.',
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
      </section>

      {/* Detailed Benefits */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Why Creators Choose Bio For IG</h2>
        <div className="space-y-12">
          <Benefit
            icon={<BarChart3 className="h-12 w-12" />}
            title="Onâ€‘Page SEO & Dashboard Analytics"
            desc="Your page is fully optimised for search engines. See exactly how many people visit, which links they click, and when they engage. Our dashboard shows you the metrics that matter: total views, unique visitors, top links, and even geographic data (coming soon). Use these insights to refine your content and grow faster."
          />
          <Benefit
            icon={<Mail className="h-12 w-12" />}
            title="Email Subscriptions & Contact Downloads"
            desc="Turn visitors into subscribers. Add a simple email signup form to your page â€“ weâ€™ll collect emails for you. Then, download your contact list as CSV with one click. Build your audience while you sleep."
          />
          <Benefit
            icon={<QrCode className="h-12 w-12" />}
            title="QR Code for Your Link"
            desc="Every page gets a dynamic QR code. Place it on business cards, flyers, or your store window. When scanned, it takes people straight to your link page â€“ no typing, no errors. Great for offline marketing."
          />
          <Benefit
            icon={<Link2 className="h-12 w-12" />}
            title="2 Quality Backlinks for Your Page"
            desc="We automatically add two authoritative backlinks from our partner network to your page. This boosts your domain authority and helps you rank higher on Google. Itâ€™s like having a builtâ€‘in SEO boost."
          />
          <Benefit
            icon={<TrendingUp className="h-12 w-12" />}
            title="Boost Instagram, YouTube & Facebook Visibility"
            desc="Our linkâ€‘inâ€‘bio page is designed to work with social media algorithms. By providing a clean, fast, and engaging experience, you keep users on your content longer. Plus, you can track which platform sends the most traffic, so you know where to focus your efforts."
          />
          <Benefit
            icon={<Rocket className="h-12 w-12" />}
            title="How This Helps You Compete"
            desc="In a crowded digital space, every advantage counts. With Bio For IG, you're not just listing links â€“ you're building a professional hub that showcases your brand. Analytics help you double down on what works. Email capture builds a direct line to your fans. Backlinks boost your SEO. And the QR code bridges offline and online. Together, these tools give you the edge to stand out and grow faster than competitors."
          />
        </div>
      </section>

      {/* How It Works */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">How It Works</h2>
        <div className="grid gap-8 md:grid-cols-3">
          {[
            {
              step: '1',
              title: 'Sign in with Google',
              desc: 'One click, no password to remember. Your profile is created instantly.',
            },
            {
              step: '2',
              title: 'Add Your Links',
              desc: 'Paste your social media URLs. YouTube, Instagram, TikTok, custom links â€“ all supported.',
            },
            {
              step: '3',
              title: 'Share & Grow',
              desc: 'Get your unique URL and QR code. Share it everywhere and watch your audience grow.',
            },
          ].map((item, idx) => (
            <div
              key={idx}
              className="relative rounded-2xl border border-neutral-200 bg-white/60 p-6 text-center"
            >
              <div className="absolute -top-4 left-1/2 -translate-x-1/2 rounded-full bg-black px-4 py-1 text-sm font-bold text-white">
                Step {item.step}
              </div>
              <h3 className="mt-4 text-xl font-bold">{item.title}</h3>
              <p className="mt-2 text-neutral-600">{item.desc}</p>
            </div>
          ))}
        </div>
      </section>

      {/* FAQ */}
      <section>
        <h2 className="text-3xl font-bold text-center mb-12">Frequently Asked Questions</h2>
        <div className="mx-auto max-w-3xl space-y-4">
          <FaqItem
            question="Is it really free?"
            answer="Yes! Bio For IG is completely free. No credit card required. All core features â€“ unlimited links, analytics, QR code, and email capture â€“ are included. We may add premium features in the future, but the basics will always be free."
          />
          <FaqItem
            question="How do I add links?"
            answer="After signing in, you'll see a form where you can paste your URLs. We accept full links or handles (e.g., @username). Our system automatically converts them to proper links. You can also add custom links for anything else."
          />
          <FaqItem
            question="What analytics do I get?"
            answer="You can see total page views, link clicks, and a breakdown by link. We also show the top referrers (which platforms send you traffic) and a simple graph of views over time. More advanced analytics are coming soon."
          />
          <FaqItem
            question="How do I get the QR code?"
            answer="Once you're signed in, your page automatically has a QR code displayed in your dashboard. You can download it as an image and print it anywhere. It's dynamic â€“ if you update your links, the QR code still works."
          />
          <FaqItem
            question="What are the backlinks and why do I need them?"
            answer="Backlinks are links from other websites to yours. They are a major factor in Google rankings. We provide two backlinks from highâ€‘authority domains in our network, giving your page an SEO boost. You don't have to do anything â€“ they're added automatically."
          />
          <FaqItem
            question="Will this help me on Instagram / YouTube / TikTok?"
            answer="Absolutely. Instagram only allows one link in your bio â€“ make it count. With our page, you can direct your audience to all your content at once. And because the page is mobileâ€‘optimised and fast, it keeps users engaged, which algorithms love."
          />
        </div>
      </section>
      {/* Free Instagram Tools */}
      <section className="rounded-3xl border border-neutral-200 bg-white/80 p-8 shadow-xl backdrop-blur-sm">
        <h2 className="text-3xl font-bold">Explore our free Instagram tools</h2>
        <p className="mt-2 text-neutral-600">
          Fonts, usernames, bios, hashtags, captions, and 3,000+ SEO keywords — all interlinked for faster indexing.
        </p>
        <div className="mt-6 grid gap-3 md:grid-cols-2 lg:grid-cols-3">
          <Link href="/instagram-fonts-generator" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50">
            <div className="text-lg font-extrabold">Instagram Fonts Generator</div>
            <div className="mt-1 text-sm text-neutral-600">Copy/paste stylish fonts and symbols.</div>
          </Link>
          <Link href="/instagram-username-generator" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50">
            <div className="text-lg font-extrabold">Instagram Username Generator</div>
            <div className="mt-1 text-sm text-neutral-600">Unique + aesthetic username ideas.</div>
          </Link>
          <Link href="/instagram-bio-generator" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50">
            <div className="text-lg font-extrabold">Instagram Bio Generator</div>
            <div className="mt-1 text-sm text-neutral-600">Bios with niche + CTA (copy/paste).</div>
          </Link>
          <Link href="/instagram-hashtags-generator" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50">
            <div className="text-lg font-extrabold">Instagram Hashtags Generator</div>
            <div className="mt-1 text-sm text-neutral-600">Hashtag packs for reels and growth.</div>
          </Link>
          <Link href="/instagram-captions-for-boys" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50">
            <div className="text-lg font-extrabold">Instagram Captions</div>
            <div className="mt-1 text-sm text-neutral-600">Captions for boys & girls + reels hooks.</div>
          </Link>
          <Link href="/instagram-keywords" className="rounded-2xl border border-neutral-200 bg-white p-5 hover:bg-neutral-50">
            <div className="text-lg font-extrabold">Instagram SEO Keywords</div>
            <div className="mt-1 text-sm text-neutral-600">Browse 3,000+ keyword pages.</div>
          </Link>
        </div>
      </section>

      {/* Final CTA */}
      <section className="rounded-3xl bg-gradient-to-r from-black to-neutral-800 p-8 text-center text-white">
        <h2 className="text-3xl font-bold">Ready to grow your audience?</h2>
        <p className="mt-2 text-neutral-300">Join thousands of creators using Bio For IG today.</p>
        <div className="mt-6">
          <AuthButtons signedIn={false} />
        </div>
      </section>
    </div>
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
  // Placeholder data â€“ replace with real analytics from DB
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
    { key: 'x', icon: <FaTwitter className="mr-2 h-4 w-4" />, label: 'X' },
    { key: 'pinterest', icon: <FaPinterest className="mr-2 h-4 w-4" />, label: 'Pinterest' },
    { key: 'shopify', icon: <SiShopify className="mr-2 h-4 w-4" />, label: 'Shopify' },
    { key: 'github', icon: <FaGithub className="mr-2 h-4 w-4" />, label: 'GitHub' },
    { key: 'website', icon: <GrGlobe className="mr-2 h-4 w-4" />, label: 'Website' },
    { key: 'linkedin', icon: <SiLinktree className="mr-2 h-4 w-4" />, label: 'LinkedIn' }, // fallback icon, replace if needed
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
          {/* Existing socials */}
          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="youtube">
              YouTube
            </label>
            <input
              id="youtube"
              name="youtube"
              placeholder="https://youtube.com/@yourchannel or @yourchannel"
              defaultValue={links.youtube ?? ''}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="instagram">
              Instagram
            </label>
            <input
              id="instagram"
              name="instagram"
              placeholder="https://instagram.com/yourname or @yourname"
              defaultValue={links.instagram ?? ''}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="linkedin">
              LinkedIn
            </label>
            <input
              id="linkedin"
              name="linkedin"
              placeholder="https://linkedin.com/in/you or you"
              defaultValue={links.linkedin ?? ''}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="facebook">
              Facebook
            </label>
            <input
              id="facebook"
              name="facebook"
              placeholder="https://facebook.com/you or you"
              defaultValue={links.facebook ?? ''}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="x">
              X (Twitter)
            </label>
            <input
              id="x"
              name="x"
              placeholder="https://x.com/you or @you"
              defaultValue={links.x ?? ''}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          {/* New socials */}
          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="pinterest">
              Pinterest
            </label>
            <input
              id="pinterest"
              name="pinterest"
              placeholder="https://pinterest.com/yourname or yourname"
              defaultValue={links.pinterest ?? ''}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="shopify">
              Shopify
            </label>
            <input
              id="shopify"
              name="shopify"
              placeholder="https://yourstore.myshopify.com"
              defaultValue={links.shopify ?? ''}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="github">
              GitHub
            </label>
            <input
              id="github"
              name="github"
              placeholder="https://github.com/username or username"
              defaultValue={links.github ?? ''}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

          <div className="grid gap-2">
            <label className="text-sm font-semibold" htmlFor="website">
              Personal Website
            </label>
            <input
              id="website"
              name="website"
              placeholder="https://yourwebsite.com"
              defaultValue={links.website ?? ''}
              className="w-full rounded-xl border border-neutral-200 bg-white px-4 py-2.5 text-sm outline-none transition focus:border-black focus:ring-1 focus:ring-black"
            />
          </div>

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

            {/* Hobbies */}
            {profile?.hobbies?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {profile.hobbies.map((hobby: string) => (
                  <span
                    key={hobby}
                    className="rounded-full bg-neutral-100 px-3 py-1 text-xs text-neutral-700"
                  >
                    {hobby}
                  </span>
                ))}
              </div>
            )}

            {/* Categories */}
            {profile?.categories?.length > 0 && (
              <div className="flex flex-wrap justify-center gap-2">
                {profile.categories.map((cat: string) => (
                  <span
                    key={cat}
                    className="rounded-full bg-black/5 px-3 py-1 text-xs font-medium text-black"
                  >
                    {cat}
                  </span>
                ))}
              </div>
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
                  Add links on the left to see your beautiful linkâ€‘inâ€‘bio page.
                </div>
              )}
            </div>
          </div>
        </section>

        {/* Analytics Dashboard */}
        <section className="rounded-3xl border border-neutral-200 bg-white/80 p-6 shadow-lg backdrop-blur-sm">
          <h2 className="text-2xl font-bold flex items-center gap-2">
            <BarChart3 className="h-6 w-6" /> Dashboard
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

          {/* Email Capture Form (placeholder) */}
          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="font-semibold">Collect emails from your visitors</h3>
            <p className="text-sm text-neutral-600">
              Add an email signup form to your page. We'll store them here for you to download.
            </p>
            <button className="mt-2 rounded-lg border border-neutral-300 bg-white px-3 py-1.5 text-sm font-medium hover:bg-neutral-100">
              Enable Email Capture
            </button>
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
                Scan to visit your page. Rightâ€‘click to save.
              </p>
            </div>
          )}

          {/* Backlinks */}
          <div className="mt-6 rounded-xl border border-neutral-200 bg-neutral-50 p-4">
            <h3 className="font-semibold flex items-center gap-2">
              <Link2 className="h-5 w-5" /> 2 Quality Backlinks
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
              <li>âœ… Use your QR code on business cards and flyers.</li>
              <li>âœ… Add your link to your Instagram bio, YouTube channel, and TikTok profile.</li>
              <li>âœ… Share your page in stories with a "link in bio" sticker.</li>
              <li>âœ… Ask followers to save your page as a shortcut on their phone.</li>
            </ul>
          </div>
        </section>
      </div>
    </div>
  )
}

// Server action for saving links (now includes all socials)
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
    // Note: we're not updating banner, bio, etc. here â€“ those are handled by the profile page
  })

  revalidatePath('/')
}

export default async function Page() {
  const session = await getAuthSession()
  const email = session?.user?.email ?? null

  const profile = email ? await getUserLinksByEmail(email) : null

  // Redirect to profile completion if user is signed in but missing bio (incomplete profile)
  if (email && !profile?.bio) {
    redirect('/link-in-my-bio')
  }

  const links = profile?.links ?? {}

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
      ratingCount: '125',
    },
  }

  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <main className="relative min-h-screen bg-gradient-to-br from-white via-neutral-50 to-neutral-100">
        <div className="mx-auto max-w-5xl px-4 py-10">
          <header className="mb-12 flex items-center justify-between gap-4">
            <div className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-black to-neutral-800 text-white shadow-md">
                WV
              </div>
              <div>
                <h1 className="text-2xl font-extrabold tracking-tight">
                  Bio For IG
                </h1>
                <p className="text-sm text-neutral-600">
                  Your all in one link in bio tool for Instagram, Free forever.
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
    </>
  )
}




