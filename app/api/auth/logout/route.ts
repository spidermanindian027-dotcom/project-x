import { NextResponse } from 'next/server';
import { cookies } from 'next/headers';
import {
  SESSION_COOKIE_NAME,
  invalidateSession,
  clearSessionCookie,
} from '@/lib/auth/session';

export async function POST() {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;

    if (token) {
      await invalidateSession(token);
    }

    await clearSessionCookie();

    return NextResponse.json({ success: true }, { status: 200 });
  } catch (error) {
    console.error('Logout API error:', error);
    return NextResponse.json(
      { success: false, error: 'An unexpected error occurred during logout.' },
      { status: 500 }
    );
  }
}
