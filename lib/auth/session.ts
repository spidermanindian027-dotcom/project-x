import crypto from 'crypto';
import { cookies } from 'next/headers';
import prisma from '@/lib/db/prisma';
import type { User, Session, Role } from '@prisma/client';

export const SESSION_COOKIE_NAME = 'vestra_session';
export const SESSION_DURATION_DAYS = 7;
export const SESSION_DURATION_MS = SESSION_DURATION_DAYS * 24 * 60 * 60 * 1000;

export interface SafeUser {
  id: string;
  email: string;
  fullName: string;
  role: Role;
  createdAt: Date;
  updatedAt: Date;
}

export function sanitizeUser(user: User): SafeUser {
  return {
    id: user.id,
    email: user.email,
    fullName: user.fullName,
    role: user.role,
    createdAt: user.createdAt,
    updatedAt: user.updatedAt,
  };
}

/**
 * Generates a cryptographically strong 256-bit random session token.
 */
export function generateSessionToken(): string {
  return crypto.randomBytes(32).toString('hex');
}

/**
 * Creates a new database-backed session for a user.
 */
export async function createSession(
  userId: string,
  metadata?: { ipAddress?: string; userAgent?: string }
): Promise<Session> {
  const token = generateSessionToken();
  const expiresAt = new Date(Date.now() + SESSION_DURATION_MS);

  return prisma.session.create({
    data: {
      token,
      userId,
      expiresAt,
      ipAddress: metadata?.ipAddress,
      userAgent: metadata?.userAgent,
    },
  });
}

/**
 * Validates a session token against the database.
 * Returns null if token does not exist or has expired.
 * Cleans up expired sessions lazily.
 */
export async function validateSessionToken(
  token: string
): Promise<{ user: SafeUser; session: Session } | null> {
  if (!token || typeof token !== 'string') {
    return null;
  }

  const session = await prisma.session.findUnique({
    where: { token },
    include: { user: true },
  });

  if (!session) {
    return null;
  }

  // Check expiration
  if (Date.now() >= session.expiresAt.getTime()) {
    // Delete expired session
    await prisma.session.delete({ where: { id: session.id } }).catch(() => {});
    return null;
  }

  return {
    user: sanitizeUser(session.user),
    session,
  };
}

/**
 * Invalidates a specific session by token.
 */
export async function invalidateSession(token: string): Promise<void> {
  if (!token) return;
  await prisma.session.deleteMany({
    where: { token },
  });
}

/**
 * Invalidates all sessions for a specific user (e.g. password change).
 */
export async function invalidateAllUserSessions(userId: string): Promise<void> {
  await prisma.session.deleteMany({
    where: { userId },
  });
}

/**
 * Sets the secure HTTP-only session cookie in the Next.js response.
 */
export async function setSessionCookie(
  token: string,
  expiresAt: Date
): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    expires: expiresAt,
  });
}

/**
 * Clears the session cookie.
 */
export async function clearSessionCookie(): Promise<void> {
  const cookieStore = await cookies();
  cookieStore.set(SESSION_COOKIE_NAME, '', {
    httpOnly: true,
    secure: process.env.NODE_ENV === 'production',
    sameSite: 'lax',
    path: '/',
    maxAge: 0,
    expires: new Date(0),
  });
}

/**
 * Retrieves and validates the current user from the incoming request cookies.
 * Compatible with Next.js 16 async Request APIs.
 */
export async function getCurrentUser(): Promise<SafeUser | null> {
  try {
    const cookieStore = await cookies();
    const token = cookieStore.get(SESSION_COOKIE_NAME)?.value;
    if (!token) {
      return null;
    }

    const result = await validateSessionToken(token);
    return result ? result.user : null;
  } catch {
    return null;
  }
}
