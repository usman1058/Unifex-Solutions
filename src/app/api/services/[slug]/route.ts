import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, generateSlug } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

// GET /api/services/[slug] - Get single service by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const service = await db.service.findUnique({
      where: { slug },
      include: {
        caseStudies: {
          where: { published: true },
          select: {
            id: true,
            slug: true,
            title: true,
            clientName: true,
            thumbnailUrl: true,
            featured: true
          },
          orderBy: { displayOrder: 'asc' }
        }
      }
    })

    if (!service) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Service not found'),
        { status: 404 }
      )
    }

    // Parse JSON fields
    const responseData = {
      ...service,
      features: JSON.parse(service.features),
      techStack: service.techStack ? JSON.parse(service.techStack) : null,
      process: service.process ? JSON.parse(service.process) : null,
      faqs: service.faqs ? JSON.parse(service.faqs) : null
    }

    return NextResponse.json(successResponse(responseData))
  } catch (error: any) {
    console.error('Error fetching service:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch service', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/services/[slug] - Update service
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { slug: paramSlug } = await params
    const body = await request.json()

    // Check if service exists
    const existing = await db.service.findUnique({
      where: { slug: paramSlug }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Service not found'),
        { status: 404 }
      )
    }

    // Handle slug change
    if (body.slug && body.slug !== paramSlug) {
      const slugExists = await db.service.findUnique({
        where: { slug: body.slug }
      })
      if (slugExists) {
        return NextResponse.json(
          errorResponse('DUPLICATE_SLUG', 'A service with this slug already exists'),
          { status: 409 }
        )
      }
    }

    const slug = body.slug || paramSlug

    // Update service
    const service = await db.service.update({
      where: { slug: paramSlug },
      data: {
        slug,
        title: body.title,
        description: body.description,
        content: body.content,
        icon: body.icon,
        imageUrl: body.imageUrl,
        features: body.features ? JSON.stringify(body.features) : undefined,
        techStack: body.techStack ? JSON.stringify(body.techStack) : undefined,
        process: body.process ? JSON.stringify(body.process) : undefined,
        pricing: body.pricing,
        faqs: body.faqs ? JSON.stringify(body.faqs) : undefined,
        featured: body.featured,
        displayOrder: body.displayOrder,
        published: body.published
      }
    })

    return NextResponse.json(
      successResponse(service, { message: 'Service updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating service:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update service', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/services/[slug] - Delete service
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { slug } = await params
    // Check if service exists
    const existing = await db.service.findUnique({
      where: { slug }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Service not found'),
        { status: 404 }
      )
    }

    // Delete service
    await db.service.delete({
      where: { slug }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Service deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting service:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete service', error.message),
      { status: 500 }
    )
  }
}
