import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import BlogArticleExperience from '@/components/blog/blog-article-experience'
import { absoluteUrl, buildMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await db.blogPost.findUnique({ where: { slug, published: true }, include: { category: true } })
  if (!post) return buildMetadata({ title: 'Article Not Found | Unifex', description: 'The requested Unifex Journal article could not be found.', path: `/blog/${slug}`, noIndex: true })
  const description = post.excerpt || `Read ${post.title} in the Unifex Journal.`
  const metadata = buildMetadata({ title: `${post.title} | Unifex Journal`, description, path: `/blog/${slug}`, image: post.coverImage, type: 'article' })
  return { ...metadata, openGraph: { ...metadata.openGraph, type: 'article', publishedTime: (post.publishedAt || post.createdAt).toISOString(), modifiedTime: post.updatedAt.toISOString(), authors: [post.author] } }
}

export default async function BlogPostPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const post = await db.blogPost.findUnique({ where: { slug, published: true }, include: { category: true, tagJoins: { include: { tag: true } } } })
  if (!post) notFound()

  const relatedPosts = await db.blogPost.findMany({
    where: { published: true, NOT: { id: post.id }, ...(post.categoryId ? { categoryId: post.categoryId } : {}) },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    take: 3,
    include: { category: true },
  })

  const publishedAt = (post.publishedAt || post.createdAt).toISOString()
  const siteUrl = absoluteUrl('/').replace(/\/$/, '')
  const structuredData = { '@context': 'https://schema.org', '@type': 'Article', headline: post.title, description: post.excerpt || post.title, image: post.coverImage ? [post.coverImage] : undefined, datePublished: publishedAt, dateModified: post.updatedAt.toISOString(), author: { '@type': 'Person', name: post.author }, publisher: { '@type': 'Organization', name: 'Unifex Solutions', url: siteUrl }, mainEntityOfPage: `${siteUrl}/blog/${post.slug}` }

  return <main className="min-h-screen overflow-x-hidden bg-background pt-24 text-on-surface"><script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} /><BlogArticleExperience article={{ title: post.title, content: post.content, excerpt: post.excerpt, author: post.author, coverImage: post.coverImage, readTime: post.readTime || 5, publishedAt, category: post.category?.name || 'General', tags: post.tagJoins.map(({ tag }) => tag.name), sharePlacement: (['hero', 'sidebar', 'after-excerpt', 'after-content'] as const).includes(post.sharePlacement as 'hero' | 'sidebar' | 'after-excerpt' | 'after-content') ? post.sharePlacement as 'hero' | 'sidebar' | 'after-excerpt' | 'after-content' : 'sidebar' }} relatedPosts={relatedPosts.map((related) => ({ id: related.id, slug: related.slug, title: related.title, coverImage: related.coverImage, readTime: related.readTime || 5, category: related.category?.name || 'General' }))} /></main>
}
