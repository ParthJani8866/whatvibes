import { NextResponse } from 'next/server'
import { createPendingSubscription } from '@/lib/emailSubscriptions'
import { sendVerificationEmail } from '@/lib/email'

export async function POST(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  const { profileId } = params
  const { email } = await req.json()

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 })
  }

  try {
    const token = await createPendingSubscription(profileId, email)

    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify-subscription?token=${token}`
    await sendVerificationEmail(email, verificationUrl)

    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Subscription error:', error)
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 })
  }
}