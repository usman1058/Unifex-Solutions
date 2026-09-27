import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

export async function GET() {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const integrations = await db.integration.findMany({ orderBy: { createdAt: 'desc' } })
    return NextResponse.json(successResponse(integrations))
  } catch (error: any) {
    console.error('Error fetching integrations:', error)
    return NextResponse.json(errorResponse('FETCH_ERROR', 'Failed to fetch integrations', error.message), { status: 500 })
  }
}

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const body = await request.json()
    if (!body.name || !body.type) {
      return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Name and type are required'), { status: 400 })
    }

    const data = {
      name: body.name,
      type: body.type,
      config: body.config ? JSON.stringify(body.config) : '{}',
      description: body.description ?? null,
      enabled: body.enabled ?? true,
    }

    const integration = await db.integration.create({ data })
    return NextResponse.json(successResponse(integration, { message: 'Integration created successfully' }), { status: 201 })
  } catch (error: any) {
    console.error('Error creating integration:', error)
    return NextResponse.json(errorResponse('SAVE_ERROR', 'Failed to create integration', error.message), { status: 500 })
  }
}
