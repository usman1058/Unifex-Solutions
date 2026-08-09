import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { FadeIn, StaggerContainer, KineticBorder } from '@/components/ui/motion-wrapper'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({ title: 'FAQ | Software Development, Security & Consulting | Unifex', description: 'Answers to common questions about Unifex software development, cybersecurity, digital products, and consulting services.', path: '/faq' })

export const revalidate = 60

export default async function FAQPage() {
  const faqs = await db.fAQ.findMany({
    where: { published: true },
    orderBy: { displayOrder: 'asc' },
    include: { category: true }
  })

  // Group FAQs by category
  const groupedFaqs: Record<string, typeof faqs> = {}
  faqs.forEach(faq => {
    const catName = faq.category?.name || 'General Operations'
    if (!groupedFaqs[catName]) {
      groupedFaqs[catName] = []
    }
    groupedFaqs[catName].push(faq)
  })

  return (
    <main className="bg-background text-on-surface overflow-x-hidden min-h-screen pt-24">
      {/* FAQ Hero */}
      <section className="relative py-28 md:py-40 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <FadeIn direction="up">
            <div className="max-w-6xl">
              <span className="text-[10px] font-black tracking-[0.6em] text-primary mb-8 uppercase italic block">
                FAQ // Need Help?
              </span>
              <h1 className="font-headline text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase text-on-surface">
                FREQUENTLY <br />
                <span className="text-on-surface/50 italic">ASKED QUESTIONS.</span>
              </h1>
              <p className="text-lg md:text-2xl font-medium text-on-surface/80 max-w-4xl leading-relaxed uppercase tracking-tight border-l-4 border-primary/20 pl-8 md:pl-10">
                EVERYTHING YOU NEED TO KNOW ABOUT HOW WE WORK, OUR PROCESS, AND WHAT TO EXPECT.
              </p>
            </div>
          </FadeIn>
        </div>
      </section>

      {/* FAQ Substrate List */}
      <section className="pb-28 md:pb-40 border-t border-outline-variant/10 pt-20">
        <div className="container mx-auto px-6 md:px-12">
          {Object.keys(groupedFaqs).length === 0 ? (
            <div className="border border-outline-variant/20 p-16 text-center bg-surface-container-low">
              <h3 className="font-headline text-2xl font-black uppercase text-on-surface/40 mb-3">NO FAQs LISTED YET</h3>
              <p className="text-xs font-label tracking-widest text-on-surface/30 uppercase">Operational documentation is being compiled.</p>
            </div>
          ) : (
            <div className="space-y-24">
              {Object.entries(groupedFaqs).map(([category, questions], catIdx) => (
                <div key={category} className="space-y-8">
                  <FadeIn direction="up">
                    <div className="flex items-center gap-4 border-b border-outline-variant/10 pb-4">
                      <span className="text-[10px] font-black tracking-[0.4em] text-primary uppercase italic">
                        0{catIdx + 1} // {category}
                      </span>
                    </div>
                  </FadeIn>

                  <StaggerContainer className="grid grid-cols-1 md:grid-cols-2 gap-px bg-outline-variant/10 border border-outline-variant/10">
                    {questions.map((faq) => (
                      <KineticBorder key={faq.id}>
                        <div 
                          className="bg-surface p-10 md:p-14 hover:bg-surface-container-high transition-colors group h-full flex flex-col justify-between"
                        >
                          <div>
                            <h3 className="text-xl md:text-2xl font-headline font-black tracking-tighter uppercase mb-6 text-on-surface group-hover:text-primary transition-colors">
                              {faq.question}
                            </h3>
                            <p className="text-xs font-medium text-on-surface/70 leading-relaxed uppercase tracking-tight">
                              {faq.answer}
                            </p>
                          </div>
                        </div>
                      </KineticBorder>
                    ))}
                  </StaggerContainer>
                </div>
              ))}
            </div>
          )}
        </div>
      </section>

      {/* FAQ CTA */}
      <section className="py-28 md:py-36 border-t border-outline-variant/10 bg-primary relative overflow-hidden group">
        <div className="container mx-auto px-6 md:px-12 text-center relative z-10">
          <FadeIn direction="up">
            <h2 className="text-4xl md:text-7xl font-headline font-black tracking-tighter text-on-primary-fixed leading-none mb-12 uppercase italic">
              HAVE A <br /><span className="text-black/40">QUESTION?</span>
            </h2>
            <Link 
              href="/contact" 
              className="px-12 py-6 bg-black text-white hover:bg-white hover:text-black transition-all duration-500 text-[10px] font-black tracking-[0.5em] uppercase architectural-glow inline-flex items-center gap-4 mx-auto"
            >
              GET IN TOUCH <ArrowUpRight className="w-4 h-4" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}
