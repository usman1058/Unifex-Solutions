import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/stats/[id] - Get single stat by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const stat = await db.stat.findUnique({
      where: { id }
    })

    if (!stat) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Stat not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(successResponse(stat))
  } catch (error: any) {
    console.error('Error fetching stat:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch stat', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/stats/[id] - Update stat
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.stat.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Stat not found'),
        { status: 404 }
      )
    }

    const stat = await db.stat.update({
      where: { id },
      data: {
        label: body.label,
        value: body.value,
        description: body.description,
        displayOrder: body.displayOrder,
        published: body.published
      }
    })

    return NextResponse.json(
      successResponse(stat, { message: 'Stat updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating stat:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update stat', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/stats/[id] - Delete stat
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await db.stat.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Stat not found'),
        { status: 404 }
      )
    }

    await db.stat.delete({
      where: { id }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Stat deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting stat:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete stat', error.message),
      { status: 500 }
    )
  }
}
