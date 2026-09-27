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
    { url: `${siteUrl}/`, priority: 1 },
    { url: `${siteUrl}/about`, priority: 0.7 },
    { url: `${siteUrl}/pricing`, priority: 0.8 },
    { url: `${siteUrl}/services`, priority: 0.9 },
    { url: `${siteUrl}/blog`, priority: 0.9 },
    { url: `${siteUrl}/portfolio`, priority: 0.8 },
    { url: `${siteUrl}/contact`, priority: 0.7 },
    { url: `${siteUrl}/faq`, priority: 0.5 },
    { url: `${siteUrl}/privacy`, priority: 0.3 },
    { url: `${siteUrl}/terms`, priority: 0.3 },
    { url: `${siteUrl}/cookies`, priority: 0.3 },
  ]

  return [
    ...coreRoutes.map(({ url, priority }) => ({ url, lastModified: new Date(), changeFrequency: 'weekly' as const, priority })),
    ...posts.map((post) => ({ url: `${siteUrl}/blog/${post.slug}`, lastModified: post.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
    ...services.map((service) => ({ url: `${siteUrl}/services/${service.slug}`, lastModified: service.updatedAt, changeFrequency: 'monthly' as const, priority: 0.8 })),
    ...caseStudies.map((study) => ({ url: `${siteUrl}/portfolio/${study.slug}`, lastModified: study.updatedAt, changeFrequency: 'monthly' as const, priority: 0.7 })),
  ]
}
