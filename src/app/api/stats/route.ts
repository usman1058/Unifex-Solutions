import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/stats - List all stats
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')

    const where: any = {}
    if (published !== null) {
      where.published = published === 'true'
    }

    const stats = await db.stat.findMany({
      where,
      orderBy: { displayOrder: 'asc' }
    })

    return NextResponse.json(successResponse(stats))
  } catch (error: any) {
    console.error('Error fetching stats:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch stats', error.message),
      { status: 500 }
    )
  }
}

// POST /api/stats - Create a new stat
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.label || !body.value) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Label and value are required'),
        { status: 400 }
      )
    }

    const stat = await db.stat.create({
      data: {
        label: body.label,
        value: body.value,
        description: body.description,
        displayOrder: body.displayOrder || 0,
        published: body.published ?? false
      }
    })

    return NextResponse.json(
      successResponse(stat, { message: 'Stat created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating stat:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create stat', error.message),
      { status: 500 }
    )
  }
}
