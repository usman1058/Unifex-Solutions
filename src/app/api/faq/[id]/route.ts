import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/faq/[id] - Get single FAQ by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const faq = await db.fAQ.findUnique({
      where: { id },
      include: {
        category: true
      }
    })

    if (!faq) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'FAQ not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(successResponse(faq))
  } catch (error: any) {
    console.error('Error fetching FAQ:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch FAQ', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/faq/[id] - Update FAQ
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if FAQ exists
    const existing = await db.fAQ.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'FAQ not found'),
        { status: 404 }
      )
    }

    // Update FAQ
    const faq = await db.fAQ.update({
      where: { id },
      data: {
        question: body.question,
        answer: body.answer,
        displayOrder: body.displayOrder,
        published: body.published,
        categoryId: body.categoryId
      }
    })

    return NextResponse.json(
      successResponse(faq, { message: 'FAQ updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating FAQ:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update FAQ', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/faq/[id] - Delete FAQ
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if FAQ exists
    const existing = await db.fAQ.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'FAQ not found'),
        { status: 404 }
      )
    }

    // Delete FAQ
    await db.fAQ.delete({
      where: { id }
    })

    return NextResponse.json(
      successResponse(null, { message: 'FAQ deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting FAQ:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete FAQ', error.message),
      { status: 500 }
    )
  }
}
