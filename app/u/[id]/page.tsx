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
  FaCheckCircle,
} from 'react-icons/fa';
import { SiShopify } from 'react-icons/si';
import { GrGlobe } from 'react-icons/gr';

import PublicPageActions from '@/app/components/PublicPageActions';
import ViewTracker from '@/app/components/ViewTracker';
import SubscriptionButton from '@/app/components/SubscriptionButton';
import LinkButton from '@/app/components/LinkButton';

/* ─── Metadata ─── */
export async function generateMetadata({ params }: { params: Promise<{ id: string }> }): Promise<Metadata> {
  const { id } = await params;
  const profile = await getUserLinksByPublicId(id);

  if (!profile) {
    return {
      title: 'Profile Not Found | Bio For IG',
      description: 'The link page you are looking for does not exist.',
    };
  }

  const title = profile.name ? `${profile.name} | Bio For IG` : 'Link Page | Bio For IG';

  return {
    title,
    description: profile.bio || '',
    openGraph: { title, description: profile.bio || '' },
  };
}

/* ─── Verified Badge ─── */
function VerifiedBadge() {
  return (
    <span className="inline-flex items-center ml-1">
      <FaCheckCircle className="w-3.5 h-3.5 text-[#1DA1F2]" />
    </span>
  );
}

/* ─── Socials ─── */
const SOCIALS = [
  { key: 'instagram', icon: FaInstagram, label: 'Instagram', gradient: 'from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]' },
  { key: 'youtube', icon: FaYoutube, label: 'YouTube', gradient: 'from-[#FF0000] to-[#cc0000]' },
  { key: 'linkedin', icon: FaLinkedin, label: 'LinkedIn', gradient: 'from-[#0077B5] to-[#005fa3]' },
  { key: 'facebook', icon: FaFacebook, label: 'Facebook', gradient: 'from-[#1877F2] to-[#0c5fd8]' },
  { key: 'x', icon: FaTwitter, label: 'X / Twitter', gradient: 'from-[#14171A] to-[#2b2b2b]' },
  { key: 'pinterest', icon: FaPinterest, label: 'Pinterest', gradient: 'from-[#E60023] to-[#ad081b]' },
  { key: 'shopify', icon: SiShopify, label: 'Shopify', gradient: 'from-[#96bf48] to-[#5e8e3e]' },
  { key: 'github', icon: FaGithub, label: 'GitHub', gradient: 'from-[#24292e] to-[#444d56]' },
  { key: 'website', icon: GrGlobe, label: 'Website', gradient: 'from-[#6366f1] to-[#8b5cf6]' },
];

/* ─── Page ─── */
export default async function PublicLinksPage({ params }: { params: Promise<{ id: string }> }) {
  const { id } = await params;
  const profile = await getUserLinksByPublicId(id);

  if (!profile) {
    return <div className="text-center p-10">Page not found</div>;
  }

  const links = profile.links ?? {};
  const pageUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/u/${profile.publicId}`;

  return (
    <>
      <style>{STYLES}</style>

      <main className="page-root">
        <div className="mx-auto max-w-md px-2 py-4">
          <div className="bg-white rounded-3xl border border-neutral-200 shadow-sm p-2">

            {/* ─── Facebook Style Header ─── */}
            <div className="mb-10">

              {/* Banner */}
              <div className="relative h-40 w-full rounded-2xl overflow-hidden bg-neutral-100">
                {profile.banner && (
                  <Image
                    src={profile.banner}
                    alt="Banner"
                    fill
                    className="object-cover"
                    priority
                  />
                )}
              </div>

              {/* Avatar */}
              <div className="flex flex-col items-center -mt-12">
                <div className="relative">
                  {profile.profilePic || profile.image ? (
                    <Image
                      src={profile.profilePic || profile.image}
                      alt="Profile"
                      width={110}
                      height={110}
                      className="w-28 h-28 rounded-full object-cover border-4 border-white shadow-md"
                    />
                  ) : (
                    <div className="w-28 h-28 rounded-full bg-neutral-200 border-4 border-white shadow-md" />
                  )}
                </div>

                {/* Name */}
                <div className="flex items-center mt-3">
                  <h1 className="text-2xl font-semibold text-neutral-900">
                    {profile.name ?? 'User'}
                  </h1>
                  <VerifiedBadge />
                </div>
                {/* Hobbies */}
                {profile.hobbies?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-3">
                    {profile.hobbies.map((hobby: string) => (
                      <span
                        key={hobby}
                        className="px-3 py-1 text-xs font-medium rounded-full bg-black text-white hover:bg-neutral-800 transition"
                      >
                        {hobby}
                      </span>
                    ))}
                  </div>
                )}

                {/* Categories */}
                {profile.categories?.length > 0 && (
                  <div className="flex flex-wrap justify-center gap-2 mt-2">
                    {profile.categories.map((cat: string) => (
                      <span
                        key={cat}
                        className="flex items-center gap-1 px-3 py-1 text-xs font-medium bg-neutral-100 text-neutral-700 rounded-full border border-neutral-200 hover:bg-neutral-200 transition"
                      >
                        {cat}
                      </span>
                    ))}
                  </div>
                )}
                {/* Bio */}
                {profile.bio && (
                  <p className="text-sm text-neutral-500 text-center mt-1 max-w-xs">
                    {profile.bio}
                  </p>
                )}
              </div>
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-200 my-6" />

            {/* Links */}
            <div className="links-stack w-full space-y-3 text-h3-light">
              {SOCIALS.map(({ key, label }) =>
                links[key] ? (
                  <LinkButton
                    key={key}
                    href={links[key]}
                    label={label}
                    iconKey={key}
                    profileId={profile.publicId}
                    linkKey={key}
                  />
                ) : null
              )}
              {(links.other ?? []).map((href: string) => (
                <LinkButton
                  key={href}
                  href={href}
                  label={href.replace(/^https?:\/\//, '')}
                  profileId={profile.publicId}
                  linkKey={href}
                />
              ))}
            </div>

            {/* Divider */}
            <div className="border-t border-neutral-200 my-6" />

            {/* QR */}
            <div className="flex flex-col items-center gap-4">
              <div className="rounded-xl border border-neutral-200 bg-white p-4 shadow-sm">
                <QRCodeSVG value={pageUrl} size={100} />
              </div>
              <PublicPageActions url={pageUrl} title={profile.name || ''} />
            </div>

            {/* Tracking */}
            <ViewTracker profileId={profile.publicId} />
            <SubscriptionButton profileId={profile.publicId} profileName={profile.name} />

            {/* Footer */}
            <footer className="mt-10 text-center">
              <p className="text-xs text-neutral-400">
                Powered by <span className="font-semibold text-neutral-700">Bio For IG</span>
              </p>
            </footer>

          </div>
        </div>
      </main>
    </>
  );
}

/* ─── Styles ─── */
const STYLES = `
  body {
    background: #f6f7f9;
  }
    .text-h3-light {
      font-size: 1.125rem; /* 18px */
      font-weight: 500;
      color: #9ca3af; /* neutral-400 */
    }
  .page-root {
    color-lightgray;
    min-height: 100vh;
  }
`;