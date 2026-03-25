import Image from 'next/image'
import { getUserLinksByPublicId } from '@/lib/userLinks'

export const metadata = {
  title: 'Links | WhatVibes',
  description: 'A simple page for all your links.',
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

export default async function PublicLinksPage({
  params,
}: {
  params: Promise<{ id: string }>
}) {
  const { id } = await params
  const profile = await getUserLinksByPublicId(id)

  if (!profile) {
    return (
      <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center justify-center px-4 py-12">
        <div className="rounded-3xl border border-neutral-200 bg-white p-8 text-center shadow-sm">
          <h1 className="text-xl font-bold">Link page not found</h1>
          <p className="mt-2 text-sm text-neutral-600">
            This profile may have been removed or the URL is incorrect.
          </p>
        </div>
      </main>
    )
  }

  const links = profile.links ?? {}

  return (
    <main className="mx-auto flex min-h-screen max-w-xl flex-col items-center gap-6 px-4 py-12">
      {profile.image ? (
        <Image
          src={profile.image}
          alt={profile.name ?? 'Profile'}
          width={96}
          height={96}
          className="size-24 rounded-full"
        />
      ) : (
        <div className="size-24 rounded-full bg-neutral-200" />
      )}

      <div className="text-center">
        <div className="text-2xl font-bold">{profile.name ?? 'Links'}</div>
      </div>

      <div className="w-full space-y-3">
        {links.youtube ? <LinkButton href={links.youtube} label="YouTube" /> : null}
        {links.instagram ? <LinkButton href={links.instagram} label="Instagram" /> : null}
        {links.linkedin ? <LinkButton href={links.linkedin} label="LinkedIn" /> : null}
        {links.facebook ? <LinkButton href={links.facebook} label="Facebook" /> : null}
        {links.x ? <LinkButton href={links.x} label="X" /> : null}
        {(links.other ?? []).map((href) => (
          <LinkButton key={href} href={href} label={href.replace(/^https?:\/\//, '')} />
        ))}
      </div>
    </main>
  )
}

