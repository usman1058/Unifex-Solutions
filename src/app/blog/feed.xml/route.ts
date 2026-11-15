import { db } from '@/lib/db'
import { isPlaceholderBlogContent } from '@/lib/published-content'
import { siteUrl } from '@/lib/seo'
import { editorialPosts } from '@/lib/editorial-posts'

export async function GET() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 50,
    include: { category: true },
  })

  const completePosts = posts.filter((post) => !isPlaceholderBlogContent(post.content))
  const items = (completePosts.length ? completePosts.map((post) => {
    const publishedAt = post.publishedAt || post.createdAt
    return `<item><title><![CDATA[${post.title}]]></title><link>${siteUrl}/blog/${post.slug}</link><guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid><description><![CDATA[${post.excerpt || post.title}]]></description><pubDate>${publishedAt.toUTCString()}</pubDate><category><![CDATA[${post.category?.name || 'General'}]]></category></item>`
  }) : editorialPosts.map((post) => `<item><title><![CDATA[${post.title}]]></title><link>${siteUrl}/blog/${post.slug}</link><guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid><description><![CDATA[${post.excerpt}]]></description><pubDate>${new Date(post.publishedAt).toUTCString()}</pubDate><category><![CDATA[${post.category.name}]]></category></item>`)).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Unifex Journal</title><link>${siteUrl}/blog</link><description>Engineering, security, design, and growth insights from Unifex Solutions.</description><language>en-us</language>${items}</channel></rss>`

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' } })
}
