import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

// POST /api/orders/status - Public lookup of an order by orderNumber + email
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()
    const orderNumber = (body.orderNumber || '').trim().toUpperCase()
    const email = (body.email || '').trim().toLowerCase()

    if (!orderNumber || !email) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Order number and email are required'),
        { status: 400 }
      )
    }

    const order = await db.serviceOrder.findFirst({
      where: { orderNumber, email },
      include: { payments: { orderBy: { createdAt: 'desc' } } },
    })

    if (!order) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'No order found for the given number and email'),
        { status: 404 }
      )
    }

    // Only expose safe public fields
    return NextResponse.json(successResponse({
      orderNumber: order.orderNumber,
      serviceTitle: order.serviceTitle,
      name: order.name,
      status: order.status,
      paymentStatus: order.paymentStatus,
      adminMessage: order.adminMessage,
      createdAt: order.createdAt,
      updatedAt: order.updatedAt,
    }))
  } catch (error: any) {
    console.error('Error looking up order status:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to look up order', error.message),
      { status: 500 }
    )
  }
}