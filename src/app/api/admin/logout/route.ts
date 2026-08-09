import { NextResponse } from 'next/server'
import { ADMIN_SESSION_COOKIE } from '@/lib/admin-session'

export async function POST() {
  const response = NextResponse.json({ success: true })
  response.cookies.set(ADMIN_SESSION_COOKIE, '', { httpOnly: true, expires: new Date(0), path: '/' })
  return response
}
