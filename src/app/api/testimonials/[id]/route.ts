import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

// GET /api/testimonials/[id] - Get single testimonial by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const testimonial = await db.testimonial.findUnique({
      where: { id }
    })

    if (!testimonial) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Testimonial not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(successResponse(testimonial))
  } catch (error: any) {
    console.error('Error fetching testimonial:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch testimonial', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/testimonials/[id] - Update testimonial
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const body = await request.json()

    // Check if testimonial exists
    const existing = await db.testimonial.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Testimonial not found'),
        { status: 404 }
      )
    }

    // Update testimonial
    const testimonial = await db.testimonial.update({
      where: { id },
      data: {
        name: body.name,
        role: body.role,
        company: body.company,
        content: body.content,
        avatarUrl: body.avatarUrl,
        rating: body.rating,
        featured: body.featured,
        displayOrder: body.displayOrder,
        published: body.published
      }
    })

    return NextResponse.json(
      successResponse(testimonial, { message: 'Testimonial updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating testimonial:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update testimonial', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/testimonials/[id] - Delete testimonial
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    // Check if testimonial exists
    const existing = await db.testimonial.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Testimonial not found'),
        { status: 404 }
      )
    }

    // Delete testimonial
    await db.testimonial.delete({
      where: { id }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Testimonial deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting testimonial:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete testimonial', error.message),
      { status: 500 }
    )
  }
}
