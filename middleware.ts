import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Allow public assets, Next internals, API login endpoint
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/api/admin/login') ||
    pathname === '/login' ||
    pathname.startsWith('/api') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public')
  ) {
    return NextResponse.next();
  }

  const hasAuth = req.cookies.get('site-auth');
  if (!hasAuth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: '/((?!api|_next|static|favicon.ico).*)',
};
