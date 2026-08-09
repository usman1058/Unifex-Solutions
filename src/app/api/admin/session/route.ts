import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-session'

export async function GET() {
  try {
    return NextResponse.json({ authenticated: await isAdminRequest() })
  } catch (error) {
    console.error('Admin session check failed:', error)
    return NextResponse.json({ authenticated: false }, { status: 503 })
  }
}
