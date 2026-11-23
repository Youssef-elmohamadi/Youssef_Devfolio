import createMiddleware from 'next-intl/middleware';
import { routing } from './i18n/routing';
import { NextRequest, NextResponse } from 'next/server';

const handleI18nRouting = createMiddleware(routing);

export function middleware(request: NextRequest) {
  const { pathname, search } = request.nextUrl;

  // Split path segments to detect locale
  const segments = pathname.split('/').filter(Boolean);
  const firstSegment = segments[0];
  const hasLocale = routing.locales.includes(firstSegment as any);
  const locale = hasLocale ? firstSegment : routing.defaultLocale;

  // Normalize path without locale
  const pathWithoutLocale = hasLocale 
    ? '/' + segments.slice(1).join('/') 
    : pathname;

  const isAdminPath = pathWithoutLocale.startsWith('/admin');
  const isLoginPage = pathWithoutLocale === '/admin/login';
  const token = request.cookies.get('admin_token')?.value;

  // 1. Protect Admin routes (except login page) when not authenticated
  if (isAdminPath && !isLoginPage && !token) {
    const loginUrl = new URL(`/${locale}/admin/login${search}`, request.url);
    return NextResponse.redirect(loginUrl);
  }

  // 2. If authenticated user tries to access login page, redirect to admin dashboard
  if (isAdminPath && isLoginPage && token) {
    const dashboardUrl = new URL(`/${locale}/admin${search}`, request.url);
    return NextResponse.redirect(dashboardUrl);
  }

  // 3. Delegate to next-intl middleware for internationalized routing
  return handleI18nRouting(request);
}

export const config = {
  // Match all request paths except:
  // - /api routes
  // - /_next (Next.js internals)
  // - /_vercel
  // - Static files with extensions (e.g. .svg, .png, .jpg, .ico, etc.)
  matcher: [
    '/((?!api|_next|_vercel|.*\\..*).*)',
  ],
};
