import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

export async function GET(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const post = await db.scheduledPost.findUnique({
      where: { id },
      include: { account: true },
    })
    if (!post) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Scheduled post not found'), { status: 404 })
    }
    return NextResponse.json(successResponse(post))
  } catch (error: any) {
    console.error('Error fetching scheduled post:', error)
    return NextResponse.json(errorResponse('FETCH_ERROR', 'Failed to fetch scheduled post', error.message), { status: 500 })
  }
}

export async function PUT(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const existing = await db.scheduledPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Scheduled post not found'), { status: 404 })
    }

    const body = await request.json()
    const post = await db.scheduledPost.update({
      where: { id },
      data: {
        title: body.title,
        content: body.content,
        originalPrompt: body.originalPrompt,
        topics: body.topics !== undefined ? JSON.stringify(body.topics) : undefined,
        platform: body.platform,
        accountId: body.accountId !== undefined ? body.accountId : undefined,
        link: body.link,
        imageUrl: body.imageUrl,
        hashtags: body.hashtags !== undefined ? JSON.stringify(body.hashtags) : undefined,
        scheduledFor: body.scheduledFor ? new Date(body.scheduledFor) : undefined,
        status: body.status,
        aiEnabled: body.aiEnabled,
        aiModel: body.aiModel,
        aiProvider: body.aiProvider,
        sourcePostId: body.sourcePostId,
      },
    })

    return NextResponse.json(successResponse(post, { message: 'Post updated successfully' }))
  } catch (error: any) {
    console.error('Error updating scheduled post:', error)
    return NextResponse.json(errorResponse('UPDATE_ERROR', 'Failed to update scheduled post', error.message), { status: 500 })
  }
}

export async function DELETE(request: NextRequest, { params }: { params: Promise<{ id: string }> }) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const { id } = await params
    const existing = await db.scheduledPost.findUnique({ where: { id } })
    if (!existing) {
      return NextResponse.json(errorResponse('NOT_FOUND', 'Scheduled post not found'), { status: 404 })
    }
    await db.scheduledPost.delete({ where: { id } })
    return NextResponse.json(successResponse(null, { message: 'Scheduled post deleted' }))
  } catch (error: any) {
    console.error('Error deleting scheduled post:', error)
    return NextResponse.json(errorResponse('DELETE_ERROR', 'Failed to delete scheduled post', error.message), { status: 500 })
  }
}
