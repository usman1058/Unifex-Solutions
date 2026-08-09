import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, isValidEmail, parsePaginationParams, calculatePaginationMeta } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

// Generate a human-friendly order number e.g. UF-2026-0001
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  const count = await db.serviceOrder.count()
  return `UF-${year}-${String(count + 1).padStart(4, '0')}`
}

// GET /api/orders - List orders (admin)
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, limit, sortBy, sortOrder } = parsePaginationParams(searchParams)
    const status = searchParams.get('status')
    const search = searchParams.get('search')

    const where: any = {}
    if (status) where.status = status
    if (search) {
      where.OR = [
        { name: { contains: search, mode: 'insensitive' } },
        { email: { contains: search, mode: 'insensitive' } },
        { orderNumber: { contains: search, mode: 'insensitive' } },
        { company: { contains: search, mode: 'insensitive' } },
        { serviceTitle: { contains: search, mode: 'insensitive' } },
      ]
    }

    const total = await db.serviceOrder.count({ where })
    const orders = await db.serviceOrder.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy === 'createdAt' ? { createdAt: sortOrder } : { [sortBy]: sortOrder },
      include: { payments: { orderBy: { createdAt: 'desc' } } },
    })

    return NextResponse.json(successResponse(orders, calculatePaginationMeta(total, page, limit)))
  } catch (error: any) {
    console.error('Error fetching orders:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch orders', error.message),
      { status: 500 }
    )
  }
}

// POST /api/orders - Create a new order (public checkout flow)
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.email || !body.details) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Name, email, and project details are required'),
        { status: 400 }
      )
    }
    if (!isValidEmail(body.email)) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Invalid email address'),
        { status: 400 }
      )
    }
    if (!body.serviceTitle && !body.serviceSlug) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Please select a service'),
        { status: 400 }
      )
    }

    // Resolve service id if a slug was passed
    let serviceId: string | null = null
    let serviceTitle = body.serviceTitle
    if (body.serviceSlug) {
      const svc = await db.service.findUnique({ where: { slug: body.serviceSlug } })
      if (svc) {
        serviceId = svc.id
        serviceTitle = svc.title
      }
    }

    const orderNumber = await generateOrderNumber()

    const order = await db.serviceOrder.create({
      data: {
        orderNumber,
        serviceId,
        serviceTitle,
        name: body.name,
        email: body.email,
        phone: body.phone,
        company: body.company,
        budget: body.budget,
        details: body.details,
        attachments: body.attachments ? JSON.stringify(body.attachments) : undefined,
        status: 'pending',
        paymentStatus: body.receiptUrl ? 'pending' : 'unpaid',
        receiptUrl: body.receiptUrl,
        receiptFileName: body.receiptFileName,
        paymentMethod: body.paymentMethod || 'bank_receipt',
        amountPaid: body.amountPaid,
      },
    })

    // Create a payment record if a receipt was uploaded
    if (body.receiptUrl) {
      await db.orderPayment.create({
        data: {
          orderId: order.id,
          method: body.paymentMethod || 'bank_receipt',
          amount: body.amountPaid,
          receiptUrl: body.receiptUrl,
          receiptName: body.receiptFileName,
          status: 'pending',
          reference: body.reference,
        },
      })
    }

    return NextResponse.json(
      successResponse(order, { message: 'Order created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating order:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create order', error.message),
      { status: 500 }
    )
  }
}
