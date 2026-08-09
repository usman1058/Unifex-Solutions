import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse, parsePaginationParams, calculatePaginationMeta } from '@/lib/api-utils'
import { ensureAIConfigured, generateSocialPost, generateSocialSnippet } from '@/lib/ai'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

// GET /api/scheduled-posts - List scheduled posts with filters
export async function GET(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const searchParams = request.nextUrl.searchParams
    const { page, limit, sortBy, sortOrder } = parsePaginationParams(searchParams)
    const status = searchParams.get('status')
    const platform = searchParams.get('platform')

    const where: any = {}
    if (status) where.status = status
    if (platform) where.platform = platform

    const total = await db.scheduledPost.count({ where })
    const posts = await db.scheduledPost.findMany({
      where,
      skip: (page - 1) * limit,
      take: limit,
      orderBy: sortBy === 'scheduledFor' ? { scheduledFor: sortOrder } : { [sortBy]: sortOrder },
      include: { account: { select: { id: true, name: true, platform: true, handle: true } } },
    })

    return NextResponse.json(successResponse(posts, calculatePaginationMeta(total, page, limit)))
  } catch (error: any) {
    console.error('Error fetching scheduled posts:', error)
    return NextResponse.json(
      errorResponse('FETCH_ERROR', 'Failed to fetch scheduled posts', error.message),
      { status: 500 }
    )
  }
}

// POST /api/scheduled-posts - Create a scheduled post (optionally AI-generated)
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const body = await request.json()

    if (!body.title && !body.content && !body.topics) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'Title, content, or topics are required'),
        { status: 400 }
      )
    }
    if (!body.scheduledFor) {
      return NextResponse.json(
        errorResponse('VALIDATION_ERROR', 'scheduledFor (datetime) is required'),
        { status: 400 }
      )
    }

    let title = body.title || ''
    let content = body.content || ''
    const aiEnabled = !!body.aiEnabled

    // AI generation: if no manual content but aiEnabled, generate content now.
    if (aiEnabled && (!content || !title)) {
      const aiStatus = await ensureAIConfigured()
      if (!aiStatus.configured) {
        return NextResponse.json(
          errorResponse('AI_NOT_CONFIGURED', aiStatus.reason || 'AI is not configured'),
          { status: 400 }
        )
      }

      const topic = body.topics?.[0] || body.title || 'latest software development trends'
      const toneSetting = await db.appSetting.findUnique({ where: { key: 'ai_tone' } })
      const brandSetting = await db.appSetting.findUnique({ where: { key: 'ai_brand' } })

      const generated = await generateSocialPost(topic, {
        brand: brandSetting?.value || 'Unifex Solutions',
        tone: toneSetting?.value || 'professional',
      })

      title = title || generated.title
      content = content || generated.content
    }

    const post = await db.scheduledPost.create({
      data: {
        title,
        content,
        originalPrompt: body.originalPrompt,
        topics: body.topics ? JSON.stringify(body.topics) : undefined,
        platform: body.platform || 'twitter',
        accountId: body.accountId || undefined,
        link: body.link,
        imageUrl: body.imageUrl,
        hashtags: body.hashtags ? JSON.stringify(body.hashtags) : undefined,
        scheduledFor: new Date(body.scheduledFor),
        status: body.status || 'scheduled',
        aiEnabled,
        aiModel: body.aiModel,
        aiProvider: body.aiProvider,
        sourcePostId: body.sourcePostId,
      },
    })

    return NextResponse.json(
      successResponse(post, { message: 'Post scheduled successfully' }),
      { status: 201 }
    )
  } catch (error: any) {
    console.error('Error creating scheduled post:', error)
    return NextResponse.json(
      errorResponse('CREATE_ERROR', 'Failed to create scheduled post', error.message),
      { status: 500 }
    )
  }
}
