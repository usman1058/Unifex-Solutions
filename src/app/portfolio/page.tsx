import { db } from '@/lib/db'
import PortfolioExperience from '@/components/portfolio/portfolio-experience'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({ title: 'Software Portfolio & Case Studies | Unifex Solutions', description: 'Explore software platforms, digital products, and secure systems engineered by Unifex Solutions.', path: '/portfolio' })

export const revalidate = 60

export default async function PortfolioPage() {
  const caseStudies = await db.caseStudy.findMany({ where: { published: true }, orderBy: { displayOrder: 'asc' } })
  return <PortfolioExperience projects={caseStudies.map((project) => ({ id: project.id, slug: project.slug, title: project.title, clientName: project.clientName, industry: project.industry, thumbnailUrl: project.thumbnailUrl, overview: project.overview }))} />
}
