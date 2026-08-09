import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/clients/[id] - Get single client by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const client = await db.client.findUnique({
      where: { id }
    })

    if (!client) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Client not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(successResponse(client))
  } catch (error: any) {
    console.error('Error fetching client:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch client', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/clients/[id] - Update client
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.client.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Client not found'),
        { status: 404 }
      )
    }

    const client = await db.client.update({
      where: { id },
      data: {
        name: body.name,
        logoUrl: body.logoUrl,
        websiteUrl: body.websiteUrl,
        featured: body.featured,
        displayOrder: body.displayOrder,
        published: body.published
      }
    })

    return NextResponse.json(
      successResponse(client, { message: 'Client updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating client:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update client', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/clients/[id] - Delete client
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await db.client.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Client not found'),
        { status: 404 }
      )
    }

    await db.client.delete({
      where: { id }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Client deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting client:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete client', error.message),
      { status: 500 }
    )
  }
}
