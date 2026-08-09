import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/pricing - List all pricing packages
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')

    const where: any = {}
    if (published !== null) {
      where.published = published === 'true'
    }

    const packages = await db.pricingPackage.findMany({
      where,
      orderBy: { displayOrder: 'asc' }
    })

    // Parse features from JSON
    const formattedPackages = packages.map(pkg => ({
      ...pkg,
      features: JSON.parse(pkg.features)
    }))

    return NextResponse.json(successResponse(formattedPackages))
  } catch (error: any) {
    console.error('Error fetching pricing packages:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch pricing packages', error.message),
      { status: 500 }
    )
  }
}

// POST /api/pricing - Create a new pricing package
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.price) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Name and price are required'),
        { status: 400 }
      )
    }

    const pricingPackage = await db.pricingPackage.create({
      data: {
        name: body.name,
        description: body.description,
        price: body.price,
        currency: body.currency || 'USD',
        features: JSON.stringify(body.features || []),
        popular: body.popular || false,
        displayOrder: body.displayOrder || 0,
        published: body.published ?? false
      }
    })

    // Parse features for response
    const responseData = {
      ...pricingPackage,
      features: JSON.parse(pricingPackage.features)
    }

    return NextResponse.json(
      successResponse(responseData, { message: 'Pricing package created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating pricing package:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create pricing package', error.message),
      { status: 500 }
    )
  }
}
