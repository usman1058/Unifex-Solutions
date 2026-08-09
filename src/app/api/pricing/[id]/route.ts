import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/pricing/[id] - Get single pricing package by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const pricingPackage = await db.pricingPackage.findUnique({
      where: { id }
    })

    if (!pricingPackage) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Pricing package not found'),
        { status: 404 }
      )
    }

    // Parse features for response
    const responseData = {
      ...pricingPackage,
      features: JSON.parse(pricingPackage.features)
    }

    return NextResponse.json(successResponse(responseData))
  } catch (error: any) {
    console.error('Error fetching pricing package:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch pricing package', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/pricing/[id] - Update pricing package
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    const existing = await db.pricingPackage.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Pricing package not found'),
        { status: 404 }
      )
    }

    const pricingPackage = await db.pricingPackage.update({
      where: { id },
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        currency: body.currency,
        features: body.features ? JSON.stringify(body.features) : undefined,
        popular: body.popular,
        displayOrder: body.displayOrder,
        published: body.published
      }
    })

    // Parse features for response
    const responseData = {
      ...pricingPackage,
      features: JSON.parse(pricingPackage.features)
    }

    return NextResponse.json(
      successResponse(responseData, { message: 'Pricing package updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating pricing package:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update pricing package', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/pricing/[id] - Delete pricing package
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const existing = await db.pricingPackage.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Pricing package not found'),
        { status: 404 }
      )
    }

    await db.pricingPackage.delete({
      where: { id }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Pricing package deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting pricing package:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete pricing package', error.message),
      { status: 500 }
    )
  }
}
