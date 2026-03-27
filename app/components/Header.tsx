import Link from 'next/link'
import AuthButtons from './AuthButtons'

export function Header({ signedIn }: { signedIn: boolean }) {
  return (
    <header className="mb-12 flex items-center justify-between gap-4">
      <div className="flex items-center gap-3">
        <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-black to-neutral-800 text-white shadow-md">
          WV
        </div>
        <div>
          <h1 className="text-2xl font-extrabold tracking-tight">Bio For IG</h1>
          <p className="text-sm text-neutral-600">Your all‑in‑one link‑in‑bio page</p>
        </div>
      </div>
      <div className="flex items-center gap-3">
        {signedIn ? (
          <Link
            href="/subscribe"
            className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
          >
            Upgrade
          </Link>
        ) : null}
        <AuthButtons signedIn={signedIn} />
      </div>
    </header>
  )
}
