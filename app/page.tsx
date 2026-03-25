import { revalidatePath } from 'next/cache'
import Image from 'next/image'
import Link from 'next/link'
import AuthButtons from '@/app/components/AuthButtons'
import { getAuthSession } from '@/lib/auth'
import {
  getUserLinksByEmail,
  normalizeLinks,
  upsertUserLinksByEmail,
} from '@/lib/userLinks'

export const metadata = {
  title: 'Your Links | WhatVibes',
  description: 'Sign in with Google and share your social links.',
}

function LinkButton(props: { href: string; label: string }) {
  return (
    <a
      href={props.href}
      target="_blank"
      rel="noreferrer"
      className="flex w-full items-center justify-center rounded-xl border border-neutral-200 bg-white px-4 py-3 text-sm font-semibold text-neutral-900 shadow-sm hover:bg-neutral-50"
    >
      {props.label}
    </a>
  )
}

export default async function Page() {
  const session = await getAuthSession()
  const email = session?.user?.email ?? null

  const profile = email ? await getUserLinksByEmail(email) : null
  const links = profile?.links ?? {}

  async function saveLinks(formData: FormData) {
    'use server'
    const session = await getAuthSession()
    const email = session?.user?.email
    if (!email) throw new Error('Unauthorized')

    const nextLinks = normalizeLinks({
      youtube: String(formData.get('youtube') ?? ''),
      instagram: String(formData.get('instagram') ?? ''),
      linkedin: String(formData.get('linkedin') ?? ''),
      facebook: String(formData.get('facebook') ?? ''),
      x: String(formData.get('x') ?? ''),
      other: String(formData.get('other') ?? ''),
    })

    await upsertUserLinksByEmail({
      email,
      name: session.user?.name ?? null,
      image: session.user?.image ?? null,
      links: nextLinks,
    })

    revalidatePath('/')
  }

  return (
    <main className="mx-auto flex min-h-[calc(100vh-2rem)] w-full max-w-5xl flex-col gap-8 px-4 py-10">
      <header className="flex items-center justify-between gap-4">
        <div className="flex items-center gap-3">
          <div className="grid size-12 place-items-center rounded-2xl bg-black text-white">
            WV
          </div>
          <div>
            <h1 className="text-xl font-bold">Your Link Page</h1>
            <p className="text-sm text-neutral-600">
              Add your social links and share them anywhere.
            </p>
          </div>
        </div>
        <AuthButtons signedIn={Boolean(email)} />
      </header>

      {!email ? (
        <section className="grid gap-6 rounded-3xl border border-neutral-200 bg-white p-8 shadow-sm">
          <div className="max-w-xl">
            <h2 className="text-3xl font-bold tracking-tight">
              One page for all your links
            </h2>
            <p className="mt-2 text-neutral-600">
              Sign in with Google to create your own Linktree-style profile.
            </p>
          </div>
          <div>
            <AuthButtons signedIn={false} />
          </div>
          <div className="text-sm text-neutral-600">
            The previous home page is still available at{' '}
            <Link className="font-semibold underline" href="/transform">
              /transform
            </Link>
            .
          </div>
        </section>
      ) : (
        <div className="grid gap-8 lg:grid-cols-2">
          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <div className="flex items-center justify-between">
              <h2 className="text-lg font-bold">Edit links</h2>
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'Profile'}
                  width={40}
                  height={40}
                  className="size-10 rounded-full"
                />
              ) : null}
            </div>
            {profile?.publicId ? (
              <div className="mt-3 rounded-2xl border border-neutral-200 bg-neutral-50 px-4 py-3 text-sm text-neutral-700">
                Your public page:{' '}
                <Link className="font-semibold underline" href={`/u/${profile.publicId}`}>
                  /u/{profile.publicId}
                </Link>
              </div>
            ) : null}
            <form action={saveLinks} className="mt-4 grid gap-4">
              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="youtube">
                  YouTube
                </label>
                <input
                  id="youtube"
                  name="youtube"
                  placeholder="https://youtube.com/@yourchannel or @yourchannel"
                  defaultValue={links.youtube ?? ''}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="instagram">
                  Instagram
                </label>
                <input
                  id="instagram"
                  name="instagram"
                  placeholder="https://instagram.com/yourname or @yourname"
                  defaultValue={links.instagram ?? ''}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="linkedin">
                  LinkedIn
                </label>
                <input
                  id="linkedin"
                  name="linkedin"
                  placeholder="https://linkedin.com/in/you or you"
                  defaultValue={links.linkedin ?? ''}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="facebook">
                  Facebook
                </label>
                <input
                  id="facebook"
                  name="facebook"
                  placeholder="https://facebook.com/you or you"
                  defaultValue={links.facebook ?? ''}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="x">
                  X (Twitter)
                </label>
                <input
                  id="x"
                  name="x"
                  placeholder="https://x.com/you or @you"
                  defaultValue={links.x ?? ''}
                  className="w-full rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <div className="grid gap-2">
                <label className="text-sm font-semibold" htmlFor="other">
                  Other links (one per line)
                </label>
                <textarea
                  id="other"
                  name="other"
                  rows={4}
                  placeholder={'https://your.site\nhttps://another.link'}
                  defaultValue={(links.other ?? []).join('\n')}
                  className="w-full resize-none rounded-xl border border-neutral-200 bg-white px-3 py-2 text-sm outline-none focus:border-black"
                />
              </div>

              <button
                type="submit"
                className="mt-2 rounded-xl bg-black px-5 py-3 text-sm font-semibold text-white hover:bg-black/90"
              >
                Save links
              </button>
            </form>
          </section>

          <section className="rounded-3xl border border-neutral-200 bg-white p-6 shadow-sm">
            <h2 className="text-lg font-bold">Preview</h2>
            <div className="mt-4 flex flex-col items-center gap-4">
              {session?.user?.image ? (
                <Image
                  src={session.user.image}
                  alt={session.user.name ?? 'Profile'}
                  width={80}
                  height={80}
                  className="size-20 rounded-full"
                />
              ) : (
                <div className="size-20 rounded-full bg-neutral-200" />
              )}
              <div className="text-center">
                <div className="text-lg font-bold">
                  {session?.user?.name ?? 'You'}
                </div>
                <div className="text-sm text-neutral-600">{email}</div>
              </div>

              <div className="w-full max-w-sm space-y-3">
                {links.youtube ? <LinkButton href={links.youtube} label="YouTube" /> : null}
                {links.instagram ? (
                  <LinkButton href={links.instagram} label="Instagram" />
                ) : null}
                {links.linkedin ? <LinkButton href={links.linkedin} label="LinkedIn" /> : null}
                {links.facebook ? <LinkButton href={links.facebook} label="Facebook" /> : null}
                {links.x ? <LinkButton href={links.x} label="X" /> : null}
                {(links.other ?? []).map((href) => (
                  <LinkButton
                    key={href}
                    href={href}
                    label={href.replace(/^https?:\/\//, '')}
                  />
                ))}
                {!links.youtube &&
                !links.instagram &&
                !links.linkedin &&
                !links.facebook &&
                !links.x &&
                !(links.other?.length ?? 0) ? (
                  <div className="rounded-xl border border-dashed border-neutral-300 p-4 text-center text-sm text-neutral-600">
                    Add links on the left to see your page.
                  </div>
                ) : null}
              </div>
            </div>
          </section>
        </div>
      )}
    </main>
  )
}
