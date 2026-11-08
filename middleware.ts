import { NextRequest, NextResponse } from 'next/server'
import { jwtVerify } from 'jose'
import { USER_DASHBOARD, WEBSITE_LOGIN } from './routes/website.route'
import { ADMIN_DASHBOARD } from './routes/AdminPanel.route'

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl
  const token = request.cookies.get('access_token')?.value
  const isAuthPage = pathname.startsWith('/auth')

  // 1) Token hai hi nahi
  if (!token) {
    if (isAuthPage) return NextResponse.next()
    return NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url))
  }

  // 2) Token verify karo
  let role: string | undefined
  try {
    const secret = new TextEncoder().encode(process.env.JWT_SECRET)
    const { payload } = await jwtVerify(token, secret)
    role = payload.role as string
  } catch {
    // Token kharab ya expire: cookie delete karo
    const res = isAuthPage
      ? NextResponse.next()
      : NextResponse.redirect(new URL(WEBSITE_LOGIN, request.url))
    res.cookies.delete('access_token')
    return res
  }

  const home = role === 'admin' ? ADMIN_DASHBOARD : USER_DASHBOARD

  // 3) Login ho chuka hai to /auth pages par na jaye
  if (isAuthPage) {
    return NextResponse.redirect(new URL(home, request.url))
  }

  // 4) Role-based protection
  if (pathname.startsWith('/admin') && role !== 'admin') {
    return NextResponse.redirect(new URL(home, request.url))
  }
  if (pathname.startsWith('/my-account') && role !== 'user') {
    return NextResponse.redirect(new URL(home, request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/admin/:path*', '/my-account/:path*', '/auth/:path*'],
}