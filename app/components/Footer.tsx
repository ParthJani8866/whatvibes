import Link from 'next/link'

const footerLinks = [
  { href: '/about', label: 'About' },
  { href: '/contact', label: 'Contact' },
  { href: '/terms-of-service', label: 'Terms of Service' },
  { href: '/privacy-policy', label: 'Privacy Policy' },
]

export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500">
      <p>
        Bio For IG - The best{' '}
        <strong className="font-medium text-black">link in bio tool</strong>{' '}
        for Instagram, TikTok, and more. Create your own bio page with all your
        social links. Free, fast, and easy.
      </p>

      <nav
        aria-label="Footer"
        className="mt-4 flex flex-wrap items-center justify-center gap-x-5 gap-y-2"
      >
        {footerLinks.map((link) => (
          <Link
            key={link.href}
            href={link.href}
            className="transition-colors hover:text-neutral-800"
          >
            {link.label}
          </Link>
        ))}
      </nav>

      <p className="mt-3">
        Contact:{' '}
        <a
          href="mailto:info@bioforig.com"
          className="font-medium text-neutral-700 underline decoration-neutral-300 underline-offset-2 hover:text-black"
        >
          info@bioforig.com
        </a>
      </p>

      <p className="mt-2">
        &copy; {new Date().getFullYear()} Bio For IG. All rights reserved.
      </p>
    </footer>
  )
}
