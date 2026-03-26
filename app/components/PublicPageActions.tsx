'use client';

import { Share2 } from 'lucide-react';
import { FaTwitter, FaFacebook } from 'react-icons/fa';

export default function PublicPageActions({ url, title }: { url: string; title?: string }) {
  const copyLink = () => {
    navigator.clipboard.writeText(url);
    alert('Link copied to clipboard!');
  };

  const shareOnTwitter = () => {
    const text = title ? `Check out ${title}'s link page: ${url}` : `Check out this link page: ${url}`;
    window.open(`https://twitter.com/intent/tweet?text=${encodeURIComponent(text)}`, '_blank');
  };

  const shareOnFacebook = () => {
    window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank');
  };

  return (
    <div className="flex gap-2">
      <button
        onClick={shareOnTwitter}
        className="rounded-full bg-black/5 p-2 text-neutral-600 transition hover:bg-black/10"
        aria-label="Share on X"
      >
        <FaTwitter className="h-4 w-4" />
      </button>
      <button
        onClick={shareOnFacebook}
        className="rounded-full bg-black/5 p-2 text-neutral-600 transition hover:bg-black/10"
        aria-label="Share on Facebook"
      >
        <FaFacebook className="h-4 w-4" />
      </button>
      <button
        onClick={copyLink}
        className="rounded-full bg-black/5 p-2 text-neutral-600 transition hover:bg-black/10"
        aria-label="Copy link"
      >
        <Share2 className="h-4 w-4" />
      </button>
    </div>
  );
}