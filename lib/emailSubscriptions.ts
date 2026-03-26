import clientPromise from '@/lib/mongodb'
import crypto from 'crypto'

export type EmailSubscription = {
  _id?: any
  profileId: string        // corresponds to UserLinks.publicId
  email: string
  verified: boolean
  token: string            // verification token
  expiresAt: Date
  createdAt: Date
}

const DB_NAME = process.env.MONGODB_DB ?? undefined
const COLLECTION = 'email_subscriptions'

export async function createPendingSubscription(profileId: string, email: string): Promise<string> {
  const client = await clientPromise
  const db = DB_NAME ? client.db(DB_NAME) : client.db()
  const token = crypto.randomBytes(32).toString('hex')
  const expiresAt = new Date(Date.now() + 24 * 60 * 60 * 1000) // 24h

  // Upsert: if already exists, reset token and verified = false
  await db.collection<EmailSubscription>(COLLECTION).updateOne(
    { profileId, email },
    {
      $set: {
        token,
        expiresAt,
        verified: false,
        createdAt: new Date(),
      },
      $setOnInsert: {
        profileId,
        email,
      },
    },
    { upsert: true }
  )
  return token
}

export async function verifySubscription(token: string): Promise<{ success: boolean; profileId?: string }> {
  const client = await clientPromise
  const db = DB_NAME ? client.db(DB_NAME) : client.db()
  const sub = await db.collection<EmailSubscription>(COLLECTION).findOne({ token })

  if (!sub || sub.expiresAt < new Date()) {
    return { success: false }
  }

  await db.collection<EmailSubscription>(COLLECTION).updateOne(
    { _id: sub._id },
    { $set: { verified: true, token: null, expiresAt: null } }
  )

  return { success: true, profileId: sub.profileId }
}