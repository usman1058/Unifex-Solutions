import { db } from '@/lib/db'
import Link from 'next/link'
import { ArrowUpRight, Check, Fingerprint, MoveRight, Sparkles } from 'lucide-react'
import { FadeIn, StaggerContainer } from '@/components/ui/motion-wrapper'
import ServiceVisual from '@/components/services/service-visual'
import ServicesHeroArtifact from '@/components/services/services-hero-artifact'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({ title: 'Software Development & Cybersecurity Services | Unifex', description: 'Explore Unifex services across software engineering, cybersecurity, digital products, websites, and growth systems.', path: '/services' })

export const revalidate = 60

function parseList(value: string | null) {
  if (!value) return []
  try {
    const parsed = JSON.parse(value)
    return Array.isArray(parsed) ? parsed.filter(Boolean) : []
  } catch {
    return []
  }
}

function pricingLabel(value: string | null) {
  return value?.trim() || 'Custom scope'
}

export default async function ServicesPage() {
  const services = await db.service.findMany({
    where: { published: true },
    orderBy: [{ featured: 'desc' }, { displayOrder: 'asc' }],
  })

  const featured = services.find((service) => service.featured) || services[0]
  const standard = services.filter((service) => service.id !== featured?.id)

  return (
    <main className="min-h-screen overflow-hidden bg-background text-on-surface pt-24">
      <section className="relative border-b border-outline-variant/15 py-24 md:py-36">
        <div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_82%_20%,rgba(213,255,0,0.14),transparent_30%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.025)_48%,transparent_49%)]" />
        <div className="container relative z-10 mx-auto px-6 md:px-12">
          <FadeIn>
            <div className="mb-10 flex items-center justify-between gap-6 text-[10px] font-black uppercase tracking-[0.45em] text-primary">
              <span>Unifex / Capabilities</span>
              <span className="hidden text-on-surface/35 md:block">01 — 04 / Build with intent</span>
            </div>
            <div className="grid max-w-7xl gap-12 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
              <h1 className="font-headline text-6xl font-black uppercase leading-[0.82] tracking-[-0.08em] md:text-[9.5rem]">
                The work<br /><span className="text-on-surface/25">behind</span><br />the edge.
              </h1>
              <div><ServicesHeroArtifact /><p className="mx-auto mt-8 max-w-sm border-l border-primary/50 pl-6 text-sm font-medium leading-relaxed text-on-surface/70 md:text-base">Strategy, design, engineering, and growth assembled around the outcome you need. Pick a capability, see the shape of the engagement, then start with a real brief.</p></div>
            </div>
          </FadeIn>
        </div>
      </section>

      <section className="container mx-auto px-6 py-16 md:px-12 md:py-24">
        <div className="mb-10 flex flex-wrap items-end justify-between gap-5">
          <div>
            <p className="mb-3 text-[10px] font-black uppercase tracking-[0.4em] text-primary">Choose your launch lane</p>
            <h2 className="font-headline text-4xl font-black uppercase tracking-[-0.06em] md:text-6xl">Built to be understood.</h2>
          </div>
          <Link href="/order" className="group inline-flex items-center gap-3 border-b border-primary pb-3 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface hover:text-primary">
            Start a project <MoveRight className="h-4 w-4 transition-transform group-hover:translate-x-2" />
          </Link>
        </div>

        {services.length === 0 ? (
          <div className="border border-outline-variant/20 p-16 text-center text-sm text-on-surface/50">New capabilities are being prepared.</div>
        ) : (
          <>
            {featured && (
              <FadeIn>
                <Link href={`/services/${featured.slug}`} className="group relative mb-5 grid overflow-hidden border border-primary/35 bg-surface-container-low p-7 transition-colors hover:bg-primary hover:text-black md:grid-cols-[0.9fr_1.1fr] md:p-12">
                  <div className="absolute right-8 top-8 text-[10px] font-black uppercase tracking-[0.3em] text-primary group-hover:text-black">Featured capability</div>
                  <div className="relative flex min-h-[340px] flex-col justify-between">
                    <div className="mb-8 md:hidden"><ServiceVisual title={featured.title} imageUrl={featured.imageUrl} index={0} compact /></div>
                    <div className="mb-8 hidden md:block"><ServiceVisual title={featured.title} imageUrl={featured.imageUrl} index={0} compact /></div>
                    <div className="flex items-start justify-between pt-10 md:pt-0">
                      <span className="text-7xl font-headline font-black italic tracking-[-0.1em] text-on-surface/10 transition-colors group-hover:text-black/15">01</span>
                      <Sparkles className="h-6 w-6 text-primary group-hover:text-black" />
                    </div>
                    <div>
                      <p className="mb-4 text-[10px] font-black uppercase tracking-[0.35em] text-primary group-hover:text-black">Flagship route</p>
                      <h3 className="max-w-xl font-headline text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] md:text-7xl">{featured.title}</h3>
                    </div>
                  </div>
                  <div className="flex flex-col justify-end border-t border-outline-variant/15 pt-8 md:border-l md:border-t-0 md:pl-12 md:pt-0">
                    <p className="mb-8 max-w-lg text-base leading-relaxed text-on-surface/70 group-hover:text-black/70">{featured.description}</p>
                    <div className="mb-8 grid gap-3 sm:grid-cols-2">
                      {parseList(featured.features).slice(0, 4).map((feature) => <span key={feature} className="flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.15em]"><Check className="h-3.5 w-3.5 text-primary group-hover:text-black" />{feature}</span>)}
                    </div>
                    <div className="flex items-end justify-between border-t border-outline-variant/15 pt-6">
                      <span><span className="mb-2 block text-[9px] font-black uppercase tracking-[0.25em] opacity-50">Investment</span><strong className="font-headline text-2xl font-black uppercase">{pricingLabel(featured.pricing)}</strong></span>
                      <span className="flex h-12 w-12 items-center justify-center rounded-full bg-primary text-black transition-transform group-hover:rotate-45"><ArrowUpRight className="h-5 w-5" /></span>
                    </div>
                  </div>
                </Link>
              </FadeIn>
            )}

            <StaggerContainer className="grid gap-5 md:grid-cols-2">
              {standard.map((service, index) => {
                const features = parseList(service.features)
                return (
                  <Link key={service.id} href={`/services/${service.slug}`} className="group relative flex min-h-[390px] flex-col justify-between overflow-hidden border border-outline-variant/15 bg-surface p-7 transition-all duration-500 hover:-translate-y-2 hover:border-primary hover:bg-surface-container-high md:p-10">
                    <div className="mb-7"><ServiceVisual title={service.title} imageUrl={service.imageUrl} index={index + 1} compact /></div>
                    <div className="absolute -right-8 -top-10 font-headline text-[13rem] font-black italic leading-none text-on-surface/[0.025] transition-colors group-hover:text-primary/[0.08]">{String(index + 2).padStart(2, '0')}</div>
                    <div className="relative z-10 flex items-start justify-between"><span className="text-[10px] font-black uppercase tracking-[0.35em] text-primary">0{index + 2} / Capability</span><ArrowUpRight className="h-5 w-5 transition-transform duration-500 group-hover:translate-x-1 group-hover:-translate-y-1 group-hover:text-primary" /></div>
                    <div className="relative z-10"><h3 className="mb-5 max-w-md font-headline text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] transition-colors group-hover:text-primary md:text-5xl">{service.title}</h3><p className="max-w-md text-sm leading-relaxed text-on-surface/60">{service.description}</p></div>
                    <div className="relative z-10 flex items-end justify-between gap-5 border-t border-outline-variant/15 pt-6"><div><span className="mb-2 block text-[9px] font-black uppercase tracking-[0.25em] text-on-surface/40">From / scope</span><span className="font-headline text-xl font-black uppercase">{pricingLabel(service.pricing)}</span></div><span className="text-right text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/40">{features.length || 0} deliverables<br />view details</span></div>
                  </Link>
                )
              })}
            </StaggerContainer>
          </>
        )}
      </section>

      <section className="border-y border-outline-variant/15 bg-surface-container-low py-20 md:py-28">
        <div className="container mx-auto grid gap-12 px-6 md:px-12 lg:grid-cols-[0.8fr_1.2fr]">
          <div><p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">The engagement protocol</p><h2 className="font-headline text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] md:text-7xl">No mystery.<br /><span className="text-on-surface/30">Just momentum.</span></h2></div>
          <div className="grid gap-px bg-outline-variant/15 sm:grid-cols-3">
            {[['01', 'Apply', 'Choose a capability and send the context that matters.'], ['02', 'Get selected', 'We review the brief, confirm fit, and align the scope.'], ['03', 'Activate', 'Upload your receipt and move into production with a reference number.']].map(([number, title, copy]) => <div key={number} className="bg-background p-7"><span className="mb-12 block text-xs font-black text-primary">{number}</span><h3 className="mb-4 font-headline text-2xl font-black uppercase tracking-tight">{title}</h3><p className="text-sm leading-relaxed text-on-surface/55">{copy}</p></div>)}
          </div>
        </div>
      </section>

      <section className="container mx-auto px-6 py-24 text-center md:px-12 md:py-36"><Fingerprint className="mx-auto mb-7 h-8 w-8 text-primary" /><p className="mb-5 text-[10px] font-black uppercase tracking-[0.45em] text-primary">Have a different brief?</p><h2 className="mx-auto mb-10 max-w-4xl font-headline text-5xl font-black uppercase leading-[0.88] tracking-[-0.07em] md:text-8xl">Bring the problem.<br /><span className="text-on-surface/30">We&apos;ll map the move.</span></h2><Link href="/order" className="inline-flex items-center gap-4 bg-primary px-8 py-5 text-[10px] font-black uppercase tracking-[0.35em] text-black transition-colors hover:bg-white">Open an engagement <ArrowUpRight className="h-4 w-4" /></Link></section>
    </main>
  )
}
