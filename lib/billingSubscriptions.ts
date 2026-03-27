import clientPromise from '@/lib/mongodb'

export type PlanKey = 'basic' | 'pro'

export type BillingSubscriptionStatus =
  | 'created'
  | 'authenticated'
  | 'active'
  | 'cancelled'
  | 'failed'
  | 'completed'

export type BillingSubscription = {
  _id?: unknown
  email: string
  name: string | null
  image: string | null
  planKey: PlanKey
  razorpayPlanId: string
  razorpaySubscriptionId: string
  status: BillingSubscriptionStatus
  razorpayPaymentId: string | null
  lastEvent: string | null
  createdAt: Date
  updatedAt: Date
}

const DB_NAME = process.env.MONGODB_DB ?? undefined
const COLLECTION = 'billing_subscriptions'

function getDb(client: Awaited<typeof clientPromise>) {
  return DB_NAME ? client.db(DB_NAME) : client.db()
}

export async function getLatestBillingSubscriptionByEmail(email: string) {
  const client = await clientPromise
  const db = getDb(client)

  return await db
    .collection<BillingSubscription>(COLLECTION)
    .find({ email })
    .sort({ updatedAt: -1, createdAt: -1 })
    .limit(1)
    .next()
}

export async function getActiveBillingSubscriptionByEmail(email: string) {
  const client = await clientPromise
  const db = getDb(client)
  return await db.collection<BillingSubscription>(COLLECTION).findOne({
    email,
    status: { $in: ['created', 'authenticated', 'active'] },
  })
}

export async function createBillingSubscription(input: {
  email: string
  name: string | null
  image: string | null
  planKey: PlanKey
  razorpayPlanId: string
  razorpaySubscriptionId: string
  status?: BillingSubscriptionStatus
}) {
  const client = await clientPromise
  const db = getDb(client)

  const now = new Date()
  const doc: BillingSubscription = {
    email: input.email,
    name: input.name ?? null,
    image: input.image ?? null,
    planKey: input.planKey,
    razorpayPlanId: input.razorpayPlanId,
    razorpaySubscriptionId: input.razorpaySubscriptionId,
    status: input.status ?? 'created',
    razorpayPaymentId: null,
    lastEvent: null,
    createdAt: now,
    updatedAt: now,
  }

  await db.collection<BillingSubscription>(COLLECTION).insertOne(doc)
  return doc
}

export async function markBillingSubscriptionAuthenticated(input: {
  email: string
  razorpaySubscriptionId: string
  razorpayPaymentId: string
}) {
  const client = await clientPromise
  const db = getDb(client)

  const res = await db
    .collection<BillingSubscription>(COLLECTION)
    .findOneAndUpdate(
      { email: input.email, razorpaySubscriptionId: input.razorpaySubscriptionId },
      {
        $set: {
          status: 'authenticated',
          razorpayPaymentId: input.razorpayPaymentId,
          updatedAt: new Date(),
        },
      },
      { returnDocument: 'after' },
    )
  return res.value
}

export async function updateBillingSubscriptionFromWebhook(input: {
  razorpaySubscriptionId: string
  status?: BillingSubscriptionStatus
  event: string
}) {
  const client = await clientPromise
  const db = getDb(client)

  const update: Partial<BillingSubscription> = {
    lastEvent: input.event,
    updatedAt: new Date(),
  }
  if (input.status) update.status = input.status

  const res = await db
    .collection<BillingSubscription>(COLLECTION)
    .findOneAndUpdate(
      { razorpaySubscriptionId: input.razorpaySubscriptionId },
      { $set: update },
      { returnDocument: 'after' },
    )
  return res.value
}

