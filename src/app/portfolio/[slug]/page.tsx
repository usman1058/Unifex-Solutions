import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight } from 'lucide-react'
import { FadeIn } from '@/components/ui/motion-wrapper'
import { buildMetadata } from '@/lib/seo'

export const revalidate = 60

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = await db.caseStudy.findUnique({ where: { slug } })
  if (!study) return buildMetadata({ title: 'Case Study Not Found | Unifex', description: 'The requested Unifex case study could not be found.', path: `/portfolio/${slug}`, noIndex: true })
  return buildMetadata({ title: `${study.title} | Unifex Case Study`, description: study.overview, path: `/portfolio/${slug}`, image: study.thumbnailUrl })
}

export default async function PortfolioDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const study = await db.caseStudy.findUnique({
    where: { slug }
  })

  if (!study) {
    notFound()
  }

  const results: string[] = study.results ? JSON.parse(study.results) : []
  const techStack: string[] = study.techStack ? JSON.parse(study.techStack) : []
  const screenshots: string[] = study.screenshots ? JSON.parse(study.screenshots) : []

  return (
    <main className="min-h-screen pt-24 bg-background text-on-surface overflow-x-hidden">
      {/* Case Study Hero */}
      <section className="relative py-20 md:py-32 border-b border-outline-variant/10">
        <div className="container mx-auto px-6 md:px-12">
          <FadeIn direction="up">
            <Link href="/portfolio" className="inline-flex items-center gap-2 text-[10px] font-black tracking-[0.3em] text-on-surface/50 hover:text-primary transition-colors mb-10 uppercase">
              <ArrowLeft className="w-3.5 h-3.5" /> Back to Selected Impact
            </Link>
            
            <div className="max-w-5xl">
              <span className="text-[10px] font-black tracking-[0.5em] text-primary mb-6 block uppercase italic">
                {study.industry || 'ENGINEERING'}
              </span>
              <h1 className="text-4xl md:text-8xl font-headline font-black tracking-tighter leading-[0.85] mb-10 uppercase text-on-surface">
                {study.title}
              </h1>
              
              <p className="text-lg md:text-2xl font-light text-on-surface/70 max-w-3xl leading-relaxed uppercase border-l-4 border-primary/20 pl-6 md:pl-8">
                {study.overview}
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* Case Study Image Banner */}
      {study.thumbnailUrl && (
        <section className="w-full aspect-[21/9] max-h-[600px] overflow-hidden bg-surface-container-low border-b border-outline-variant/10">
          <img src={study.thumbnailUrl} alt={study.title} className="w-full h-full object-cover grayscale hover:grayscale-0 transition-all duration-700" />
        </section>
      )}

      {/* Case Study Details Grid */}
      <section className="py-20 md:py-32">
        <div className="container mx-auto px-6 md:px-12">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20">
            
            {/* Metadata Column */}
            <div className="lg:col-span-4 space-y-10 border-b lg:border-b-0 lg:border-r border-outline-variant/10 pb-10 lg:pb-0 pr-0 lg:pr-12">
              <div>
                <span className="text-[8px] font-black tracking-[0.4em] text-on-surface/50 uppercase block mb-2">Client</span>
                <p className="text-xl font-headline font-black uppercase text-on-surface">{study.clientName}</p>
              </div>

              {techStack.length > 0 && (
                <div>
                  <span className="text-[8px] font-black tracking-[0.4em] text-on-surface/50 uppercase block mb-3">Tech Stack</span>
                  <div className="flex flex-wrap gap-2">
                    {techStack.map((tech: string, i: number) => (
                      <span key={i} className="px-3 py-1.5 bg-surface-container-low border border-outline-variant/15 text-[10px] font-black tracking-widest text-primary uppercase">
                        {tech}
                      </span>
                    ))}
                  </div>
                </div>
              )}

              {results.length > 0 && (
                <div>
                  <span className="text-[8px] font-black tracking-[0.4em] text-primary uppercase block mb-4 italic">Impact Metrics</span>
                  <div className="space-y-3">
                    {results.map((res: string, i: number) => (
                      <div key={i} className="p-4 bg-surface-container-low border-l-2 border-primary">
                        <p className="text-xs font-black tracking-widest text-primary uppercase">{res}</p>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </div>

            {/* Content Column */}
            <div className="lg:col-span-8">
              <div className="text-[10px] font-black tracking-[0.4em] text-primary mb-8 uppercase italic">
                Case Study Briefing
              </div>
              
              <div 
                className="prose prose-invert prose-lg max-w-none 
                  prose-headings:font-headline prose-headings:font-black prose-headings:tracking-tighter prose-headings:uppercase
                  prose-p:text-on-surface/80 prose-p:font-light prose-p:leading-relaxed"
                dangerouslySetInnerHTML={{ __html: study.problem || study.solution || study.overview }} 
              />

              {screenshots.length > 0 && (
                <div className="mt-16 space-y-8">
                  <h3 className="text-xl font-headline font-black uppercase tracking-tighter text-on-surface">Architectural Captures</h3>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    {screenshots.map((url: string, i: number) => (
                      <div key={i} className="aspect-[4/3] bg-surface-container-low overflow-hidden border border-outline-variant/15">
                        <img src={url} alt={`Capture ${i + 1}`} className="w-full h-full object-cover hover:scale-105 transition-transform duration-500" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              <div className="mt-16 pt-10 border-t border-outline-variant/10">
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-4 px-12 py-5 bg-primary text-black font-black text-xs tracking-[0.4em] uppercase hover:bg-white transition-colors duration-500 architectural-glow"
                >
                  COMMISSION SIMILAR ARCHITECTURE <ArrowUpRight className="w-4 h-4" />
                </Link>
              </div>
            </div>

          </div>
        </div>
      </section>
    </main>
  )
}
