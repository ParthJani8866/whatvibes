'use client';

import { useState } from 'react';

interface SubscriptionButtonProps {
  profileId: string;
  profileName?: string | null;
}

export default function SubscriptionButton({ profileId, profileName }: SubscriptionButtonProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email) return;

    setStatus('loading');
    setErrorMsg('');

    try {
      const res = await fetch(`/api/profile/${profileId}/subscribe`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });
      console.log(res);

      if (!res.ok) {
        const data = await res.json();
        throw new Error(data.error || 'Something went wrong');
      }

      setStatus('success');
      setEmail('');
      setTimeout(() => setIsOpen(false), 3000);
    } catch (err: any) {
      setStatus('error');
      setErrorMsg(err.message);
    }
  };

  return (
    <>
      <button
        onClick={() => setIsOpen(true)}
        className="fixed bottom-6 right-6 z-50 flex h-12 w-12 items-center justify-center rounded-full bg-gradient-to-r from-indigo-500 to-pink-500 shadow-lg hover:scale-105 transition-transform duration-200 focus:outline-none"
        aria-label="Subscribe to updates"
      >
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 text-white" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 8l7.89 5.26a2 2 0 002.22 0L21 8M5 19h14a2 2 0 002-2V7a2 2 0 00-2-2H5a2 2 0 00-2 2v10a2 2 0 002 2z" />
        </svg>
      </button>

      {isOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4" onClick={() => setIsOpen(false)}>
          <div
            className="relative w-full max-w-md rounded-2xl bg-[#0a0e1a] border border-white/10 shadow-2xl p-6"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={() => setIsOpen(false)}
              className="absolute right-4 top-4 text-white/40 hover:text-white/80 transition"
            >
              ✕
            </button>

            <h3 className="text-xl font-bold text-white mb-2">
              Subscribe to {profileName ? `${profileName}'s` : 'updates'}
            </h3>
            <p className="text-white/50 text-sm mb-6">
              Get notified when new links are added or important updates happen.
            </p>

            {status === 'success' ? (
              <div className="text-center py-4">
                <div className="text-green-400 text-4xl mb-2">✓</div>
                <p className="text-white font-medium">Check your inbox!</p>
                <p className="text-white/50 text-sm mt-1">
                  We've sent a verification link to your email.
                </p>
              </div>
            ) : (
              <form onSubmit={handleSubmit} className="space-y-4">
                <div>
                  <label htmlFor="email" className="block text-sm font-medium text-white/70 mb-1">
                    Email address
                  </label>
                  <input
                    type="email"
                    id="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="w-full rounded-xl bg-white/5 border border-white/10 px-4 py-2 text-white placeholder-white/30 focus:outline-none focus:ring-2 focus:ring-indigo-500/50"
                    placeholder="you@example.com"
                    disabled={status === 'loading'}
                  />
                </div>

                {status === 'error' && (
                  <div className="text-sm text-red-400 bg-red-500/10 rounded-lg p-2 text-center">
                    {errorMsg}
                  </div>
                )}

                <button
                  type="submit"
                  disabled={status === 'loading'}
                  className="w-full rounded-xl bg-gradient-to-r from-indigo-600 to-pink-600 py-3 font-semibold text-white shadow-lg hover:shadow-indigo-500/30 transition disabled:opacity-50"
                >
                  {status === 'loading' ? 'Sending...' : 'Subscribe'}
                </button>
              </form>
            )}
          </div>
        </div>
      )}
    </>
  );
}