import { NextRequest, NextResponse } from 'next/server'
import { db } from '@/lib/db'
import { successResponse, errorResponse } from '@/lib/api-utils'
import { ensureAIConfigured, generateBlogImageUrl, generateSocialPost, generateSocialSnippet, ngcDefaultTopTopics } from '@/lib/ai'
import { generateSlug as baseSlug } from '@/lib/api-utils'
import { requireAdminOrScheduler } from '@/lib/admin-api'
import { publishScheduledPost } from '@/lib/social-publishing'

export const dynamic = 'force-dynamic'
export const maxDuration = 60

// POST /api/scheduled-posts/run
// Processes all posts whose scheduledFor <= now and status === 'scheduled'.
// If a post has aiEnabled, content is generated the moment it publishes
// (picking up the "latest topics"). Then it's marked published and an
// optional blog post record is created in the blog registry.
export async function POST(request: NextRequest) {
  const unauthorized = await requireAdminOrScheduler(request)
  if (unauthorized) return unauthorized
  try {
    const now = new Date()
    const staleBefore = new Date(now.getTime() - 15 * 60 * 1000)
    await db.scheduledPost.updateMany({
      where: { status: 'processing', updatedAt: { lt: staleBefore } },
      data: { status: 'scheduled' },
    })
    const due = await db.scheduledPost.findMany({
      where: {
        status: 'scheduled',
        scheduledFor: { lte: now },
      },
      orderBy: { scheduledFor: 'asc' },
      take: 10,
    })

    if (due.length === 0) {
      return NextResponse.json(successResponse({ published: 0, skipped: 0, posts: [] }))
    }

    // Resolve AI config once
    const aiStatus = await ensureAIConfigured()
    const brandSetting = await db.appSetting.findUnique({ where: { key: 'ai_brand' } })
    const toneSetting = await db.appSetting.findUnique({ where: { key: 'ai_tone' } })
    const brand = brandSetting?.value || 'Unifex Solutions'
    const tone = toneSetting?.value || 'professional'

    const published: any[] = []
    const failed: any[] = []

    for (const post of due) {
      try {
        const claim = await db.scheduledPost.updateMany({
          where: { id: post.id, status: 'scheduled' },
          data: { status: 'processing' },
        })
        if (claim.count !== 1) continue

        let content = post.content
        let title = post.title
        const topics: string[] = post.topics ? JSON.parse(post.topics) : []
        const defaults = ngcDefaultTopTopics()
        const topic = topics[0] || title || defaults[Math.floor(Date.now() / 86_400_000) % defaults.length]
        let imageUrl = post.imageUrl

        // If AI enabled and no concrete content, generate at publish time.
        if (post.aiEnabled) {

          if (aiStatus.configured) {
            // For short-form platforms, generate a snippet; otherwise a full post.
            if (['twitter', 'instagram', 'tiktok'].includes(post.platform)) {
              content =
                post.content ||
                (await generateSocialSnippet(topic, post.platform, post.platform === 'twitter' ? 280 : 2200))
            } else {
              const gen = await generateSocialPost(topic, { brand, tone, maxWords: 120 })
              if (!post.content) content = gen.content
              if (!post.title) title = gen.title
            }
          } else {
            // No AI key -> use a sensible fallback so the pipeline still works.
            content =
              post.content ||
              `${topic} — the latest insight from Unifex Solutions. Stay tuned for more ${post.platform} updates. #tech #software`
          }
          if (!imageUrl) {
            imageUrl = await generateBlogImageUrl(topic)
          }
        }

        const account = post.accountId
          ? await db.socialAccount.findUnique({ where: { id: post.accountId } })
          : null
        if (['facebook', 'linkedin', 'youtube', 'generic-webhook'].includes(post.platform) && !account) {
          throw new Error(`No connected ${post.platform} account is configured`)
        }
        await publishScheduledPost({ ...post, content, title, imageUrl } as typeof post, account)

        // Publish the record (mark it published).
        await db.scheduledPost.update({
          where: { id: post.id },
          data: {
            status: 'published',
            publishedAt: new Date(),
            content,
            title,
            imageUrl,
            error: null,
          },
        })

        // Optionally create a blog post record if we generated a full article
        // and none was linked, so the content surfaces on the site.
        let blogPostId: string | null = null
        if (post.sourcePostId) {
          blogPostId = post.sourcePostId
        } else if (!['twitter', 'instagram', 'tiktok'].includes(post.platform.toLowerCase()) && post.aiEnabled) {
          try {
            const created = await db.blogPost.create({
              data: {
                slug: await generateSlug(title || topic),
                title: title || post.title,
                excerpt: stripHtml(content).slice(0, 160),
                content,
                coverImage: imageUrl,
                author: 'Unifex AI Editor',
                readTime: Math.max(1, Math.ceil(stripHtml(content).split(/\s+/).length / 200)),
                published: true,
                publishedAt: new Date(),
              },
            })
            blogPostId = created.id
          } catch {
            // slug conflict or DB error - skip blog creation gracefully
            blogPostId = null
          }
        }

        published.push({ id: post.id, title, blogPostId })
      } catch (error: any) {
        await db.scheduledPost.update({
          where: { id: post.id },
          data: { status: 'failed', error: (error?.message || 'Publish error').slice(0, 500) },
        })
        failed.push({ id: post.id, error: error?.message })
      }
    }

    return NextResponse.json(
      successResponse({ published, failed, aiConfigured: aiStatus.configured })
    )
  } catch (error: any) {
    console.error('Error running scheduled posts:', error)
    return NextResponse.json(
      errorResponse('RUN_ERROR', 'Failed to run scheduled posts', error.message),
      { status: 500 }
    )
  }
}

// ---- helpers ----
async function generateSlug(title: string): Promise<string> {
  let slug = baseSlug(title)
  let candidate = slug
  let i = 1
  // avoid duplicate slugs
  for (;;) {
    const existing = await db.blogPost.findUnique({ where: { slug: candidate } })
    if (!existing) return candidate
    candidate = `${slug}-${i++}`
  }
}

function stripHtml(html: string): string {
  return html.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}
