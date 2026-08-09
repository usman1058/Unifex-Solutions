import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug, successResponse, errorResponse, parsePaginationParams, calculatePaginationMeta } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

// GET /api/services - List all services
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, limit, sortBy, sortOrder } = parsePaginationParams(searchParams)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}
    if (published !== null) {
      where.published = published === 'true'
    }
    if (featured !== null) {
      where.featured = featured === 'true'
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { description: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get total count
    const total = await db.service.count({ where })

    // Get services
    const services = await db.service.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        _count: {
          select: { caseStudies: true }
        }
      }
    })

    return NextResponse.json(
      successResponse(services, calculatePaginationMeta(total, page, limit))
    )
  } catch (error: any) {
    console.error('Error fetching services:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch services', error.message),
      { status: 500 }
    )
  }
}

// POST /api/services - Create a new service
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.description) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Title and description are required'),
        { status: 400 }
      )
    }

    // Generate slug from title if not provided
    const slug = body.slug || generateSlug(body.title)

    // Check if slug already exists
    const existing = await db.service.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        errorResponse('DUPLICATE_SLUG', 'A service with this slug already exists'),
        { status: 409 }
      )
    }

    // Create service
    const service = await db.service.create({
      data: {
        slug,
        title: body.title,
        description: body.description,
        content: body.content || '',
        icon: body.icon,
        imageUrl: body.imageUrl,
        features: JSON.stringify(body.features || []),
        techStack: body.techStack ? JSON.stringify(body.techStack) : null,
        process: body.process ? JSON.stringify(body.process) : null,
        pricing: body.pricing,
        faqs: body.faqs ? JSON.stringify(body.faqs) : null,
        featured: body.featured || false,
        displayOrder: body.displayOrder || 0,
        published: body.published ?? false
      }
    })

    return NextResponse.json(
      successResponse(service, { message: 'Service created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating service:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create service', error.message),
      { status: 500 }
    )
  }
}
