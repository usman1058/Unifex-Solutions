import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

// GET /api/orders/[id] - Get single order (by id or orderNumber)
export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const order = await db.serviceOrder.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
      include: { payments: { orderBy: { createdAt: 'desc' } }, service: true },
    })
    if (!order) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Order not found'), { status: 404 })
    }
    return NextResponse.json(successResponse(order))
  } catch (error: any) {
    console.error('Error fetching order:', error)
    return NextResponse.json(errorResponse('FETCH_ERROR', 'Failed to fetch order', error.message), { status: 500 })
  }
}

// PUT /api/orders/[id] - Update order / approve payment / manage status
export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const existing = await db.serviceOrder.findFirst({
      where: { OR: [{ id }, { orderNumber: id }] },
    })
    if (!existing) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Order not found'), { status: 404 })
    }

    const body = await request.json()
    const data: any = {}

    // Admin workflow
    if (body.status) data.status = body.status
    if (body.paymentStatus) data.paymentStatus = body.paymentStatus
    if (body.adminNotes !== undefined) data.adminNotes = body.adminNotes
    if (body.adminMessage !== undefined) data.adminMessage = body.adminMessage

    // When payment approved, mark order paid and processing accordingly
    if (body.approvePayment === true) {
      data.paymentStatus = 'paid'
      if (body.status && body.status === 'completed') data.status = 'completed'
      else data.status = 'processing'
      await db.orderPayment.updateMany({
        where: { orderId: existing.id, status: 'pending' },
        data: { status: 'approved' },
      })
    }
    if (body.rejectPayment === true) {
      data.paymentStatus = 'pending'
      await db.orderPayment.updateMany({
        where: { orderId: existing.id, status: 'pending' },
        data: { status: 'rejected', notes: body.notes },
      })
    }

    const order = await db.serviceOrder.update({
      where: { id: existing.id },
      data,
      include: { payments: { orderBy: { createdAt: 'desc' } } },
    })

    return NextResponse.json(successResponse(order, { message: 'Order updated successfully' }))
  } catch (error: any) {
    console.error('Error updating order:', error)
    return NextResponse.json(errorResponse('UPDATE_ERROR', 'Failed to update order', error.message), { status: 500 })
  }
}

// DELETE /api/orders/[id] - Delete an order
export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const existing = await db.serviceOrder.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Order not found'), { status: 404 })
    }
    await db.serviceOrder.delete({ where: { id } })
    return NextResponse.json(successResponse(null, { message: 'Order deleted' }))
  } catch (error: any) {
    console.error('Error deleting order:', error)
    return NextResponse.json(errorResponse('DELETE_ERROR', 'Failed to delete order', error.message), { status: 500 })
  }
}
