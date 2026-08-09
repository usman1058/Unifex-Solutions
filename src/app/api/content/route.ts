import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/content - Get all site content or filter by section
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const section = searchParams.get('section')

    const where: any = {}
    if (section) {
      where.section = section
    }

    const content = await db.siteContent.findMany({
      where,
      orderBy: { key: 'asc' }
    })

    // Format as key-value object for easier use
    const contentMap = content.reduce((acc: any, item) => {
      // Parse JSON if needed
      if (item.type === 'json') {
        acc[item.key] = JSON.parse(item.value)
      } else {
        acc[item.key] = item.value
      }
      return acc
    }, {})

    return NextResponse.json(successResponse(contentMap))
  } catch (error: any) {
    console.error('Error fetching site content:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch site content', error.message),
      { status: 500 }
    )
  }
}

// POST /api/content - Create or update site content
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.key || body.value === undefined) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Key and value are required'),
        { status: 400 }
      )
    }

    // Check if content already exists
    const existing = await db.siteContent.findUnique({
      where: { key: body.key }
    })

    let content

    if (existing) {
      // Update existing content
      content = await db.siteContent.update({
        where: { key: body.key },
        data: {
          value: typeof body.value === 'object' ? JSON.stringify(body.value) : body.value,
          type: body.type || (typeof body.value === 'object' ? 'json' : 'text'),
          section: body.section,
          description: body.description
        }
      })
    } else {
      // Create new content
      content = await db.siteContent.create({
        data: {
          key: body.key,
          value: typeof body.value === 'object' ? JSON.stringify(body.value) : body.value,
          type: body.type || (typeof body.value === 'object' ? 'json' : 'text'),
          section: body.section,
          description: body.description
        }
      })
    }

    // Parse JSON if needed for response
    const responseData = {
      ...content,
      value: content.type === 'json' ? JSON.parse(content.value) : content.value
    }

    return NextResponse.json(
      successResponse(responseData, { message: 'Site content saved successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error saving site content:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to save site content', error.message),
      { status: 500 }
    )
  }
}
