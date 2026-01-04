import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'

export function middleware(request: NextRequest) {
  const token = request.cookies.get('token')?.value
  const role = request.cookies.get('role')?.value 
  const { pathname } = request.nextUrl

  if (!token) {
    if (pathname.startsWith('/users') || pathname.startsWith('/admin')) {
      return NextResponse.redirect(new URL('/', request.url))
    }
  }

  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL('/users/overview', request.url))
  }


  if (pathname.startsWith('/users') && role === 'admin') {
    return NextResponse.redirect(new URL('/admin', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/users/:path*', '/admin/:path*'],
}
