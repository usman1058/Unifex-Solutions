import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, isValidEmail, parsePaginationParams, calculatePaginationMeta } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'
import crypto from 'node:crypto'

export const dynamic = 'force-dynamic'

// Generate a human-friendly order number e.g. UF-2026-0001
export async function generateOrderNumber(): Promise<string> {
  const year = new Date().getFullYear()
  return `UF-${year}-${crypto.randomInt(100000, 1000000)}`
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

    if (typeof body.name !== 'string' || typeof body.email !== 'string' || typeof body.details !== 'string' || !body.name.trim() || !body.details.trim()) {
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
    if (typeof body.serviceSlug !== 'string' || !body.serviceSlug.trim()) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Please select a service'),
        { status: 400 }
      )
    }

    // Resolve service id if a slug was passed
    const svc = await db.service.findFirst({ where: { slug: body.serviceSlug.trim(), published: true } })
    if (!svc) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'The selected service is not available'),
        { status: 404 }
      )
    }

    const order = await db.$transaction(async (tx) => {
      const created = await tx.serviceOrder.create({
        data: {
          orderNumber: await generateOrderNumber(),
          serviceId: svc.id,
          serviceTitle: svc.title,
          name: body.name.trim(),
          email: body.email.trim().toLowerCase(),
          phone: typeof body.phone === 'string' ? body.phone.trim() : undefined,
          company: typeof body.company === 'string' ? body.company.trim() : undefined,
          budget: typeof body.budget === 'string' ? body.budget.trim() : undefined,
          details: body.details.trim(),
          status: 'pending',
          paymentStatus: body.receiptUrl ? 'pending' : 'unpaid',
          receiptUrl: typeof body.receiptUrl === 'string' ? body.receiptUrl : undefined,
          receiptFileName: typeof body.receiptFileName === 'string' ? body.receiptFileName : undefined,
          paymentMethod: body.paymentMethod === 'card' ? 'card' : 'bank_receipt',
        },
      })

      if (body.receiptUrl) {
        await tx.orderPayment.create({
          data: {
            orderId: created.id,
            method: body.paymentMethod === 'card' ? 'card' : 'bank_receipt',
            receiptUrl: typeof body.receiptUrl === 'string' ? body.receiptUrl : undefined,
            receiptName: typeof body.receiptFileName === 'string' ? body.receiptFileName : undefined,
            status: 'pending',
          },
        })
      }
      return created
    })

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
