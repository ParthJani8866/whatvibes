'use client'

import { signIn } from 'next-auth/react'

export default function GoogleSignInButton(props: { callbackUrl: string }) {
  return (
    <button
      type="button"
      className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
      onClick={() => signIn('google', { callbackUrl: props.callbackUrl })}
    >
      Sign in with Google
    </button>
  )
}

