import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/faq - List all FAQs
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')
    const category = searchParams.get('category')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}
    if (published !== null) {
      where.published = published === 'true'
    }
    if (category) {
      where.category = {
        slug: category
      }
    }
    if (search) {
      where.OR = [
        { question: { contains: search, mode: 'insensitive' } },
        { answer: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Get FAQs
    const faqs = await db.fAQ.findMany({
      where,
      orderBy: { displayOrder: 'asc' },
      include: {
        category: {
          select: {
            id: true,
            name: true,
            slug: true
          }
        }
      }
    })

    return NextResponse.json(successResponse(faqs))
  } catch (error: any) {
    console.error('Error fetching FAQs:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch FAQs', error.message),
      { status: 500 }
    )
  }
}

// POST /api/faq - Create a new FAQ
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.question || !body.answer) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Question and answer are required'),
        { status: 400 }
      )
    }

    const faq = await db.fAQ.create({
      data: {
        question: body.question,
        answer: body.answer,
        displayOrder: body.displayOrder || 0,
        published: body.published ?? false,
        categoryId: body.categoryId
      }
    })

    return NextResponse.json(
      successResponse(faq, { message: 'FAQ created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating FAQ:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create FAQ', error.message),
      { status: 500 }
    )
  }
}
