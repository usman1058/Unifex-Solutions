import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/certifications/[id] - Get single certification by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const certification = await db.certification.findUnique({
      where: { id }
    })

    if (!certification) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Certification not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(successResponse(certification))
  } catch (error: any) {
    console.error('Error fetching certification:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch certification', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/certifications/[id] - Update certification
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.certification.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Certification not found'),
        { status: 404 }
      )
    }

    const certification = await db.certification.update({
      where: { id },
      data: {
        name: body.name,
        issuer: body.issuer,
        imageUrl: body.imageUrl,
        certificateUrl: body.certificateUrl,
        displayOrder: body.displayOrder,
        published: body.published
      }
    })

    return NextResponse.json(
      successResponse(certification, { message: 'Certification updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating certification:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update certification', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/certifications/[id] - Delete certification
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await db.certification.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Certification not found'),
        { status: 404 }
      )
    }

    await db.certification.delete({
      where: { id }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Certification deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting certification:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete certification', error.message),
      { status: 500 }
    )
  }
}
