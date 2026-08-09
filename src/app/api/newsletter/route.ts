import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, isValidEmail } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

// GET /api/newsletter - List all newsletter subscriptions (admin only)
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const searchParams = request.nextUrl.searchParams
    const active = searchParams.get('active')

    const where: any = {}
    if (active !== null) {
      where.active = active === 'true'
    }

    const subscriptions = await db.newsletterSubscription.findMany({
      where,
      orderBy: { createdAt: 'desc' }
    })

    return NextResponse.json(successResponse(subscriptions))
  } catch (error: any) {
    console.error('Error fetching newsletter subscriptions:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch newsletter subscriptions', error.message),
      { status: 500 }
    )
  }
}

// POST /api/newsletter - Subscribe to newsletter
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.email) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Email is required'),
        { status: 400 }
      )
    }

    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Invalid email address'),
        { status: 400 }
      )
    }

    // Check if already subscribed
    const existing = await db.newsletterSubscription.findUnique({
      where: { email: body.email }
    })

    if (existing) {
      // Reactivate if inactive
      if (!existing.active) {
        await db.newsletterSubscription.update({
          where: { email: body.email },
          data: { active: true }
        })
      }
      return NextResponse.json(
        successResponse({ email: body.email, message: 'You are already subscribed' }),
        { status: 200 }
      )
    }

    // Create new subscription
    const subscription = await db.newsletterSubscription.create({
      data: {
        email: body.email,
        active: true
      }
    })

    return NextResponse.json(
      successResponse(
        { email: subscription.email, message: 'Successfully subscribed to newsletter' },
        { message: 'Newsletter subscription created successfully' }
      ),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating newsletter subscription:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create newsletter subscription', error.message),
      { status: 500 }
    )
  }
}
