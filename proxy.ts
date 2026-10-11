import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/onboarding',
  '/profile',
  '/scan',
  '/wardrobe',
  '/outfits',
  '/chat',
  '/analytics',
  '/styling',
  '/try-on',
  '/admin',
];
const AUTH_PREFIXES = ['/login', '/register'];
const SESSION_COOKIE_NAME = 'vestra_session';

export function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl;
  const sessionToken = request.cookies.get(SESSION_COOKIE_NAME)?.value;

  // 1. Guard protected app and admin routes
  const isProtected = PROTECTED_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isProtected && !sessionToken) {
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('from', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // 2. Redirect already authenticated users away from login/register
  const isAuthRoute = AUTH_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  );

  if (isAuthRoute && sessionToken) {
    const dashboardUrl = new URL('/dashboard', request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  return NextResponse.next();
}

export const config = {
  matcher: [
    '/dashboard/:path*',
    '/onboarding/:path*',
    '/profile/:path*',
    '/scan/:path*',
    '/wardrobe/:path*',
    '/outfits/:path*',
    '/chat/:path*',
    '/analytics/:path*',
    '/styling/:path*',
    '/try-on/:path*',
    '/admin/:path*',
    '/login',
    '/register',
  ],
};
