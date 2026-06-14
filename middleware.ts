import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(req: NextRequest) {
  const { pathname } = req.nextUrl;

  // Always allow internals and public assets
  if (
    pathname.startsWith('/_next') ||
    pathname.startsWith('/static') ||
    pathname.startsWith('/public') ||
    pathname === '/favicon.ico'
  ) {
    return NextResponse.next();
  }

  // Protect only dashboard and admin API routes
  const protectDashboard = pathname === '/Dash' || pathname.startsWith('/Dash/');
  const protectAdminApi = pathname.startsWith('/api/admin') && !pathname.startsWith('/api/admin/login');

  if (!protectDashboard && !protectAdminApi) {
    return NextResponse.next();
  }

  const hasAuth = req.cookies.get('site-auth');
  if (!hasAuth) {
    const url = req.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('next', pathname);
    return NextResponse.redirect(url);
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/Dash/:path*', '/api/admin/:path*'],
};
