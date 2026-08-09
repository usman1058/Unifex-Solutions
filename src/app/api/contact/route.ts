import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, isValidEmail, parsePaginationParams, calculatePaginationMeta } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

// GET /api/contact - List all contact submissions (admin only)
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, limit, sortBy, sortOrder } = parsePaginationParams(searchParams)
    const status = searchParams.get('status')

    // Build where clause
    const where: any = {}
    if (status) {
      where.status = status
    }

    // Get total count
    const total = await db.contactSubmission.count({ where })

    // Get contact submissions
    const submissions = await db.contactSubmission.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    })

    return NextResponse.json(
      successResponse(submissions, calculatePaginationMeta(total, page, limit))
    )
  } catch (error: any) {
    console.error('Error fetching contact submissions:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch contact submissions', error.message),
      { status: 500 }
    )
  }
}

// POST /api/contact - Create a new contact submission
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.name || !body.email || !body.message) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Name, email, and message are required'),
        { status: 400 }
      )
    }

    // Validate email
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Invalid email address'),
        { status: 400 }
      )
    }

    // Create contact submission
    const submission = await db.contactSubmission.create({
      data: {
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        subject: body.subject,
        message: body.message,
        source: body.source || 'contact-form',
        status: 'new'
      }
    })

    return NextResponse.json(
      successResponse(
        {
          id: submission.id,
          name: submission.name,
          email: submission.email,
          message: 'Thank you for your message! We will get back to you soon.'
        },
        { message: 'Contact submission created successfully' }
      ),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating contact submission:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create contact submission', error.message),
      { status: 500 }
    )
  }
}
