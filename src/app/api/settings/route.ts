import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

const PUBLIC_KEYS = [
  'ai_provider',
  'ai_model',
  'ai_base_url',
  'ai_tone',
  'ai_brand',
  'social_default_platform',
]

function maskSecret(value: string): string {
  if (!value) return ''
  return value.length > 8 ? `${value.slice(0, 4)}••••••••` : '••••••••'
}

// GET /api/settings - List settings (secrets masked unless ?unmask=true)
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const unmask = request.nextUrl.searchParams.get('unmask') === 'true'
    const settings = await db.appSetting.findMany({ orderBy: { category: 'asc' } })

    const data = settings.map((s) => ({
      ...s,
      value: s.type === 'secret' && !unmask ? maskSecret(s.value) : s.value,
    }))

    return NextResponse.json(successResponse(data))
  } catch (error: any) {
    console.error('Error fetching settings:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch settings', error.message),
      { status: 500 }
    )
  }
}

// POST /api/settings - Upsert one or many settings
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const body = await request.json()
    const items = Array.isArray(body) ? body : [body]

    if (items.length === 0) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'No settings provided'),
        { status: 400 }
      )
    }

    const results: any[] = []
    for (const item of items) {
      if (!item.key) {
        return NextResponse.json(
          errorResponse('VALIDATION_ERROR', 'Each setting requires a key'),
          { status: 400 }
        )
      }
      const existing = await db.appSetting.findUnique({ where: { key: item.key } })
      const result = existing
        ? await db.appSetting.update({
            where: { key: item.key },
            data: {
              value: item.value,
              type: item.type || existing.type,
              category: item.category || existing.category,
              description: item.description ?? existing.description,
            },
          })
        : await db.appSetting.create({
            data: {
              key: item.key,
              value: item.value,
              type: item.type || 'text',
              category: item.category || 'general',
              description: item.description,
            },
          })
      results.push(result)
    }

    return NextResponse.json(
      successResponse(results, { message: 'Settings saved successfully' }),
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error saving settings:', error)
    return NextResponse.json(
      errorResponse('SAVE_ERROR', 'Failed to save settings', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/settings?key=... - Delete a single setting
export async function DELETE(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const key = request.nextUrl.searchParams.get('key')
    if (!key) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'key query param is required'),
        { status: 400 }
      )
    }
    const existing = await db.appSetting.findUnique({ where: { key } })
    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Setting not found'),
        { status: 404 }
      )
    }
    await db.appSetting.delete({ where: { key } })
    return NextResponse.json(
      successResponse(null, { message: 'Setting deleted' }),
      { status: 200 }
    )
  } catch (error: any) {
    console.error('Error deleting setting:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete setting', error.message),
      { status: 500 }
    )
  }
}
