'use client';

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

interface LinkButtonProps {
  href: string;
  label: string;
  iconKey?: string;
  profileId: string;
  linkKey: string;
}

// Map icon keys to components
const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  instagram: FaInstagram,
  youtube: FaYoutube,
  linkedin: FaLinkedin,
  facebook: FaFacebook,
  x: FaTwitter,
  pinterest: FaPinterest,
  shopify: SiShopify,
  github: FaGithub,
  website: GrGlobe,
};

// Map icon keys to gradients
const gradientMap: Record<string, string> = {
  instagram: 'from-[#f09433] via-[#e6683c] via-[#dc2743] via-[#cc2366] to-[#bc1888]',
  youtube: 'from-[#FF0000] to-[#cc0000]',
  linkedin: 'from-[#0077B5] to-[#005fa3]',
  facebook: 'from-[#1877F2] to-[#0c5fd8]',
  x: 'from-[#14171A] to-[#2b2b2b]',
  pinterest: 'from-[#E60023] to-[#ad081b]',
  shopify: 'from-[#96bf48] to-[#5e8e3e]',
  github: 'from-[#24292e] to-[#444d56]',
  website: 'from-[#6366f1] to-[#8b5cf6]',
};

// Helper to turn stored handles/partial URLs into absolute URLs
function normalizeStoredUrl(raw: string, platform: string): string {
  if (raw.startsWith('http://') || raw.startsWith('https://')) {
    return raw;
  }
  const handle = raw.trim().replace(/^@/, '');
  switch (platform) {
    case 'instagram':
      return `https://instagram.com/${handle}`;
    case 'youtube':
      return `https://youtube.com/${handle.startsWith('@') ? handle : '@' + handle}`;
    case 'linkedin':
      if (handle.startsWith('in/') || handle.startsWith('company/')) {
        return `https://linkedin.com/${handle}`;
      }
      return `https://linkedin.com/in/${handle}`;
    case 'facebook':
      return `https://facebook.com/${handle}`;
    case 'x':
      return `https://x.com/${handle}`;
    case 'pinterest':
      return `https://pinterest.com/${handle}`;
    case 'github':
      return `https://github.com/${handle}`;
    case 'shopify':
      if (!raw.includes('.')) {
        return `https://${handle}.myshopify.com`;
      }
      return `https://${handle}`;
    case 'website':
    default:
      return `https://${handle}`;
  }
}

export default function LinkButton({
  href,
  label,
  iconKey,
  profileId,
  linkKey,
}: LinkButtonProps) {
  const finalHref = iconKey ? normalizeStoredUrl(href, iconKey) : href;
  const IconComponent = iconKey ? iconMap[iconKey] : undefined;
  const gradient = iconKey ? gradientMap[iconKey] : 'from-white/20 to-white/10';

  const handleClick = async () => {
    try {
      await fetch(`/api/profile/${profileId}/click`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ link: linkKey }),
      });
    } catch (err) {
      console.error('Failed to track click:', err);
    }
  };

  return (
    <a
      href={finalHref}
      target="_blank"
      rel="noreferrer"
      onClick={handleClick}
      className="link-btn group relative flex w-full items-center gap-3 overflow-hidden rounded-2xl px-5 py-4 text-sm font-semibold text-white transition-all duration-300"
    >
      <span className="link-btn-bg absolute inset-0 rounded-2xl" />
      <span className="link-btn-shimmer absolute inset-0 rounded-2xl opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      {IconComponent && (
        <span
          className={`link-btn-icon relative z-10 flex h-9 w-9 shrink-0 items-center justify-center rounded-xl bg-gradient-to-br ${gradient} shadow-lg`}
        >
          <IconComponent className="h-4 w-4 text-white" />
        </span>
      )}
      <span className="relative z-10 flex-1 text-center text-[15px] font-semibold tracking-wide">{label}</span>
      <span className="relative z-10 text-white/40 transition-transform duration-300 group-hover:translate-x-1 group-hover:text-white/80">
        →
      </span>
    </a>
  );
}