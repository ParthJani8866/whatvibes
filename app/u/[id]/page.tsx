import { Metadata } from 'next';
import Image from 'next/image';
import { getUserLinksByPublicId } from '@/lib/userLinks';
import { QRCodeSVG } from 'qrcode.react';
import {
  FaInstagram,
  FaYoutube,
  FaLinkedin,
  FaFacebook,
  FaTwitter,
  FaPinterest,
  FaGithub,
} from 'react-icons/fa';
import { SiShopify } from 'react-icons/si';
import { GrGlobe } from 'react-icons/gr';
import PublicPageActions from '@/app/components/PublicPageActions';

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = await getUserLinksByPublicId(id);

  if (!profile) {
    return {
      title: 'Profile Not Found | Bio For IG',
      description: 'The link page you are looking for does not exist.',
    };
  }

  const title = profile.name ? `${profile.name} | Bio For IG` : 'Link Page | Bio For IG';
  const description = profile.bio || 'Check out this link‑in‑bio page on Bio For IG.';

  return {
    title,
    description,
    keywords: ['link in bio', 'bio for instagram', profile.name || '', ...(profile.categories || [])],
    openGraph: {
      title,
      description,
      type: 'profile',
      images: profile.profilePic || profile.image ? [{ url: profile.profilePic || profile.image || '' }] : [],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: profile.profilePic || profile.image ? [profile.profilePic || profile.image] : [],
    },
    robots: { index: true, follow: true },
  };
}

/* ─── Verified Badge ───────────────────────────────────────────────── */
function VerifiedBadge({ size = 'md' }: { size?: 'sm' | 'md' | 'lg' }) {
  const dims = size === 'sm' ? 'w-4 h-4' : size === 'lg' ? 'w-7 h-7' : 'w-5 h-5';
  return (
    <span
      className={`verified-badge inline-flex items-center justify-center rounded-full ${dims}`}
      title="Verified"
      aria-label="Verified account"
    >
      <svg viewBox="0 0 24 24" fill="none" className="w-full h-full">
        {/* Animated glow ring */}
        <circle cx="12" cy="12" r="11" className="badge-ring" strokeWidth="1.5" />
        {/* Badge body */}
        <path
          d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2z"
          className="badge-fill"
        />
        {/* Checkmark */}
        <path
          d="M9 12.5l2.5 2.5 5-5"
          stroke="white"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          className="badge-check"
        />
      </svg>
    </span>
  );
}

/* ─── Social icon map ──────────────────────────────────────────────── */
const SOCIALS = [
  { key: 'instagram',  icon: FaInstagram,  label: 'Instagram',  gradient: 'from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]' },
  { key: 'youtube',   icon: FaYoutube,    label: 'YouTube',    gradient: 'from-[#FF0000] to-[#cc0000]' },
  { key: 'linkedin',  icon: FaLinkedin,   label: 'LinkedIn',   gradient: 'from-[#0077B5] to-[#005fa3]' },
  { key: 'facebook',  icon: FaFacebook,   label: 'Facebook',   gradient: 'from-[#1877F2] to-[#0c5fd8]' },
  { key: 'x',         icon: FaTwitter,    label: 'X / Twitter',gradient: 'from-[#14171A] to-[#2b2b2b]' },
  { key: 'pinterest', icon: FaPinterest,  label: 'Pinterest',  gradient: 'from-[#E60023] to-[#ad081b]' },
  { key: 'shopify',   icon: SiShopify,    label: 'Shopify',    gradient: 'from-[#96bf48] to-[#5e8e3e]' },
  { key: 'github',    icon: FaGithub,     label: 'GitHub',     gradient: 'from-[#24292e] to-[#444d56]' },
  { key: 'website',   icon: GrGlobe,      label: 'Website',    gradient: 'from-[#6366f1] to-[#8b5cf6]' },
];

/* ─── Link Button ──────────────────────────────────────────────────── */
function LinkButton({
  href,
  label,
  IconComponent,
  gradient,
}: {
  href: string;
  label: string;
  IconComponent?: React.ComponentType<{ className?: string }>;
  gradient?: string;
}) {
  return (
    <a
      href={href}
      target="_blank"
      rel="noreferrer"
      className="link-btn group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-5 py-4 text-sm font-semibold text-white transition-all duration-300"
    >
      {/* Glass base */}
      <span className="link-btn-bg absolute inset-0 rounded-2xl" />
      {/* Hover shimmer */}
      <span className="link-btn-shimmer absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {/* Icon pill */}
      {IconComponent && (
        <span
          className={`link-btn-icon relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient ?? 'from-white/20 to-white/10'} shadow-lg`}
        >
          <IconComponent className="h-4 w-4 text-white" />
        </span>
      )}
      {/* Label */}
      <span className="relative z-10 flex-1 text-center text-[15px] font-semibold tracking-wide">{label}</span>
      {/* Arrow */}
      <span className="relative z-10 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/80">
        →
      </span>
    </a>
  );
}

/* ─── Page ─────────────────────────────────────────────────────────── */
export default async function PublicLinksPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getUserLinksByPublicId(id);

  /* 404 state */
  if (!profile) {
    return (
      <main className="page-root flex items-center justify-center">
        <style>{STYLES}</style>
        <div className="glass-card rounded-3xl p-10 text-center max-w-sm">
          <div className="text-5xl mb-4">🔍</div>
          <h1 className="text-xl font-bold text-white">Page not found</h1>
          <p className="mt-2 text-sm text-white/50">
            This profile may have been removed or the URL is incorrect.
          </p>
        </div>
      </main>
    );
  }

  const links = profile.links ?? {};
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/u/${profile.publicId}`;

  const jsonLd = {
    '@context': 'https://schema.org',
    '@type': 'ProfilePage',
    name: profile.name || 'Bio For IG Profile',
    description: profile.bio || '',
    url: pageUrl,
    image: profile.profilePic || profile.image || undefined,
    mainEntity: {
      '@type': 'Person',
      name: profile.name,
      description: profile.bio,
      image: profile.profilePic || profile.image,
      sameAs: Object.values(links).filter((v) => v && typeof v === 'string') as string[],
    },
  };

  return (
    <>
      <style>{STYLES}</style>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />

      <main className="page-root">
        {/* Aurora background orbs */}
        <div className="orb orb-1" />
        <div className="orb orb-2" />
        <div className="orb orb-3" />
        <div className="noise-overlay" />

        <div className="relative mx-auto max-w-md px-4 py-12 pb-20">

          {/* ── Banner ── */}
          {profile.banner && (
            <div className="mb-8 h-36 w-full overflow-hidden rounded-3xl shadow-2xl banner-wrap">
              <Image
                src={profile.banner}
                alt="Banner"
                width={1200}
                height={400}
                className="h-full w-full object-cover"
              />
              <div className="banner-overlay" />
            </div>
          )}

          {/* ── Profile Header ── */}
          <div className="profile-header mb-8 flex flex-col items-center text-center">
            {/* Avatar */}
            <div className="avatar-ring-wrap">
              <div className="avatar-ring" />
              {profile.profilePic || profile.image ? (
                <Image
                  src={profile.profilePic || profile.image}
                  alt={profile.name ?? 'Profile'}
                  width={112}
                  height={112}
                  className="avatar-img"
                />
              ) : (
                <div className="avatar-placeholder" />
              )}
              {profile.verified && (
                <div className="avatar-badge">
                  <VerifiedBadge size="md" />
                </div>
              )}
            </div>

            {/* Name + inline badge */}
            <div className="mt-5 flex items-center gap-2">
              <h1 className="name-text">{profile.name ?? 'User'}</h1>
              {profile.verified && <VerifiedBadge size="lg" />}
            </div>

            {/* Bio */}
            {profile.bio && (
              <p className="bio-text mt-3 max-w-xs">{profile.bio}</p>
            )}

            {/* Hobbies */}
            {profile.hobbies?.length > 0 && (
              <div className="mt-4 flex flex-wrap justify-center gap-2">
                {profile.hobbies.map((hobby: string) => (
                  <span key={hobby} className="tag tag-hobby">{hobby}</span>
                ))}
              </div>
            )}

            {/* Categories */}
            {profile.categories?.length > 0 && (
              <div className="mt-2 flex flex-wrap justify-center gap-2">
                {profile.categories.map((cat: string) => (
                  <span key={cat} className="tag tag-cat">{cat}</span>
                ))}
              </div>
            )}
          </div>

          {/* ── Links ── */}
          <div className="links-stack w-full space-y-3">
            {SOCIALS.map(({ key, icon: Icon, label, gradient }) =>
              links[key] ? (
                <LinkButton
                  key={key}
                  href={links[key]}
                  label={label}
                  IconComponent={Icon}
                  gradient={gradient}
                />
              ) : null
            )}
            {(links.other ?? []).map((href: string) => (
              <LinkButton
                key={href}
                href={href}
                label={href.replace(/^https?:\/\//, '')}
              />
            ))}
          </div>

          {/* ── QR + Share ── */}
          <div className="mt-10 flex flex-col items-center gap-4">
            <div className="qr-card glass-card rounded-2xl p-5 text-center">
              <p className="mb-3 text-xs font-semibold uppercase tracking-widest text-white/40">
                Scan to visit
              </p>
              <div className="qr-wrap mx-auto flex justify-center rounded-xl bg-white p-3 w-fit">
                <QRCodeSVG value={pageUrl} size={110} />
              </div>
            </div>
            <PublicPageActions url={pageUrl} title={profile.name || undefined} />
          </div>

          {/* ── Footer ── */}
          <footer className="mt-12 text-center">
            <p className="text-xs text-white/25 tracking-widest uppercase">
              Powered by <span className="text-white/50 font-semibold">Bio For IG</span>
            </p>
          </footer>
        </div>
      </main>
    </>
  );
}

/* ─── Styles ────────────────────────────────────────────────────────── */
const STYLES = `
  @import url('https://fonts.googleapis.com/css2?family=Syne:wght@400;600;700;800&family=DM+Sans:wght@300;400;500;600&display=swap');

  /* ── Root & Background ── */
  .page-root {
    font-family: 'DM Sans', sans-serif;
    min-height: 100vh;
    background: #080b14;
    position: relative;
    overflow-x: hidden;
  }

  /* ── Aurora orbs ── */
  .orb {
    position: fixed;
    border-radius: 50%;
    filter: blur(90px);
    pointer-events: none;
    z-index: 0;
    animation: drift 18s ease-in-out infinite alternate;
  }
  .orb-1 {
    width: 600px; height: 600px;
    top: -200px; left: -200px;
    background: radial-gradient(circle, rgba(99,102,241,0.35) 0%, transparent 70%);
    animation-delay: 0s;
  }
  .orb-2 {
    width: 500px; height: 500px;
    bottom: -150px; right: -150px;
    background: radial-gradient(circle, rgba(236,72,153,0.30) 0%, transparent 70%);
    animation-delay: -6s;
  }
  .orb-3 {
    width: 400px; height: 400px;
    top: 40%; left: 50%;
    transform: translate(-50%, -50%);
    background: radial-gradient(circle, rgba(56,189,248,0.18) 0%, transparent 70%);
    animation-delay: -12s;
  }
  @keyframes drift {
    0%   { transform: translate(0, 0) scale(1); }
    33%  { transform: translate(40px, -30px) scale(1.05); }
    66%  { transform: translate(-20px, 40px) scale(0.97); }
    100% { transform: translate(30px, 20px) scale(1.03); }
  }

  /* Noise texture overlay */
  .noise-overlay {
    position: fixed; inset: 0;
    background-image: url("data:image/svg+xml,%3Csvg viewBox='0 0 512 512' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)' opacity='0.04'/%3E%3C/svg%3E");
    pointer-events: none; z-index: 1; opacity: 0.6;
  }

  /* Glass card */
  .glass-card {
    background: rgba(255,255,255,0.04);
    border: 1px solid rgba(255,255,255,0.08);
    backdrop-filter: blur(20px);
    -webkit-backdrop-filter: blur(20px);
  }

  /* ── Banner ── */
  .banner-wrap { position: relative; }
  .banner-overlay {
    position: absolute; inset: 0;
    background: linear-gradient(to bottom, transparent 40%, #080b14 100%);
  }

  /* ── Avatar ── */
  .avatar-ring-wrap {
    position: relative;
    width: 120px; height: 120px;
  }
  .avatar-ring {
    position: absolute; inset: -3px;
    border-radius: 50%;
    background: conic-gradient(
      from 0deg,
      #6366f1, #a855f7, #ec4899, #38bdf8, #6366f1
    );
    animation: spin-ring 4s linear infinite;
    z-index: 0;
  }
  @keyframes spin-ring {
    to { transform: rotate(360deg); }
  }
  .avatar-img {
    position: relative; z-index: 1;
    width: 114px; height: 114px;
    border-radius: 50%;
    object-fit: cover;
    border: 3px solid #080b14;
  }
  .avatar-placeholder {
    position: relative; z-index: 1;
    width: 114px; height: 114px;
    border-radius: 50%;
    background: #1e2235;
    border: 3px solid #080b14;
  }
  .avatar-badge {
    position: absolute;
    bottom: 2px; right: 2px;
    z-index: 2;
    filter: drop-shadow(0 2px 8px rgba(99,102,241,0.8));
  }

  /* ── Name & Bio ── */
  .name-text {
    font-family: 'Syne', sans-serif;
    font-size: 1.85rem;
    font-weight: 800;
    color: #ffffff;
    letter-spacing: -0.02em;
    line-height: 1.1;
  }
  .bio-text {
    font-size: 0.9rem;
    color: rgba(255,255,255,0.55);
    line-height: 1.6;
    font-weight: 400;
  }

  /* ── Tags ── */
  .tag {
    display: inline-block;
    padding: 4px 12px;
    border-radius: 99px;
    font-size: 0.72rem;
    font-weight: 600;
    letter-spacing: 0.04em;
    text-transform: uppercase;
  }
  .tag-hobby {
    background: rgba(99,102,241,0.15);
    border: 1px solid rgba(99,102,241,0.3);
    color: #a5b4fc;
  }
  .tag-cat {
    background: rgba(236,72,153,0.12);
    border: 1px solid rgba(236,72,153,0.25);
    color: #f9a8d4;
  }

  /* ── Link Buttons ── */
  .link-btn {
    animation: slide-up 0.4s ease both;
  }
  .links-stack > *:nth-child(1)  { animation-delay: 0.05s; }
  .links-stack > *:nth-child(2)  { animation-delay: 0.10s; }
  .links-stack > *:nth-child(3)  { animation-delay: 0.15s; }
  .links-stack > *:nth-child(4)  { animation-delay: 0.20s; }
  .links-stack > *:nth-child(5)  { animation-delay: 0.25s; }
  .links-stack > *:nth-child(6)  { animation-delay: 0.30s; }
  .links-stack > *:nth-child(7)  { animation-delay: 0.35s; }
  .links-stack > *:nth-child(8)  { animation-delay: 0.40s; }
  .links-stack > *:nth-child(9)  { animation-delay: 0.45s; }
  @keyframes slide-up {
    from { opacity: 0; transform: translateY(16px); }
    to   { opacity: 1; transform: translateY(0); }
  }

  .link-btn-bg {
    background: rgba(255,255,255,0.05);
    border: 1px solid rgba(255,255,255,0.09);
    backdrop-filter: blur(12px);
    -webkit-backdrop-filter: blur(12px);
    transition: background 0.3s, border-color 0.3s;
  }
  .link-btn:hover .link-btn-bg {
    background: rgba(255,255,255,0.09);
    border-color: rgba(255,255,255,0.18);
  }
  .link-btn-shimmer {
    background: linear-gradient(
      105deg,
      transparent 30%,
      rgba(255,255,255,0.07) 50%,
      transparent 70%
    );
    background-size: 200% 100%;
    animation: shimmer-slide 1.5s ease infinite;
  }
  @keyframes shimmer-slide {
    from { background-position: 200% center; }
    to   { background-position: -200% center; }
  }
  .link-btn:hover { transform: translateY(-1px) scale(1.005); }
  .link-btn:active { transform: translateY(0) scale(0.99); }
  .link-btn-icon { transition: transform 0.3s ease; }
  .link-btn:hover .link-btn-icon { transform: scale(1.1) rotate(-3deg); }

  /* ── Verified Badge ── */
  .badge-ring {
    stroke: url(#badge-grad);
    fill: none;
    stroke-dasharray: 65;
    stroke-dashoffset: 65;
    animation: badge-draw 0.6s 0.3s ease forwards, badge-pulse 3s 1s ease-in-out infinite;
  }
  @keyframes badge-draw {
    to { stroke-dashoffset: 0; }
  }
  @keyframes badge-pulse {
    0%, 100% { opacity: 1; filter: drop-shadow(0 0 3px rgba(99,102,241,0.8)); }
    50%       { opacity: 0.7; filter: drop-shadow(0 0 6px rgba(99,102,241,1)); }
  }
  .badge-fill {
    fill: url(#badge-grad);
    filter: drop-shadow(0 0 4px rgba(99,102,241,0.6));
    animation: badge-pop 0.4s 0.5s cubic-bezier(0.34, 1.56, 0.64, 1) both;
  }
  @keyframes badge-pop {
    from { transform: scale(0); transform-origin: center; }
    to   { transform: scale(1); transform-origin: center; }
  }
  .badge-check {
    stroke-dasharray: 20;
    stroke-dashoffset: 20;
    animation: check-draw 0.3s 0.9s ease forwards;
  }
  @keyframes check-draw {
    to { stroke-dashoffset: 0; }
  }

  /* inline SVG defs for gradient – rendered inside each badge SVG */
  .verified-badge svg {
    overflow: visible;
  }
  /* inject defs via CSS content trick for the gradient */
  .verified-badge::before {
    content: '';
    display: none;
  }

  /* ── QR Card ── */
  .qr-card {
    width: 100%;
    max-width: 200px;
  }
  .qr-wrap {
    box-shadow: 0 0 0 1px rgba(255,255,255,0.08), 0 8px 32px rgba(0,0,0,0.4);
  }

  /* ── Profile header entrance ── */
  .profile-header {
    animation: fade-down 0.5s ease both;
  }
  @keyframes fade-down {
    from { opacity: 0; transform: translateY(-12px); }
    to   { opacity: 1; transform: translateY(0); }
  }
`;