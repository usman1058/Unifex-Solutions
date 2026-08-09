import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'

// GET /api/team/[id] - Get single team member by id
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const teamMember = await db.teamMember.findUnique({
      where: { id }
    })

    if (!teamMember) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Team member not found'),
        { status: 404 }
      )
    }

    return NextResponse.json(successResponse(teamMember))
  } catch (error: any) {
    console.error('Error fetching team member:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch team member', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/team/[id] - Update team member
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    const body = await request.json()

    // Check if team member exists
    const existing = await db.teamMember.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Team member not found'),
        { status: 404 }
      )
    }

    // Update team member
    const teamMember = await db.teamMember.update({
      where: { id },
      data: {
        name: body.name,
        role: body.role,
        bio: body.bio,
        imageUrl: body.imageUrl,
        linkedinUrl: body.linkedinUrl,
        twitterUrl: body.twitterUrl,
        githubUrl: body.githubUrl,
        email: body.email,
        featured: body.featured,
        displayOrder: body.displayOrder,
        published: body.published
      }
    })

    return NextResponse.json(
      successResponse(teamMember, { message: 'Team member updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating team member:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update team member', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/team/[id] - Delete team member
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params
    // Check if team member exists
    const existing = await db.teamMember.findUnique({
      where: { id }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Team member not found'),
        { status: 404 }
      )
    }

    // Delete team member
    await db.teamMember.delete({
      where: { id }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Team member deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting team member:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete team member', error.message),
      { status: 500 }
    )
  }
}
