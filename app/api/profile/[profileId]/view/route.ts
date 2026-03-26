import { NextResponse } from 'next/server'
import { incrementProfileViews } from '@/lib/userLinks'

export async function POST(
  req: Request,
  { params }: { params: { profileId: string } }
) {
  const { profileId } = params

  try {
    await incrementProfileViews(profileId)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('View tracking error:', error)
    return NextResponse.json({ error: 'Failed to track view' }, { status: 500 })
  }
}