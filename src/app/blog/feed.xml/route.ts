import { db } from '@/lib/db'

export async function GET() {
  const siteUrl = process.env.NEXT_PUBLIC_SITE_URL || 'http://localhost:3000'
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 50,
    include: { category: true },
  })

  const items = posts.map((post) => {
    const publishedAt = post.publishedAt || post.createdAt
    return `<item><title><![CDATA[${post.title}]]></title><link>${siteUrl}/blog/${post.slug}</link><guid isPermaLink="true">${siteUrl}/blog/${post.slug}</guid><description><![CDATA[${post.excerpt || post.title}]]></description><pubDate>${publishedAt.toUTCString()}</pubDate><category><![CDATA[${post.category?.name || 'General'}]]></category></item>`
  }).join('')

  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Unifex Journal</title><link>${siteUrl}/blog</link><description>Engineering, security, design, and growth insights from Unifex Solutions.</description><language>en-us</language>${items}</channel></rss>`

  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8', 'Cache-Control': 's-maxage=3600, stale-while-revalidate=86400' } })
}
