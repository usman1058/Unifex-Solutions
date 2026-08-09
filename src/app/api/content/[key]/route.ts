import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/content/[key] - Get single content item by key
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const content = await db.siteContent.findUnique({
      where: { key }
    })

    if (!content) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Content not found'),
        { status: 404 }
      )
    }

    // Parse JSON if needed
    const responseData = {
      ...content,
      value: content.type === 'json' ? JSON.parse(content.value) : content.value
    }

    return NextResponse.json(successResponse(responseData))
  } catch (error: any) {
    console.error('Error fetching content:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch content', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/content/[key] - Update content
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    const body = await request.json()

    // Check if content exists
    const existing = await db.siteContent.findUnique({
      where: { key }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Content not found'),
        { status: 404 }
      )
    }

    // Update content
    const content = await db.siteContent.update({
      where: { key },
      data: {
        value: body.value !== undefined ? (typeof body.value === 'object' ? JSON.stringify(body.value) : body.value) : undefined,
        type: body.type,
        section: body.section,
        description: body.description
      }
    })

    // Parse JSON if needed for response
    const responseData = {
      ...content,
      value: content.type === 'json' ? JSON.parse(content.value) : content.value
    }

    return NextResponse.json(
      successResponse(responseData, { message: 'Content updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating content:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update content', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/content/[key] - Delete content
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ key: string }> }
) {
  try {
    const { key } = await params
    // Check if content exists
    const existing = await db.siteContent.findUnique({
      where: { key }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Content not found'),
        { status: 404 }
      )
    }

    // Delete content
    await db.siteContent.delete({
      where: { key }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Content deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting content:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete content', error.message),
      { status: 500 }
    )
  }
}
