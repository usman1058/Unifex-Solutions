import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, parsePaginationParams, calculatePaginationMeta } from '@/lib/api-utils'

// GET /api/team - List all team members
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, limit, sortBy, sortOrder } = parsePaginationParams(searchParams)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')

    // Build where clause
    const where: any = {}
    if (published !== null) {
      where.published = published === 'true'
    }
    if (featured !== null) {
      where.featured = featured === 'true'
    }

    // Get total count
    const total = await db.teamMember.count({ where })

    // Get team members
    const teamMembers = await db.teamMember.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder }
    })

    return NextResponse.json(
      successResponse(teamMembers, calculatePaginationMeta(total, page, limit))
    )
  } catch (error: any) {
    console.error('Error fetching team members:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch team members', error.message),
      { status: 500 }
    )
  }
}

// POST /api/team - Create a new team member
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    if (!body.name || !body.role) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Name and role are required'),
        { status: 400 }
      )
    }

    const teamMember = await db.teamMember.create({
      data: {
        name: body.name,
        role: body.role,
        bio: body.bio,
        imageUrl: body.imageUrl,
        linkedinUrl: body.linkedinUrl,
        twitterUrl: body.twitterUrl,
        githubUrl: body.githubUrl,
        email: body.email,
        featured: body.featured || false,
        displayOrder: body.displayOrder || 0,
        published: body.published ?? false
      }
    })

    return NextResponse.json(
      successResponse(teamMember, { message: 'Team member created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating team member:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create team member', error.message),
      { status: 500 }
    )
  }
}
