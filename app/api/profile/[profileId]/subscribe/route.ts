import { NextResponse } from 'next/server';
import { createPendingSubscription } from '@/lib/emailSubscriptions';
import { sendVerificationEmail } from '@/lib/email';

export async function POST(
  req: Request,
  { params }: { params: Promise<{ profileId: string }> }  // note: params is a Promise
) {
    console.log('🚀 API route hit');   // <-- Add this

  // Await the params before using them
  const { profileId } = await params;
  const { email } = await req.json();

  if (!email || !email.includes('@')) {
    return NextResponse.json({ error: 'Invalid email' }, { status: 400 });
  }

  try {
    console.log('dsdsjfjfl;kdsj');

    const token = await createPendingSubscription(profileId, email);
    console.log(token);
    const verificationUrl = `${process.env.NEXT_PUBLIC_SITE_URL}/api/verify-subscription?token=${token}`;
    console.log('Created subscription token:', token);

    await sendVerificationEmail(email, verificationUrl);
    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('Subscription error:', error);
    return NextResponse.json({ error: 'Failed to subscribe' }, { status: 500 });
  }
}