import clientPromise from '@/lib/mongodb'
import { randomBytes } from 'crypto'

export type SocialLinks = {
  youtube?: string
  instagram?: string
  linkedin?: string
  facebook?: string
  x?: string
  other?: string[]
}

export type UserLinks = {
  publicId: string
  email: string
  name?: string | null
  image?: string | null
  links: SocialLinks
  createdAt: Date
  updatedAt: Date
}

const DB_NAME = process.env.MONGODB_DB ?? undefined
const COLLECTION = 'user_links'

function normalizeOther(raw: string): string[] {
  return raw
    .split(/\r?\n/g)
    .map((v) => v.trim())
    .filter(Boolean)
}

function asUrlMaybe(value: string): string | null {
  const trimmed = value.trim()
  if (!trimmed) return null

  try {
    const url = new URL(trimmed)
    if (url.protocol !== 'http:' && url.protocol !== 'https:') return null
    return url.toString()
  } catch {
    // fall through
  }

  if (/^www\./i.test(trimmed) || /[.]/.test(trimmed)) {
    try {
      const url = new URL(`https://${trimmed}`)
      return url.toString()
    } catch {
      return null
    }
  }

  return null
}

function normalizeHandle(value: string) {
  return value.trim().replace(/^@/, '')
}

export function normalizeLinks(input: {
  youtube?: string
  instagram?: string
  linkedin?: string
  facebook?: string
  x?: string
  other?: string
}): SocialLinks {
  const youtubeRaw = input.youtube?.trim() ?? ''
  const instagramRaw = input.instagram?.trim() ?? ''
  const linkedinRaw = input.linkedin?.trim() ?? ''
  const facebookRaw = input.facebook?.trim() ?? ''
  const xRaw = input.x?.trim() ?? ''
  const otherRaw = input.other?.trim() ?? ''

  const youtube =
    asUrlMaybe(youtubeRaw) ??
    (youtubeRaw
      ? `https://www.youtube.com/${youtubeRaw.startsWith('@') ? youtubeRaw : `@${normalizeHandle(youtubeRaw)}`}`
      : undefined)

  const instagram =
    asUrlMaybe(instagramRaw) ??
    (instagramRaw ? `https://www.instagram.com/${normalizeHandle(instagramRaw)}` : undefined)

  const linkedin =
    asUrlMaybe(linkedinRaw) ??
    (linkedinRaw
      ? linkedinRaw.startsWith('in/') || linkedinRaw.startsWith('company/')
        ? `https://www.linkedin.com/${linkedinRaw}`
        : `https://www.linkedin.com/in/${normalizeHandle(linkedinRaw)}`
      : undefined)

  const facebook =
    asUrlMaybe(facebookRaw) ??
    (facebookRaw ? `https://www.facebook.com/${normalizeHandle(facebookRaw)}` : undefined)

  const x =
    asUrlMaybe(xRaw) ?? (xRaw ? `https://x.com/${normalizeHandle(xRaw)}` : undefined)

  const other = otherRaw ? normalizeOther(otherRaw).map(asUrlMaybe).filter(Boolean) : undefined

  return {
    youtube,
    instagram,
    linkedin,
    facebook,
    x,
    other: other && other.length ? (other as string[]) : undefined,
  }
}

export async function getUserLinksByEmail(email: string): Promise<UserLinks | null> {
  const client = await clientPromise
  const db = DB_NAME ? client.db(DB_NAME) : client.db()
  const doc = await db.collection<UserLinks>(COLLECTION).findOne({ email })
  return doc ?? null
}

export async function getUserLinksByPublicId(publicId: string): Promise<UserLinks | null> {
  const client = await clientPromise
  const db = DB_NAME ? client.db(DB_NAME) : client.db()
  const doc = await db.collection<UserLinks>(COLLECTION).findOne({ publicId })
  return doc ?? null
}

export async function upsertUserLinksByEmail(args: {
  email: string
  name?: string | null
  image?: string | null
  links: SocialLinks
}) {
  const client = await clientPromise
  const db = DB_NAME ? client.db(DB_NAME) : client.db()

  const now = new Date()
  const existing = await db
    .collection<Pick<UserLinks, 'publicId'>>(COLLECTION)
    .findOne({ email: args.email }, { projection: { publicId: 1 } })

  const publicId = existing?.publicId ?? randomBytes(12).toString('base64url')

  await db.collection<UserLinks>(COLLECTION).updateOne(
    { email: args.email },
    {
      $set: {
        publicId,
        email: args.email,
        name: args.name ?? null,
        image: args.image ?? null,
        links: args.links,
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  )
}
