import { db } from '@/lib/db'
import OrderFlow from '@/components/order/order-flow'
import OrderBeacon from '@/components/order/order-beacon'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { buildMetadata } from '@/lib/seo'

export const metadata = buildMetadata({ title: 'Start a Software Project | Unifex Solutions', description: 'Choose a service, submit your project brief, and start a guided engagement with Unifex Solutions.', path: '/order', noIndex: true })

export const revalidate = 60

export default async function OrderPage({ searchParams }: { searchParams?: Promise<{ service?: string }> }) {
  const query = searchParams ? await searchParams : {}
  const services = await db.service.findMany({
    where: { published: true },
    orderBy: { displayOrder: 'asc' },
    select: { id: true, slug: true, title: true, description: true, pricing: true },
  })

  const bankSettings = await db.appSetting.findMany({
    where: { category: 'bank' },
  })
  const bankDetails: Record<string, string> = {}
  for (const s of bankSettings) bankDetails[s.key] = s.value

  return (
    <main className="bg-background text-on-surface overflow-x-hidden min-h-screen pt-24">
      <section className="relative py-24 md:py-32 overflow-hidden">
        <div className="container mx-auto px-6 md:px-12 relative z-10">
          <div className="grid max-w-7xl gap-14 lg:grid-cols-[1.1fr_0.9fr] lg:items-end">
          <div className="max-w-5xl">
            <span className="text-[10px] font-black tracking-[0.6em] text-primary mb-8 uppercase italic block">
              Engagement // Start A Project
            </span>
            <h1 className="font-headline text-5xl md:text-8xl font-black tracking-tighter leading-[0.85] mb-12 uppercase text-on-surface">
              DEPLOY <br /> THE <span className="text-on-surface/50 italic">UNIT.</span>
            </h1>
            <p className="text-lg md:text-2xl font-medium text-on-surface/80 max-w-3xl leading-relaxed uppercase tracking-tight border-l-4 border-primary/20 pl-8 md:pl-10">
              SELECT A SERVICE, SHARE YOUR BRIEF, AND WE TAKE IT FROM THERE. YOUR REFERENCE NUMBER IS YOUR TRACKING ENGINE.
            </p>
          </div>
          <div><OrderBeacon /><Link href="/order/status" className="group mx-auto flex max-w-sm items-center justify-between border-b border-primary/25 pb-4 text-[9px] font-black uppercase tracking-[0.25em] text-on-surface/45 hover:text-primary">Already submitted? Track your order <ArrowUpRight className="h-4 w-4 transition-transform group-hover:-translate-y-1 group-hover:translate-x-1" /></Link></div>
          </div>
        </div>
      </section>

      <section className="border-y border-primary/15 bg-[#10110e] py-12"><div className="container mx-auto grid gap-px bg-white/[0.08] px-6 md:grid-cols-3 md:px-12">{[['01', 'Choose', 'Select the capability that matches the problem.'], ['02', 'Brief', 'Give the studio enough context to make a useful decision.'], ['03', 'Activate', 'Submit payment proof and receive your tracking reference.']].map(([number, title, copy]) => <div key={number} className="bg-[#10110e] p-6"><span className="font-headline text-3xl font-black italic text-primary/50">{number}</span><h2 className="mt-6 font-headline text-2xl font-black uppercase text-white">{title}</h2><p className="mt-2 text-xs leading-relaxed text-white/40">{copy}</p></div>)}</div></section>

      <section className="py-20 md:py-28 border-t border-outline-variant/10">
        <div className="container mx-auto px-6 md:px-12">
          <OrderFlow services={services} bankDetails={bankDetails} initialServiceSlug={query.service} />
        </div>
      </section>
    </main>
  )
}
