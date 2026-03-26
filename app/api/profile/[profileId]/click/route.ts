import { NextResponse } from 'next/server'
import { incrementLinkClicks } from '@/lib/userLinks'

export async function POST(
  req: Request,
  { params }: { params: Promise<{ profileId: string }> }  // note: params is a Promise
) {
  const { profileId } = await params
  const { link } = await req.json()

  try {
    await incrementLinkClicks(profileId, link)
    return NextResponse.json({ success: true })
  } catch (error) {
    console.error('Click tracking error:', error)
    return NextResponse.json({ error: 'Failed to track click' }, { status: 500 })
  }
}