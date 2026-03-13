import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;
  
  // Check for auth - accept either kys_user or kys_auth cookie
  const userCookie = request.cookies.get('kys_user')?.value;
  const authCookie = request.cookies.get('kys_auth')?.value;
  
  if (!userCookie && !authCookie) {
    // Redirect to login page with redirect parameter
    const url = request.nextUrl.clone();
    url.pathname = '/login';
    url.searchParams.set('redirect', pathname);
    return NextResponse.redirect(url);
  }
  
  return NextResponse.next();
}

export const config = {
  // Protect: /dashboard/* and /manual/*/details
  matcher: ['/dashboard/:path*', '/manual/:path*/details'],
};
