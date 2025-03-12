import { NextRequest, NextResponse } from 'next/server'
import { EnumTokens } from './services/auth-token.service'

export async function middleware(request: NextRequest, response: NextResponse) {
  const { url, cookies } = request

  const refreshToken = cookies.get(EnumTokens.REFRESH_TOKEN)?.value

  const isAuthPath = url.includes('/auth')

  if (isAuthPath && refreshToken) {
    return NextResponse.redirect(new URL('/', request.url))
  }

  if (isAuthPath) {
    return NextResponse.next()
  }

  if (!refreshToken) {
    return NextResponse.redirect(new URL('/auth', request.url))
  }

  return NextResponse.next()
}

export const config = {
  matcher: ['/', '/auth/:path*']
}
