import { NextRequest, NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE, createSessionToken, verifyCredentials } from '@/lib/admin-session'
import { errorResponse, successResponse } from '@/lib/api-utils'

export async function POST(request: NextRequest) {
  try {
    const body = await request.json().catch(() => null)
    if (!body?.email || !body?.password || !verifyCredentials(body.email, body.password)) {
      return NextResponse.json(errorResponse('UNAUTHORIZED', 'Invalid email or password'), { status: 401 })
    }

    const response = NextResponse.json(successResponse({ authenticated: true }))
    response.cookies.set(ADMIN_SESSION_COOKIE, createSessionToken(), {
      httpOnly: true,
      sameSite: 'lax',
      secure: process.env.NODE_ENV === 'production',
      path: '/',
      maxAge: 60 * 60 * 24 * 7,
    })
    return response
  } catch (error) {
    console.error('Admin login failed:', error)
    return NextResponse.json(
      errorResponse('AUTH_CONFIG_ERROR', 'Admin authentication is not configured correctly on the server.'),
      { status: 500 }
    )
  }
}
