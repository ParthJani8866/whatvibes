'use client'

import { signIn, signOut } from 'next-auth/react'

export default function AuthButtons(props: { signedIn: boolean }) {
  if (!props.signedIn) {
    return (
      <button
        type="button"
        className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
        onClick={() => signIn('google', { callbackUrl: '/' })}
      >
        Continue with Google
      </button>
    )
  }

  return (
    <button
      type="button"
      className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50"
      onClick={() => signOut({ callbackUrl: '/' })}
    >
      Sign out
    </button>
  )
}

