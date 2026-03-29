import Link from 'next/link'
import type { ReactNode } from 'react'

import { Footer } from '@/app/components/Footer'

type InfoPageLayoutProps = {
  title: string
  description: string
  children: ReactNode
}

export default function InfoPageLayout({
  title,
  description,
  children,
}: InfoPageLayoutProps) {
  return (
    <main className="min-h-screen bg-gradient-to-br from-white via-neutral-50 to-neutral-100">
      <div className="mx-auto max-w-4xl px-4 py-10 sm:px-6">
        <header className="mb-10 flex flex-col gap-6 rounded-3xl border border-neutral-200 bg-white/85 p-8 shadow-lg backdrop-blur-sm">
          <div className="flex items-center justify-between gap-4">
            <Link href="/" className="flex items-center gap-3">
              <div className="grid size-12 place-items-center rounded-2xl bg-gradient-to-br from-black to-neutral-800 text-white shadow-md">
                WV
              </div>
              <div>
                <p className="text-2xl font-extrabold tracking-tight text-neutral-950">
                  Bio For IG
                </p>
                <p className="text-sm text-neutral-600">
                  Your all-in-one link-in-bio page
                </p>
              </div>
            </Link>

            <Link
              href="/"
              className="rounded-full border border-neutral-300 px-4 py-2 text-sm font-medium text-neutral-700 transition-colors hover:bg-neutral-100 hover:text-neutral-950"
            >
              Back to home
            </Link>
          </div>

          <div className="max-w-3xl">
            <h1 className="text-4xl font-extrabold tracking-tight text-neutral-950 sm:text-5xl">
              {title}
            </h1>
            <p className="mt-4 text-base leading-7 text-neutral-600 sm:text-lg">
              {description}
            </p>
          </div>
        </header>

        <section className="rounded-3xl border border-neutral-200 bg-white/90 p-8 shadow-sm sm:p-10">
          <div className="space-y-8 text-sm leading-7 text-neutral-700 sm:text-base">
            {children}
          </div>
        </section>

        <Footer />
      </div>
    </main>
  )
}
