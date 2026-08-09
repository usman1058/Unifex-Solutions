import { NextRequest, NextResponse } from 'next/server'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { ensureAIConfigured, generateSocialPost, generateSocialSnippet } from '@/lib/ai'
import { requireAdmin } from '@/lib/admin-api'

export const dynamic = 'force-dynamic'

// POST /api/scheduled-posts/generate - Generate AI content without saving
// body: { type?: 'post' | 'snippet', topics?: string[], topic?: string, platform?, 
//          brand?, tone?, maxWords?, maxChars? }
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdmin()
  if (unauthorized) return unauthorized
  try {
    const aiStatus = await ensureAIConfigured()
    if (!aiStatus.configured) {
      return NextResponse.json(
        errorResponse('AI_NOT_CONFIGURED', aiStatus.reason || 'AI is not configured'),
        { status: 400 }
      )
    }

    const body = await request.json()

    // Common topics
    let topics: string[] = body.topics || []
    if (topics.length > 0) {
      // Normalize topics: could be array of strings or array of objects from client.
      topics = topics.map((t: any) => (typeof t === 'object' && t !== null ? t.label || t.text || t.topic : String(t))).filter(Boolean)
    }

    if (body.type === 'snippet' || body.snippet) {
      const topic = topics[0] || body.topic || 'software development'
      const snippet = await generateSocialSnippet(topic, body.platform || 'twitter', body.maxChars || 280)
      return NextResponse.json(successResponse({ snippet, topic }))
    }

    const topic = topics[0] || body.topic || 'latest software development trends'

    const result = await generateSocialPost(topic, {
      brand: body.brand || 'Unifex Solutions',
      tone: body.tone || 'professional',
      maxWords: body.maxWords || 120,
    })

    return NextResponse.json(successResponse({ ...result, topic }))
  } catch (error: any) {
    console.error('Error generating content:', error)
    return NextResponse.json(
      errorResponse('GENERATION_ERROR', error.message || 'Failed to generate content'),
      { status: 500 }
    )
  }
}
