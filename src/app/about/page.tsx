import { db } from '@/lib/db'
import { buildMetadata } from '@/lib/seo'
import { isDemoTeamMember } from '@/lib/published-content'
import AboutExperience from '@/components/about/about-experience'

export const metadata = buildMetadata({ title: 'About Unifex Solutions | Our Engineering Approach', description: 'Learn about Unifex Solutions, our principles, and our approach to building secure, high-performance digital systems.', path: '/about' })
export const revalidate = 60

export default async function AboutPage() {
  const teamMembers = (await db.teamMember.findMany({ where: { published: true }, orderBy: { displayOrder: 'asc' } })).filter((member) => !isDemoTeamMember(member.name))
  return <AboutExperience teamMembers={teamMembers.map((member) => ({
    id: member.id,
    name: member.name,
    role: member.role,
    bio: member.bio,
    imageUrl: member.imageUrl,
    linkedinUrl: member.linkedinUrl,
    githubUrl: member.githubUrl,
  }))} />
}
