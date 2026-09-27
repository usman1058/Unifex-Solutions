import { NextResponse } from 'next/server'
import { NextRequest } from 'next/server'
import crypto from 'node:crypto'
import { isAdminRequest } from '@/lib/admin-session'
import { errorResponse } from '@/lib/api-utils'

export async function requireAdmin() {
  if (await isAdminRequest()) return null
  return NextResponse.json(errorResponse('UNAUTHORIZED', 'Administrator authentication required'), { status: 401 })
}

export async function requireAdminOrScheduler(request: NextRequest) {
  if (await isAdminRequest()) return null
  const configured = process.env.SCHEDULER_SECRET
  const supplied = request.headers.get('x-scheduler-secret')
  if (configured && supplied && supplied.length === configured.length && crypto.timingSafeEqual(Buffer.from(supplied), Buffer.from(configured))) {
    return null
  }
  return NextResponse.json(errorResponse('UNAUTHORIZED', 'Administrator or scheduler authentication required'), { status: 401 })
}
