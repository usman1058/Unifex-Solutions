import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug, successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/blog/categories - List all categories
export async function GET(request: NextRequest) {
  try {
    const categories = await db.blogCategory.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { blogPosts: true }
        }
      }
    })

    return NextResponse.json(successResponse(categories))
  } catch (error: any) {
    console.error('Error fetching categories:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch categories', error.message),
      { status: 500 }
    )
  }
}

// POST /api/blog/categories - Create a new category
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

    const existing = await db.blogCategory.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        errorResponse('DUPLICATE_SLUG', 'A category with this slug already exists'),
        { status: 409 }
      )
    }

    const category = await db.blogCategory.create({
      data: {
        name: body.name,
        slug,
        description: body.description
      }
    })

    return NextResponse.json(
      successResponse(category, { message: 'Category created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating category:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create category', error.message),
      { status: 500 }
    )
  }
}
