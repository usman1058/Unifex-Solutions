import { db } from '@/lib/db'
import { notFound } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowUpRight, Check, Clock3, Layers, ShieldCheck } from 'lucide-react'
import { FadeIn } from '@/components/ui/motion-wrapper'
import ServiceVisual from '@/components/services/service-visual'
import ServiceDetailEnhancements from '@/components/services/service-detail-enhancements'
import { buildMetadata, siteUrl } from '@/lib/seo'
import { sanitizeCmsHtml } from '@/lib/sanitize-html'
import { getServiceCopy } from '@/lib/service-copy'

export const revalidate = 60

function parseList(value: string | null) { try { const parsed = value ? JSON.parse(value) : []; return Array.isArray(parsed) ? parsed.filter(Boolean) : [] } catch { return [] } }
function parsePricing(value: string | null) { return value?.trim() || 'Custom scope' }

export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await db.service.findUnique({ where: { slug, published: true } })
  if (!service) return buildMetadata({ title: 'Service Not Found | Unifex', description: 'The requested Unifex service could not be found.', path: `/services/${slug}`, noIndex: true })
  const copy = getServiceCopy(service.slug)
  return buildMetadata({ title: `${service.title} | Unifex Solutions`, description: copy?.description || service.description, path: `/services/${slug}`, image: service.imageUrl })
}

export default async function ServiceDetailPage({ params }: { params: Promise<{ slug: string }> }) {
  const { slug } = await params
  const service = await db.service.findUnique({ where: { slug, published: true } })
  if (!service) notFound()
  const copy = getServiceCopy(service.slug)
  const features: string[] = parseList(service.features)
  const techStack: string[] = parseList(service.techStack)
  const process: string[] = parseList(service.process)
  const faqs: Array<{ question?: string; answer?: string }> = parseList(service.faqs)
  const structuredData = {
    '@context': 'https://schema.org',
    '@graph': [
      { '@type': 'Service', name: service.title, serviceType: service.title, description: copy?.description || service.description, url: `${siteUrl}/services/${service.slug}`, provider: { '@id': `${siteUrl}/#organization` } },
      { '@type': 'BreadcrumbList', itemListElement: [
        { '@type': 'ListItem', position: 1, name: 'Home', item: siteUrl },
        { '@type': 'ListItem', position: 2, name: 'Services', item: `${siteUrl}/services` },
        { '@type': 'ListItem', position: 3, name: service.title, item: `${siteUrl}/services/${service.slug}` },
      ] },
    ],
  }

  return (
    <main className="min-h-screen overflow-hidden bg-background pt-24 text-on-surface">
      <script type="application/ld+json" dangerouslySetInnerHTML={{ __html: JSON.stringify(structuredData).replace(/</g, '\\u003c') }} />
      <section className="relative border-b border-outline-variant/15 py-16 md:py-24"><div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_30%,rgba(255,184,123,0.13),transparent_28%)]" /><div className="container relative mx-auto px-6 md:px-12"><FadeIn><Link href="/services" className="mb-12 inline-flex min-h-11 items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-on-surface/80 transition-colors hover:text-primary md:mb-16"><ArrowLeft className="h-4 w-4" /> All capabilities</Link><div className="grid max-w-7xl gap-10 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"><div><p className="mb-7 text-xs font-bold uppercase tracking-[0.18em] text-primary">Capability / {service.slug}</p><h1 className="max-w-5xl break-words font-headline text-5xl font-black uppercase leading-[0.92] tracking-[-0.06em] sm:text-6xl md:text-[8rem]">{service.title}</h1></div><ServiceVisual title={service.title} imageUrl={service.imageUrl} index={service.displayOrder} /></div><p className="mt-10 max-w-3xl border-l border-primary/50 pl-6 text-base leading-relaxed text-on-surface/85 md:mt-12 md:text-lg">{copy?.description || service.description}</p></FadeIn></div></section>

      <section className="container mx-auto grid gap-14 px-6 py-16 md:px-12 md:py-24 lg:grid-cols-[1.15fr_0.85fr]">
        <div><div className="mb-6 flex items-center gap-3 text-[11px] font-black uppercase tracking-[0.3em] text-primary"><Layers className="h-4 w-4" /> What gets built</div><div className="prose prose-invert max-w-none prose-headings:font-headline prose-headings:uppercase prose-headings:tracking-tight prose-p:leading-relaxed prose-p:text-on-surface/80" dangerouslySetInnerHTML={{ __html: sanitizeCmsHtml(copy?.content || service.content) }} /><div className="mt-14 grid gap-3 sm:grid-cols-2">{features.map((feature) => <div key={feature} className="border border-outline-variant/15 bg-surface p-5 text-sm font-medium leading-snug transition-colors hover:border-primary"><Check className="mb-8 h-4 w-4 text-primary" /><span>{feature}</span></div>)}</div></div>
        <aside className="lg:sticky lg:top-32 lg:self-start"><div className="border border-primary/40 bg-surface-container-low p-7 md:p-9"><div className="mb-10 flex items-start justify-between"><div><p className="mb-3 text-xs font-bold uppercase tracking-[0.16em] text-on-surface/75">Engagement investment</p><p className="font-headline text-4xl font-black uppercase tracking-tight text-primary">{parsePricing(service.pricing)}</p></div><ShieldCheck className="h-6 w-6 text-primary" /></div><p className="mb-8 text-base leading-relaxed text-on-surface/80">Start with a short brief. We&apos;ll validate the fit, confirm the scope, and guide you through payment after selection.</p><Link href={`/order?service=${service.slug}`} className="group flex min-h-12 items-center justify-between gap-3 bg-primary px-6 py-4 text-xs font-bold uppercase tracking-[0.12em] text-black transition-colors hover:bg-white">Apply for this service <ArrowUpRight className="h-4 w-4 transition-transform group-hover:rotate-45" /></Link><div className="mt-6 flex items-center gap-3 text-xs font-bold uppercase tracking-[0.12em] text-on-surface/70"><Clock3 className="h-4 w-4 text-primary" /> Brief to review / 1–2 business days</div></div></aside>
      </section>

      <ServiceDetailEnhancements process={process} techStack={techStack} faqs={faqs} featureCount={features.length} serviceTitle={service.title} />

      <section className="border-t border-outline-variant/15 px-6 py-24 text-center md:py-32"><p className="mb-6 text-xs font-bold uppercase tracking-[0.16em] text-primary">Ready when you are</p><h2 className="mx-auto mb-10 max-w-4xl break-words font-headline text-3xl font-black uppercase leading-[0.95] tracking-[-0.05em] sm:text-4xl md:text-8xl">Turn this capability<br /><span className="text-on-surface/30">into momentum.</span></h2><Link href={`/order?service=${service.slug}`} className="inline-flex min-h-11 items-center gap-3 border-b border-primary pb-3 text-xs font-bold uppercase tracking-[0.12em] hover:text-primary">Start the application <ArrowUpRight aria-hidden="true" className="h-4 w-4 shrink-0" /></Link></section>
    </main>
  )
}
