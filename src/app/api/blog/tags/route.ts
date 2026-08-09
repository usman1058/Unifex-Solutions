import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug, successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/blog/tags - List all tags
export async function GET(request: NextRequest) {
  try {
    const tags = await db.blogPostTag.findMany({
      orderBy: { name: 'asc' },
      include: {
        _count: {
          select: { tagJoins: true }
        }
      }
    })

    // Format response with post count
    const formattedTags = tags.map(tag => ({
      ...tag,
      postCount: tag._count.tagJoins,
      _count: undefined
    }))

    return NextResponse.json(successResponse(formattedTags))
  } catch (error: any) {
    console.error('Error fetching tags:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch tags', error.message),
      { status: 500 }
    )
  }
}

// POST /api/blog/tags - Create a new tag
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Tag name is required'),
        { status: 400 }
      )
    }

    const slug = body.slug || generateSlug(body.name)

    const existing = await db.blogPostTag.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        errorResponse('DUPLICATE_SLUG', 'A tag with this slug already exists'),
        { status: 409 }
      )
    }

    const tag = await db.blogPostTag.create({
      data: {
        name: body.name,
        slug
      }
    })

    return NextResponse.json(
      successResponse(tag, { message: 'Tag created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating tag:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create tag', error.message),
      { status: 500 }
    )
  }
}
