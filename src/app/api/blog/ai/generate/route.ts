import { NextRequest, NextResponse } from 'next/server'
import { requireAdmin } from '@/lib/admin-api'
import { errorResponse, successResponse } from '@/lib/api-utils'
import { generateBlogImageUrl, generateSocialPost } from '@/lib/ai'

export const dynamic = 'force-dynamic'
export const maxDuration = 120

export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const body = await request.json()
    const topic = typeof body.topic === 'string' ? body.topic.trim() : ''
    if (!topic) return NextResponse.json(errorResponse('VALIDATION_ERROR', 'A topic is required'), { status: 400 })

    const text = await generateSocialPost(topic, {
      brand: typeof body.brand === 'string' ? body.brand : undefined,
      tone: typeof body.tone === 'string' ? body.tone : undefined,
      maxWords: 220,
    })
    const imageUrl = body.generateImage === false ? null : await generateBlogImageUrl(topic)

    return NextResponse.json(successResponse({
      topic,
      title: text.title,
      content: text.content,
      excerpt: text.content.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim().slice(0, 180),
      coverImage: imageUrl,
    }))
  } catch {
    console.error('[ai] Blog generation failed')
    return NextResponse.json(errorResponse('GENERATION_ERROR', 'Unable to generate the blog draft'), { status: 500 })
  }
}
