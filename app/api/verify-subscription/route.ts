import { NextResponse } from 'next/server'
import { verifySubscription } from '@/lib/emailSubscriptions'
import { incrementProfileSubscribersCount } from '@/lib/userLinks'

export async function GET(req: Request) {
  const { searchParams } = new URL(req.url)
  const token = searchParams.get('token')

  if (!token) {
    return new NextResponse('Invalid token', { status: 400 })
  }

  const result = await verifySubscription(token)

  if (!result.success) {
    return new NextResponse('Invalid or expired token', { status: 400 })
  }

  // Increment the profile's subscriber count
  if (result.profileId) {
    await incrementProfileSubscribersCount(result.profileId)
  }

  return new NextResponse('Email verified successfully! You can close this window.', { status: 200 })
}