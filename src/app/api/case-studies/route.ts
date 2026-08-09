import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { generateSlug, successResponse, errorResponse, parsePaginationParams, calculatePaginationMeta } from '@/lib/api-utils'

// GET /api/case-studies - List all case studies
export async function GET(request: NextRequest) {
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, limit, sortBy, sortOrder } = parsePaginationParams(searchParams)
    const published = searchParams.get('published')
    const featured = searchParams.get('featured')
    const service = searchParams.get('service')
    const tag = searchParams.get('tag')
    const industry = searchParams.get('industry')
    const search = searchParams.get('search')

    // Build where clause
    const where: any = {}
    if (published !== null) {
      where.published = published === 'true'
    }
    if (featured !== null) {
      where.featured = featured === 'true'
    }
    if (service) {
      where.serviceId = service
    }
    if (industry) {
      where.industry = { contains: industry, mode: 'insensitive' }
    }
    if (search) {
      where.OR = [
        { title: { contains: search, mode: 'insensitive' } },
        { clientName: { contains: search, mode: 'insensitive' } },
        { overview: { contains: search, mode: 'insensitive' } }
      ]
    }

    // Handle tag filtering
    if (tag) {
      where.tagJoins = {
        some: {
          tag: {
            slug: tag
          }
        }
      }
    }

    // Get total count
    const total = await db.caseStudy.count({ where })

    // Get case studies
    const caseStudies = await db.caseStudy.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: { [sortBy]: sortOrder },
      include: {
        service: {
          select: {
            id: true,
            title: true,
            slug: true
          }
        },
        tagJoins: {
          include: {
            tag: true
          }
        }
      }
    })

    // Format response
    const formattedCaseStudies = caseStudies.map(cs => ({
      ...cs,
      tags: cs.tagJoins.map(join => join.tag),
      tagJoins: undefined,
      process: JSON.parse(cs.process),
      results: JSON.parse(cs.results),
      techStack: JSON.parse(cs.techStack),
      screenshots: cs.screenshots ? JSON.parse(cs.screenshots) : null
    }))

    return NextResponse.json(
      successResponse(formattedCaseStudies, calculatePaginationMeta(total, page, limit))
    )
  } catch (error: any) {
    console.error('Error fetching case studies:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch case studies', error.message),
      { status: 500 }
    )
  }
}

// POST /api/case-studies - Create a new case study
export async function POST(request: NextRequest) {
  try {
    const body = await request.json()

    // Validate required fields
    if (!body.title || !body.clientName || !body.overview) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Title, client name, and overview are required'),
        { status: 400 }
      )
    }

    // Generate slug from title if not provided
    const slug = body.slug || generateSlug(body.title)

    // Check if slug already exists
    const existing = await db.caseStudy.findUnique({ where: { slug } })
    if (existing) {
      return NextResponse.json(
        errorResponse('DUPLICATE_SLUG', 'A case study with this slug already exists'),
        { status: 409 }
      )
    }

    // Create case study
    const caseStudy = await db.caseStudy.create({
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
        problem: body.problem || '',
        solution: body.solution || '',
        process: JSON.stringify(body.process || []),
        results: JSON.stringify(body.results || []),
        techStack: JSON.stringify(body.techStack || []),
        screenshots: body.screenshots ? JSON.stringify(body.screenshots) : null,
        featured: body.featured || false,
        displayOrder: body.displayOrder || 0,
        published: body.published ?? false,
        serviceId: body.serviceId
      }
    })

    // Add tags if provided
    if (body.tags && body.tags.length > 0) {
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

    // Fetch the created case study with relations
    const createdCaseStudy = await db.caseStudy.findUnique({
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
      successResponse(createdCaseStudy, { message: 'Case study created successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating case study:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create case study', error.message),
      { status: 500 }
    )
  }
}
