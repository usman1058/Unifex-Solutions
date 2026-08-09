import { MetadataRoute } from 'next'
import { db } from '@/lib/db'
import { siteUrl } from '@/lib/seo'

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [posts, services, caseStudies] = await Promise.all([
    db.blogPost.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.service.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
    db.caseStudy.findMany({ where: { published: true }, select: { slug: true, updatedAt: true } }),
  ])

  const coreRoutes: MetadataRoute.Sitemap = [
    { path: '/', priority: 1 },
    { path: '/about', priority: 0.7 },
    { path: '/pricing', priority: 0.8 },
    { path: '/services', priority: 0.9 },
    { path: '/blog', priority: 0.9 },
    { path: '/portfolio', priority: 0.8 },
    { path: '/contact', priority: 0.7 },
    { path: '/faq', priority: 0.5 },
  ]

  return [
    ...coreRoutes.map(({ path, priority }) => ({ url: `${siteUrl}${path}`, lastModified: new Date(), changeFrequency: 'weekly' as const, priority })),
    ...posts.map((post) => ({ url: `${siteUrl}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...services.map((service) => ({ url: `${siteUrl}/services/${service.slug}`, lastModified: service.updatedAt, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...caseStudies.map((study) => ({ url: `${siteUrl}/portfolio/${study.slug}`, lastModified: study.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
