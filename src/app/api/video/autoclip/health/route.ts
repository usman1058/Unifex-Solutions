import { NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { errorResponse, successResponse } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized

  const setting = await db.appSetting.findUnique({ where: { key: 'autoclip_url' } })
  const baseUrl = (setting?.value || process.env.AUTOCLIP_URL || '').replace(/\/$/, '')
  if (!baseUrl) return NextResponse.json(successResponse({ configured: false, connected: false, language: 'en' }))

  try {
    const response = await fetch(`${baseUrl}/api/v1/health/`, { signal: AbortSignal.timeout(5000), cache: 'no-store' })
    if (!response.ok) throw new Error('health check failed')
    return NextResponse.json(successResponse({ configured: true, connected: true, url: baseUrl, language: 'en' }))
  } catch {
    return NextResponse.json(successResponse({ configured: true, connected: false, url: baseUrl, language: 'en' }))
  }
}
