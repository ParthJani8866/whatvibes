export function Footer() {
  return (
    <footer className="mt-16 border-t border-neutral-200 pt-8 text-center text-sm text-neutral-500">
      <p>
        Bio For IG – The best{' '}
        <strong className="font-medium text-black">link in bio tool</strong>{' '}
        for Instagram, TikTok, and more. Create your own bio page with all your
        social links. Free, fast, and easy.
      </p>
      <p className="mt-2">
        © {new Date().getFullYear()} Bio For IG. All rights reserved.
      </p>
    </footer>
  )
}