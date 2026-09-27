import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

const SECRET_CONFIG_FIELDS = new Set(['accessToken', 'apiKey', 'clientSecret', 'webhookSecret'])

function parseConfig(value: string | null | undefined): Record<string, unknown> {
  if (!value) return {}
  try {
    const parsed = JSON.parse(value)
    return parsed && typeof parsed === 'object' ? parsed : {}
  } catch {
    return {}
  }
}

function publicAccount(account: any) {
  const config = parseConfig(account.config)
  const safeConfig = Object.fromEntries(Object.entries(config).filter(([key]) => !SECRET_CONFIG_FIELDS.has(key)))
  return {
    ...account,
    config: safeConfig,
    hasCredentials: [...SECRET_CONFIG_FIELDS].some((key) => typeof config[key] === 'string' && Boolean(config[key])),
  }
}

// GET /api/social-accounts - List connected accounts
export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const accounts = await db.socialAccount.findMany({ orderBy: { displayOrder: 'asc' } })
    return NextResponse.json(successResponse(accounts.map(publicAccount)))
  } catch (error: any) {
    console.error('Error fetching social accounts:', error)
    return NextResponse.json(errorResponse('FETCH_ERROR', 'Failed to fetch social accounts', error.message), { status: 500 })
  }
}

// POST /api/social-accounts - Create or update a connected account
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const body = await request.json()
    if (!body.platform || !body.name) {
      return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Platform and name are required'), { status: 400 })
    }

    const existing = body.id ? await db.socialAccount.findUnique({ where: { id: body.id } }) : null

    const incomingConfig = body.config && typeof body.config === 'object' ? body.config : {}
    const existingConfig = parseConfig(existing?.config)
    const data = {
      platform: body.platform,
      name: body.name,
      handle: body.handle,
      enabled: body.enabled ?? true,
      config: JSON.stringify({ ...existingConfig, ...incomingConfig }),
      published: body.published ?? true,
      displayOrder: body.displayOrder ?? existing?.displayOrder ?? 0,
    }

    const account = existing
      ? await db.socialAccount.update({ where: { id: body.id }, data })
      : await db.socialAccount.create({ data })

    return NextResponse.json(successResponse(publicAccount(account), { message: 'Account saved successfully' }), { status: 201 })
  } catch (error: any) {
    console.error('Error saving social account:', error)
    return NextResponse.json(errorResponse('SAVE_ERROR', 'Failed to save social account', error.message), { status: 500 })
  }
}
