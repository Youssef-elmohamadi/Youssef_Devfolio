import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('admin_token')?.value;
  const path = request.nextUrl.pathname;

  // تعريف المسارات
  const isLoginPage = path === '/admin/login'; // 👈 مسار صفحة اللوجين عندك
  const isAdminPath = path.startsWith('/admin'); // أي صفحة بتبدأ بـ admin

  // 1. حماية لوحة التحكم (ماعدا صفحة اللوجين نفسها)
  if (isAdminPath && !isLoginPage && !token) {
    return NextResponse.redirect(new URL('/admin/login', request.url));
  }

  // 2. لو هو مسجل دخول وحاول يفتح اللوجين، وديه على الداشبورد
  if (isLoginPage && token) {
    return NextResponse.redirect(new URL('/admin', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/admin/:path*'], // شغل الميدل وير على كل صفحات الأدمن
}