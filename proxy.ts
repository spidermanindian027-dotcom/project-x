import { NextResponse } from 'next/server';

/**
 * Next.js 16 Route Guard
 * All studio, wardrobe, scanner, and styling features are directly accessible without requiring login.
 * The administrator governance console (/admin) is secured by the Administrator Password Gate.
 */
export function proxy() {
  return NextResponse.next();
}

export const config = {
  matcher: [
    '/((?!api|_next/static|_next/image|favicon.ico).*)',
  ],
};
