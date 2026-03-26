// lib/userLinks.ts
import clientPromise from '@/lib/mongodb'
import { randomBytes } from 'crypto'

export type SocialLinks = {
  youtube?: string
  instagram?: string
  linkedin?: string
  facebook?: string
  x?: string
  pinterest?: string
  shopify?: string
  github?: string
  website?: string
  other?: string[]
}

export type UserLinks = {
  publicId: string
  views: number               // total page views
  clicks: number              // total link clicks
  subscribersCount: number    // number of verified email subscribers
  email: string
  name?: string | null
  image?: string | null
  links: SocialLinks
  banner?: string          // banner image URL
  profilePic?: string      // custom profile picture URL
  bio?: string             // user's bio
  hobbies?: string[]       // list of hobbies
  categories?: string[]    // content categories
  createdAt: Date
  updatedAt: Date
}

const DB_NAME = process.env.MONGODB_DB ?? undefined
const COLLECTION = 'user_links'

export async function isPublicIdAvailable(publicId: string): Promise<boolean> {
  const client = await clientPromise
  const db = DB_NAME ? client.db(DB_NAME) : client.db()
  const existing = await db.collection<UserLinks>(COLLECTION).findOne({ publicId })
  return existing === null
}

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
  pinterest?: string
  shopify?: string
  github?: string
  website?: string
  other?: string
}): SocialLinks {
  const youtubeRaw = input.youtube?.trim() ?? ''
  const instagramRaw = input.instagram?.trim() ?? ''
  const linkedinRaw = input.linkedin?.trim() ?? ''
  const facebookRaw = input.facebook?.trim() ?? ''
  const xRaw = input.x?.trim() ?? ''
  const pinterestRaw = input.pinterest?.trim() ?? ''
  const shopifyRaw = input.shopify?.trim() ?? ''
  const githubRaw = input.github?.trim() ?? ''
  const websiteRaw = input.website?.trim() ?? ''
  const otherRaw = input.other?.trim() ?? ''

  // YouTube
  const youtube =
    asUrlMaybe(youtubeRaw) ??
    (youtubeRaw
      ? `https://www.youtube.com/${youtubeRaw.startsWith('@') ? youtubeRaw : `@${normalizeHandle(youtubeRaw)}`}`
      : undefined)

  // Instagram
  const instagram =
    asUrlMaybe(instagramRaw) ??
    (instagramRaw ? `https://www.instagram.com/${normalizeHandle(instagramRaw)}` : undefined)

  // LinkedIn
  const linkedin =
    asUrlMaybe(linkedinRaw) ??
    (linkedinRaw
      ? linkedinRaw.startsWith('in/') || linkedinRaw.startsWith('company/')
        ? `https://www.linkedin.com/${linkedinRaw}`
        : `https://www.linkedin.com/in/${normalizeHandle(linkedinRaw)}`
      : undefined)

  // Facebook
  const facebook =
    asUrlMaybe(facebookRaw) ??
    (facebookRaw ? `https://www.facebook.com/${normalizeHandle(facebookRaw)}` : undefined)

  // X (Twitter)
  const x = asUrlMaybe(xRaw) ?? (xRaw ? `https://x.com/${normalizeHandle(xRaw)}` : undefined)

  // Pinterest
  const pinterest =
    asUrlMaybe(pinterestRaw) ??
    (pinterestRaw ? `https://www.pinterest.com/${normalizeHandle(pinterestRaw)}` : undefined)

  // Shopify (expects full URL)
  const shopify = asUrlMaybe(shopifyRaw) ?? undefined

  // GitHub
  const github =
    asUrlMaybe(githubRaw) ??
    (githubRaw ? `https://github.com/${normalizeHandle(githubRaw)}` : undefined)

  // Website
  const website = asUrlMaybe(websiteRaw) ?? undefined

  // Other links (line-separated)
  const other = otherRaw ? normalizeOther(otherRaw).map(asUrlMaybe).filter(Boolean) : undefined

  return {
    youtube,
    instagram,
    linkedin,
    facebook,
    x,
    pinterest,
    shopify,
    github,
    website,
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
export async function incrementProfileViews(publicId: string): Promise<void> {
  const client = await clientPromise
  const db = DB_NAME ? client.db(DB_NAME) : client.db()
  await db.collection<UserLinks>(COLLECTION).updateOne(
    { publicId },
    { $inc: { views: 1 } }
  )
}

export async function incrementLinkClicks(publicId: string, linkKey: string): Promise<void> {
  const client = await clientPromise
  const db = DB_NAME ? client.db(DB_NAME) : client.db()
  // Increment total clicks
  await db.collection<UserLinks>(COLLECTION).updateOne(
    { publicId },
    { $inc: { clicks: 1 } }
  )
  // Optionally track per‑link clicks in a subdocument
  // await db.collection<UserLinks>(COLLECTION).updateOne(
  //   { publicId },
  //   { $inc: { [`linkClicks.${linkKey}`]: 1 } }
  // )
}

export async function incrementProfileSubscribersCount(publicId: string): Promise<void> {
  const client = await clientPromise
  const db = DB_NAME ? client.db(DB_NAME) : client.db()
  await db.collection<UserLinks>(COLLECTION).updateOne(
    { publicId },
    { $inc: { subscribersCount: 1 } }
  )
}
export async function upsertUserLinksByEmail(args: {
  email: string
  name?: string | null
  image?: string | null
  links: SocialLinks
  banner?: string
  profilePic?: string
  bio?: string
  hobbies?: string[]
  categories?: string[]
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
        banner: args.banner ?? '',
        profilePic: args.profilePic ?? '',
        bio: args.bio ?? '',
        hobbies: args.hobbies ?? [],
        categories: args.categories ?? [],
        updatedAt: now,
      },
      $setOnInsert: {
        createdAt: now,
      },
    },
    { upsert: true },
  )
}