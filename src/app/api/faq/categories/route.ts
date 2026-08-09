import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug, successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/faq/categories - List all FAQ categories
export async function GET(request: NextRequest) {
  try {
    const categories = await db.fAQCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { faqs: true }
        }
      }
    })

    return NextResponse.json(successResponse(categories))
  } catch (error: any) {
    console.error('Error fetching FAQ categories:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch FAQ categories', error.message),
      { status: 500 }
    )
  }
}

// POST /api/faq/categories - Create a new FAQ category
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Category name is required'),
        { status: 400 }
      )
    }

    const slug = body.slug || generateSlug(body.name)

    const existing = await db.fAQCategory.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        errorResponse('DUPLICATE_SLUG', 'A category with this slug already exists'),
        { status: 409 }
      )
    }

    const category = await db.fAQCategory.create({
      data: {
        name: body.name,
        slug,
        description: body.description
      }
    })

    return NextResponse.json(
      successResponse(category, { message: 'FAQ category created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating FAQ category:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create FAQ category', error.message),
      { status: 500 }
    )
  }
}
