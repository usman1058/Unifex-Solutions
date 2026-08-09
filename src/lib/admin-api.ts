import { NextResponse } from 'next/server'
import { isAdminRequest } from '@/lib/admin-session'
import { errorResponse } from '@/lib/api-utils'

export async function requireAdmin() {
  if (await isAdminRequest()) return null
  return NextResponse.json(errorResponse('UNAUTHORIZED', 'Administrator authentication required'), { status: 401 })
}
