import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const host = request.headers.get('host');

  if (host === 'www.bioforig.com') {
    return NextResponse.redirect(
      `https://bioforig.com${request.nextUrl.pathname}`,
      301
    );
  }

  return NextResponse.next();
}