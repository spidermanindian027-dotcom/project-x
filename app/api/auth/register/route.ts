import { NextRequest, NextResponse } from 'next/server';
import prisma from '@/lib/db/prisma';
import { registerSchema } from '@/lib/validations/auth.schema';
import { hashPassword } from '@/lib/auth/password';
import { createSession, setSessionCookie, sanitizeUser } from '@/lib/auth/session';
import { Role } from '@prisma/client';

export async function POST(request: NextRequest) {
  try {
    const json = await request.json().catch(() => null);
    if (!json) {
      return NextResponse.json(
        { success: false, error: 'Invalid JSON request body.' },
        { status: 400 }
      );
    }

    const validation = registerSchema.safeParse(json);
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

    const { fullName, email, password } = validation.data;

    // Check for existing user with this email
    const existing = await prisma.user.findUnique({
      where: { email },
    });

    if (existing) {
      return NextResponse.json(
        {
          success: false,
          error: 'An account with this email address already exists.',
        },
        { status: 409 }
      );
    }

    // Secure password hashing
    const passwordHash = await hashPassword(password);

    // Enforce default USER role - never allow client-side role escalation
    const newUser = await prisma.user.create({
      data: {
        fullName,
        email,
        passwordHash,
        role: Role.USER,
      },
    });

    // Capture request metadata
    const ipAddress =
      request.headers.get('x-forwarded-for')?.split(',')[0].trim() ||
      request.headers.get('x-real-ip') ||
      undefined;
    const userAgent = request.headers.get('user-agent') || undefined;

    // Create session and set HTTP-only cookie
    const session = await createSession(newUser.id, { ipAddress, userAgent });
    await setSessionCookie(session.token, session.expiresAt);

    return NextResponse.json(
      {
        success: true,
        user: sanitizeUser(newUser),
      },
      { status: 201 }
    );
  } catch (error) {
    console.error('Registration API error:', error);
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
      : 'An unexpected error occurred during registration.';

    return NextResponse.json(
      {
        success: false,
        error: errorMsg,
      },
      { status: 500 }
    );
  }
}
