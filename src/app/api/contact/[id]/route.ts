import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

// GET /api/contact/[id] - Get single contact submission by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const submission = await db.contactSubmission.findUnique({
      where: { id }
    })

    if (!submission) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Contact submission not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(successResponse(submission))
  } catch (error: any) {
    console.error('Error fetching contact submission:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch contact submission', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/contact/[id] - Update contact submission
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const body = await request.json()

    // Check if submission exists
    const existing = await db.contactSubmission.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Contact submission not found'),
        { status: 404 }
      )
    }

    // Update submission
    const submission = await db.contactSubmission.update({
      where: { id },
      data: {
        status: body.status,
        notes: body.notes
      }
    })

    return NextResponse.json(
      successResponse(submission, { message: 'Contact submission updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating contact submission:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update contact submission', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/contact/[id] - Delete contact submission
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    // Check if submission exists
    const existing = await db.contactSubmission.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Contact submission not found'),
        { status: 404 }
      )
    }

    // Delete submission
    await db.contactSubmission.delete({
      where: { id }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Contact submission deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting contact submission:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete contact submission', error.message),
      { status: 500 }
    )
  }
}
