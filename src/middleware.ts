import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // Replace 'auth_token' with the name of the cookie used in your app

  const { pathname } = request.nextUrl;

  // List of paths that should be protected from access by authenticated users
  const protectedPathsForAuthenticated = ['/login', '/register' ,"/about"];

  if (token && protectedPathsForAuthenticated.includes(pathname)) {
    // If the user is authenticated and tries to access login or register pages, redirect to /dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  // You can add additional logic here, such as redirecting unauthenticated users from other protected paths
  if (!token && pathname === '/articles') {

    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register', '/articles'], 
};

