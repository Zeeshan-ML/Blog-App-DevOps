import { NextResponse } from 'next/server';
import { clearUserSession } from '@/lib/auth';

export async function POST() {
  try {
    await clearUserSession();

    return NextResponse.redirect(new URL('/', process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'));
  } catch (error) {
    console.error('Logout error:', error);
    return NextResponse.json(
      { error: 'Internal server error' },
      { status: 500 }
    );
  }
}

export async function GET() {
  return POST();
}
