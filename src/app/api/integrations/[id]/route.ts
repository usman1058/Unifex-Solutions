import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const integration = await db.integration.findUnique({ where: { id } })
    if (!integration) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Integration not found'), { status: 404 })
    }
    return NextResponse.json(successResponse(integration))
  } catch (error: any) {
    console.error('Error fetching integration:', error)
    return NextResponse.json(errorResponse('FETCH_ERROR', 'Failed to fetch integration', error.message), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const existing = await db.integration.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Integration not found'), { status: 404 })
    }

    const body = await request.json()
    if (!body.name || !body.type) {
      return NextResponse.json(errorResponse('VALIDATION_ERROR', 'Name and type are required'), { status: 400 })
    }

    const data = {
      name: body.name,
      type: body.type,
      config: body.config ? JSON.stringify(body.config) : existing.config,
      description: body.description !== undefined ? body.description : existing.description,
      enabled: body.enabled !== undefined ? body.enabled : existing.enabled,
    }

    const integration = await db.integration.update({ where: { id }, data })
    return NextResponse.json(successResponse(integration, { message: 'Integration updated successfully' }))
  } catch (error: any) {
    console.error('Error updating integration:', error)
    return NextResponse.json(errorResponse('SAVE_ERROR', 'Failed to update integration', error.message), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const existing = await db.integration.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Integration not found'), { status: 404 })
    }
    await db.integration.delete({ where: { id } })
    return NextResponse.json(successResponse(null, { message: 'Integration deleted successfully' }))
  } catch (error: any) {
    console.error('Error deleting integration:', error)
    return NextResponse.json(errorResponse('DELETE_ERROR', 'Failed to delete integration', error.message), { status: 500 })
  }
}
