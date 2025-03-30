import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token'); // استبدل 'auth_token' باسم الكوكيز المستخدم في تطبيقك

  const { pathname } = request.nextUrl;

  // قائمة بالمسارات التي يجب حمايتها من الوصول من قبل المستخدمين المسجّلين
  const protectedPathsForAuthenticated = ['/login', '/register'];

  if (token && protectedPathsForAuthenticated.includes(pathname)) {
    // إذا كان المستخدم مسجّلاً ويحاول الوصول إلى صفحة تسجيل الدخول أو التسجيل، إعادة التوجيه إلى /dashboard
    return NextResponse.redirect(new URL('/', request.url));
  }

  // يمكنك إضافة منطق إضافي هنا، مثل إعادة توجيه المستخدمين غير المسجّلين من مسارات محمية أخرى
  if (!token && pathname === '/articles') {
    return NextResponse.redirect(new URL('/login', request.url));
  }
  return NextResponse.next();
}

export const config = {
  matcher: ['/login', '/register'], // تحديد المسارات التي تنطبق عليها الـ Middleware
};

