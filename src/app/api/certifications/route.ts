import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/certifications - List all certifications
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const published = searchParams.get('published')

    const where: any = {}
    if (published !== null) {
      where.published = published === 'true'
    }

    const certifications = await db.certification.findMany({
      where,
      orderBy: { displayOrder: 'asc' }
    })

    return NextResponse.json(successResponse(certifications))
  } catch (error: any) {
    console.error('Error fetching certifications:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch certifications', error.message),
      { status: 500 }
    )
  }
}

// POST /api/certifications - Create a new certification
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Certification name is required'),
        { status: 400 }
      )
    }

    const certification = await db.certification.create({
      data: {
        name: body.name,
        issuer: body.issuer,
        imageUrl: body.imageUrl,
        certificateUrl: body.certificateUrl,
        displayOrder: body.displayOrder || 0,
        published: body.published ?? false
      }
    })

    return NextResponse.json(
      successResponse(certification, { message: 'Certification created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating certification:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create certification', error.message),
      { status: 500 }
    )
  }
}
