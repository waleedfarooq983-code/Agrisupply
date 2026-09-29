import { NextRequest, NextResponse } from 'next/server';
import { verifyToken } from '@/lib/auth';

const roleHome: Record<string, string> = {
  farmer: '/farmer',
  transporter: '/transporter',
  warehouse: '/warehouse',
  retailer: '/retailer',
};

export function proxy(req: NextRequest) {
  const { pathname } = req.nextUrl;
  const token = req.cookies.get('token')?.value;
  const payload = token ? verifyToken(token) : null;

  const isProtected = ['/farmer', '/transporter', '/warehouse', '/retailer'].some((p) =>
    pathname.startsWith(p)
  );

  if (isProtected && !payload) {
    return NextResponse.redirect(new URL('/login', req.url));
  }

  if (isProtected && payload) {
    const allowed = `/${payload.role}`;
    if (!pathname.startsWith(allowed)) {
      return NextResponse.redirect(new URL(roleHome[payload.role], req.url));
    }
  }

  if (pathname === '/login' && payload) {
    return NextResponse.redirect(new URL(roleHome[payload.role], req.url));
  }

  return NextResponse.next();
}

export default proxy;

export const config = {
  matcher: [
    '/farmer/:path*',
    '/transporter/:path*',
    '/warehouse/:path*',
    '/retailer/:path*',
    '/login',
  ],
};