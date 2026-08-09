import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, parsePaginationParams, calculatePaginationMeta } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

// GET /api/testimonials - List all testimonials
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, limit, sortBy, sortOrder } = parsePaginationParams(searchParams)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')

    // Build where clause
    const where: any = {}
    if (published !== null) {
      where.published = published === 'true'
    }
    if (featured !== null) {
      where.featured = featured === 'true'
    }

    // Get total count
    const total = await db.testimonial.count({ where })

    // Get testimonials
    const testimonials = await db.testimonial.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    })

    return NextResponse.json(
      successResponse(testimonials, calculatePaginationMeta(total, page, limit))
    )
  } catch (error: any) {
    console.error('Error fetching testimonials:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch testimonials', error.message),
      { status: 500 }
    )
  }
}

// POST /api/testimonials - Create a new testimonial
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const body = await request.json()

    if (!body.name || !body.content) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Name and content are required'),
        { status: 400 }
      )
    }

    const testimonial = await db.testimonial.create({
      data: {
        name: body.name,
        role: body.role,
        company: body.company,
        content: body.content,
        avatarUrl: body.avatarUrl,
        rating: body.rating,
        featured: body.featured || false,
        displayOrder: body.displayOrder || 0,
        published: body.published ?? false
      }
    })

    return NextResponse.json(
      successResponse(testimonial, { message: 'Testimonial created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating testimonial:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create testimonial', error.message),
      { status: 500 }
    )
  }
}
