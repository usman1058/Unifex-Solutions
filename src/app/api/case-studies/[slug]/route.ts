import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, generateSlug } from '@/lib/api-utils'

export const dynamic = 'force-dynamic'

// GET /api/case-studies/[slug] - Get single case study by slug
export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    const caseStudy = await db.caseStudy.findUnique({
      where: { slug },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            slug: true,
            description: true
          }
        },
        tagJoins: {
          include: {
            tag: true
          }
        }
      }
    })

    if (!caseStudy) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Case study not found'),
        { status: 404 }
      )
    }

    // Parse JSON fields
    const responseData = {
      ...caseStudy,
      tags: caseStudy.tagJoins.map(join => join.tag),
      tagJoins: undefined,
      process: JSON.parse(caseStudy.process),
      results: JSON.parse(caseStudy.results),
      techStack: JSON.parse(caseStudy.techStack),
      screenshots: caseStudy.screenshots ? JSON.parse(caseStudy.screenshots) : null
    }

    return NextResponse.json(successResponse(responseData))
  } catch (error: any) {
    console.error('Error fetching case study:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch case study', error.message),
      { status: 500 }
    )
  }
}

// PUT /api/case-studies/[slug] - Update case study
export async function PUT(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug: paramSlug } = await params
    const body = await request.json()

    // Check if case study exists
    const existing = await db.caseStudy.findUnique({
      where: { slug: paramSlug }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Case study not found'),
        { status: 404 }
      )
    }

    // Handle slug change
    if (body.slug && body.slug !== paramSlug) {
      const slugExists = await db.caseStudy.findUnique({
        where: { slug: body.slug }
      })
      if (slugExists) {
        return NextResponse.json(
          errorResponse('DUPLICATE_SLUG', 'A case study with this slug already exists'),
          { status: 409 }
        )
      }
    }

    const slug = body.slug || paramSlug

    // Update case study
    const caseStudy = await db.caseStudy.update({
      where: { slug: paramSlug },
      data: {
        slug,
        title: body.title,
        clientName: body.clientName,
        industry: body.industry,
        projectUrl: body.projectUrl,
        githubUrl: body.githubUrl,
        thumbnailUrl: body.thumbnailUrl,
        heroImage: body.heroImage,
        overview: body.overview,
        problem: body.problem,
        solution: body.solution,
        process: body.process ? JSON.stringify(body.process) : undefined,
        results: body.results ? JSON.stringify(body.results) : undefined,
        techStack: body.techStack ? JSON.stringify(body.techStack) : undefined,
        screenshots: body.screenshots ? JSON.stringify(body.screenshots) : undefined,
        featured: body.featured,
        displayOrder: body.displayOrder,
        published: body.published,
        serviceId: body.serviceId
      }
    })

    // Handle tags
    if (body.tags !== undefined) {
      // Remove existing tags
      await db.caseStudyTagJoin.deleteMany({
        where: { caseStudyId: caseStudy.id }
      })

      // Add new tags
      for (const tagName of body.tags) {
        let tag = await db.caseStudyTag.findUnique({
          where: { slug: generateSlug(tagName) }
        })

        if (!tag) {
          tag = await db.caseStudyTag.create({
            data: {
              name: tagName,
              slug: generateSlug(tagName)
            }
          })
        }

        await db.caseStudyTagJoin.create({
          data: {
            caseStudyId: caseStudy.id,
            tagId: tag.id
          }
        })
      }
    }

    // Fetch updated case study with relations
    const updatedCaseStudy = await db.caseStudy.findUnique({
      where: { id: caseStudy.id },
      include: {
        service: true,
        tagJoins: {
          include: {
            tag: true
          }
        }
      }
    })

    return NextResponse.json(
      successResponse(updatedCaseStudy, { message: 'Case study updated successfully' })
    )
  } catch (error: any) {
    console.error('Error updating case study:', error)
    return NextResponse.json(
      errorResponse('UPDATE_ERROR', 'Failed to update case study', error.message),
      { status: 500 }
    )
  }
}

// DELETE /api/case-studies/[slug] - Delete case study
export async function DELETE(
  request: NextRequest,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params
    // Check if case study exists
    const existing = await db.caseStudy.findUnique({
      where: { slug }
    })

    if (!existing) {
      return NextResponse.json(
        errorResponse('NOT_FOUND', 'Case study not found'),
        { status: 404 }
      )
    }

    // Delete case study (cascade will handle tag joins)
    await db.caseStudy.delete({
      where: { slug }
    })

    return NextResponse.json(
      successResponse(null, { message: 'Case study deleted successfully' })
    )
  } catch (error: any) {
    console.error('Error deleting case study:', error)
    return NextResponse.json(
      errorResponse('DELETE_ERROR', 'Failed to delete case study', error.message),
      { status: 500 }
    )
  }
}
