'use client'

import { useState } from 'react'
import { signIn, signOut } from 'next-auth/react'

export default function AuthButtons(props: { signedIn: boolean }) {
  const [loading, setLoading] = useState(false)

  const handleSignIn = async () => {
    setLoading(true)
    try {
      await signIn('google', { callbackUrl: '/subscribe' })
      setLoading(false)
    } catch (error) {
      setLoading(false)
      console.error('Sign in error:', error)
    } finally {
      
    }
  }

  const handleSignOut = async () => {
    setLoading(true)
    try {
      await signOut({ callbackUrl: '/' })
    } catch (error) {
      console.error('Sign out error:', error)
    } finally {
      setLoading(false)
    }
  }

  if (!props.signedIn) {
    return (
      <button
        type="button"
        disabled={loading}
        className="rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90 disabled:cursor-not-allowed disabled:bg-neutral-400"
        onClick={handleSignIn}
      >
        {loading ? (
          <span className="inline-flex items-center gap-2">
            <svg
              className="h-4 w-4 animate-spin"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
              <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
            </svg>
            Loading...
          </span>
        ) : (
          'Get Started'
        )}
      </button>
    )
  }

  return (
    <button
      type="button"
      disabled={loading}
      className="rounded-xl border border-neutral-300 bg-white px-4 py-2 text-sm font-semibold text-neutral-900 hover:bg-neutral-50 disabled:cursor-not-allowed disabled:opacity-50"
      onClick={handleSignOut}
    >
      {loading ? (
        <span className="inline-flex items-center gap-2">
          <svg
            className="h-4 w-4 animate-spin"
            viewBox="0 0 24 24"
            fill="none"
            stroke="currentColor"
            strokeWidth="2"
          >
            <circle cx="12" cy="12" r="10" stroke="currentColor" strokeOpacity="0.25" />
            <path d="M12 2a10 10 0 0 1 10 10" stroke="currentColor" strokeLinecap="round" />
          </svg>
          Loading...
        </span>
      ) : (
        'Sign out'
      )}
    </button>
  )
}