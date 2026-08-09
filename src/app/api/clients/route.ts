import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/clients - List all clients
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')

    const where: any = {}
    if (published !== null) {
      where.published = published === 'true'
    }
    if (featured !== null) {
      where.featured = featured === 'true'
    }

    const clients = await db.client.findMany({
      where,
      orderBy: { displayOrder: 'asc' }
    })

    return NextResponse.json(successResponse(clients))
  } catch (error: any) {
    console.error('Error fetching clients:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch clients', error.message),
      { status: 500 }
    )
  }
}

// POST /api/clients - Create a new client
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Client name is required'),
        { status: 400 }
      )
    }

    const client = await db.client.create({
      data: {
        name: body.name,
        logoUrl: body.logoUrl,
        websiteUrl: body.websiteUrl,
        featured: body.featured || false,
        displayOrder: body.displayOrder || 0,
        published: body.published ?? false
      }
    })

    return NextResponse.json(
      successResponse(client, { message: 'Client created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating client:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create client', error.message),
      { status: 500 }
    )
  }
}
