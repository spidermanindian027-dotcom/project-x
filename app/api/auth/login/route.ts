import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { loginSchema } from '@/lib/validations/auth.schema';
import { verifyPassword } from '@/lib/auth/password';
import { createSession, setSessionCookie, sanitizeUser } from '@/lib/auth/session';

// Constant dummy hash to mitigate user enumeration timing attacks
const DUMMY_HASH = '$2a$12$LJXk3c28Vn1WwYfF8Q98E.3Fm4b88Qy7rZ08L7V89012345678901';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => null);
    if (!json) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const validation = loginSchema.safeParse(json);
    if (!validation.success) {
      return NextResponse.json(
        {
          success: false,
          error: 'Validation failed.',
          details: validation.error.flatten().fieldErrors,
        },
        { status: 400 }
      );
    }

    const { email, password } = validation.data;

    const user = await prisma.user.findUnique({
      where: { email },
    });

    if (!user) {
      // Execute constant-time dummy verification
      await verifyPassword(password, DUMMY_HASH);
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    const isValidPassword = await verifyPassword(password, user.passwordHash);
    if (!isValidPassword) {
      return NextResponse.json(
        { success: false, error: 'Invalid email or password.' },
        { status: 401 }
      );
    }

    // Capture request metadata
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    // Create session and issue secure cookie
    const session = await createSession(user.id, { ipAddress, userAgent });
    await setSessionCookie(session.token, session.expiresAt);

    return NextResponse.json(
      {
        success: true,
        user: sanitizeUser(user),
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Login API error:', error);
    const errString = String(error);
    const isDbError =
      errString.includes("Can't reach database server") ||
      errString.includes('P1001') ||
      errString.includes('P1012') ||
      errString.includes('connect ECONNREFUSED') ||
      !process.env.DATABASE_URL ||
      (process.env.NODE_ENV === 'production' && process.env.DATABASE_URL.includes('localhost'));

    const errorMsg = isDbError
      ? 'Database connection unavailable. In cloud deployments (e.g. Vercel), configure a cloud PostgreSQL DATABASE_URL in environment variables.'
      : 'An unexpected error occurred during login.';

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
