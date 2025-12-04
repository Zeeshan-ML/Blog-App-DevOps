import { NextResponse } from 'next/server';
import { clearUserSession } from '@/lib/auth';

export async function POST(request: Request) {
  try {
    await clearUserSession();

    // Get the origin from the request to work on any domain
    const origin = new URL(request.url).origin;
    return NextResponse.redirect(new URL('/', origin));
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET(request: Request) {
  return POST(request);
}
