import { db } from '@/lib/db'
import BlogExperience from '@/components/blog/blog-experience'
import { buildMetadata } from '@/lib/seo'
import { isPlaceholderBlogContent } from '@/lib/published-content'
import { editorialPosts } from '@/lib/editorial-posts'

export const metadata = buildMetadata({ title: 'Technology & Digital Growth Blog | The Unifex Journal', description: 'Practical insights on software development, cybersecurity, digital products, SEO, and sustainable online growth.', path: '/blog' })

export const revalidate = 60

export default async function BlogPage() {
  const posts = await db.blogPost.findMany({
    where: { published: true },
    orderBy: [{ publishedAt: 'desc' }, { createdAt: 'desc' }],
    include: { category: true, tagJoins: { include: { tag: true } } },
  })

  const completePosts = posts.filter((post) => !isPlaceholderBlogContent(post.content)).map((post) => ({
    id: post.id,
    slug: post.slug,
    title: post.title,
    excerpt: post.excerpt,
    author: post.author,
    coverImage: post.coverImage,
    readTime: post.readTime || 5,
    publishedAt: (post.publishedAt || post.createdAt).toISOString(),
    category: post.category ? { name: post.category.name, slug: post.category.slug } : null,
    tags: post.tagJoins.map(({ tag }) => tag.name),
  }))
  const fallbackPosts = editorialPosts.map(({ content: _content, ...post }) => post)

  return <BlogExperience posts={completePosts.length > 0 ? completePosts : fallbackPosts} />
}
