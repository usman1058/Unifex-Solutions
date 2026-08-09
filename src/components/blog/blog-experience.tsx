'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, BookOpen, ChevronRight, Search, Sparkles } from 'lucide-react'
import Link from 'next/link'
import { useSearchParams } from 'next/navigation'
import { useDeferredValue, useMemo, useState } from 'react'
import BlogHeroArtifact from '@/components/blog/blog-hero-artifact'

interface BlogPostCard {
  id: string
  slug: string
  title: string
  excerpt: string | null
  author: string
  coverImage: string | null
  readTime: number
  publishedAt: string
  category: { name: string; slug: string } | null
  tags: string[]
}

const fallbackImages = [
  'https://images.unsplash.com/photo-1633356122544-f134324a6cee?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1558494949-ef010cbdcc31?q=80&w=1400&auto=format&fit=crop',
  'https://images.unsplash.com/photo-1516321318423-f06f85e504b3?q=80&w=1400&auto=format&fit=crop',
]

function dateLabel(value: string) {
  return new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(value))
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function AdSlot({ label = 'Advertisement' }: { label?: string }) {
  return <div data-ad-slot className="flex min-h-20 items-center justify-center border-y border-dashed border-primary/15 bg-primary/[0.02] text-[9px] font-black uppercase tracking-[0.35em] text-on-surface/25">{label}</div>
}

export default function BlogExperience({ posts }: { posts: BlogPostCard[] }) {
  const reduceMotion = useReducedMotion()
  const searchParams = useSearchParams()
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState('all')
  const [tag, setTag] = useState(searchParams.get('tag') || '')
  const deferredQuery = useDeferredValue(query)
  const categories = useMemo(() => Array.from(new Map(posts.filter((post) => post.category).map((post) => [post.category!.slug, post.category!.name])).entries()), [posts])
  const filtered = useMemo(() => posts.filter((post) => {
    const matchesCategory = category === 'all' || post.category?.slug === category
    const matchesTag = !tag || post.tags.some((postTag) => slugify(postTag) === tag)
    const haystack = `${post.title} ${post.excerpt || ''} ${post.tags.join(' ')}`.toLowerCase()
    return matchesCategory && matchesTag && haystack.includes(deferredQuery.toLowerCase())
  }), [posts, category, tag, deferredQuery])
  const featured = filtered[0]
  const remaining = filtered.slice(1)

  return (
    <main className="min-h-screen overflow-hidden bg-background pt-24 text-on-surface">
      <section className="relative border-b border-primary/15 py-24 md:py-36"><div className="pointer-events-none absolute inset-0 bg-[radial-gradient(circle_at_78%_25%,rgba(213,255,0,0.14),transparent_24%),linear-gradient(115deg,transparent_0%,rgba(255,255,255,0.025)_50%,transparent_51%)]" /><div className="container relative mx-auto px-6 md:px-12"><motion.div initial={reduceMotion ? undefined : { opacity: 0, y: 30 }} animate={reduceMotion ? undefined : { opacity: 1, y: 0 }} transition={{ duration: 0.9 }}><div className="mb-12 flex items-center justify-between text-[10px] font-black uppercase tracking-[0.45em] text-primary"><span>Unifex / Journal</span><span className="hidden text-on-surface/30 md:block">Ideas with a useful afterlife</span></div><div className="grid max-w-7xl gap-14 lg:grid-cols-[1.05fr_0.95fr] lg:items-end"><h1 className="font-headline text-6xl font-black uppercase leading-[0.8] tracking-[-0.09em] md:text-[9.7rem]">Read<br /><span className="text-on-surface/25">what</span><br />moves.</h1><div><BlogHeroArtifact /><p className="mx-auto mt-8 max-w-md border-l border-primary/60 pl-6 text-base leading-relaxed text-on-surface/65 md:text-lg">Dispatches for people building digital products, protecting systems, and making better decisions with technology.</p><div className="mt-10 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-on-surface/35"><BookOpen className="h-4 w-4 text-primary" /> Engineering / security / growth</div></div></div></motion.div></div></section>

      <AdSlot label="Journal sponsor slot" />

      <section className="container mx-auto px-6 py-16 md:px-12 md:py-24"><div className="mb-10 flex flex-col gap-5 border-b border-outline-variant/15 pb-7 lg:flex-row lg:items-center lg:justify-between"><div className="flex flex-wrap gap-2"><button onClick={() => setCategory('all')} className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.25em] transition-colors ${category === 'all' ? 'bg-primary text-black' : 'border border-outline-variant/20 text-on-surface/45 hover:border-primary hover:text-primary'}`}>All dispatches</button>{categories.map(([slug, name]) => <button key={slug} onClick={() => setCategory(slug)} className={`px-4 py-2 text-[9px] font-black uppercase tracking-[0.25em] transition-colors ${category === slug ? 'bg-primary text-black' : 'border border-outline-variant/20 text-on-surface/45 hover:border-primary hover:text-primary'}`}>{name}</button>)}</div><label className="flex items-center gap-3 border border-primary/25 bg-[#151713] px-4 py-3 text-on-surface/65 shadow-[0_0_20px_rgba(213,255,0,0.05)] transition-colors focus-within:border-primary"><Search className="h-4 w-4 shrink-0 text-primary" /><input value={query} onChange={(event) => setQuery(event.target.value)} placeholder="Search the journal" className="w-full bg-transparent text-xs outline-none placeholder:text-on-surface/35 lg:w-56" /></label></div>

        {featured ? <><Link href={`/blog/${featured.slug}`} className="group mb-5 grid overflow-hidden border border-primary/35 bg-[#151713] transition-colors hover:border-primary lg:grid-cols-[1.1fr_0.9fr]"><div className="relative min-h-[330px] overflow-hidden bg-[#20231b]"><img src={featured.coverImage || fallbackImages[0]} alt={featured.title} className="h-full w-full object-cover opacity-70 grayscale transition-all duration-700 group-hover:scale-105 group-hover:opacity-100 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/10 to-transparent" /><span className="absolute left-6 top-6 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.3em] text-primary"><Sparkles className="h-3.5 w-3.5" /> Featured dispatch</span><span className="absolute bottom-6 left-6 text-[9px] font-black uppercase tracking-[0.25em] text-white/60">{featured.category?.name || 'Journal'} / {featured.readTime} min read</span></div><div className="flex flex-col justify-between p-7 md:p-12"><div><div className="mb-8 flex items-center justify-between text-[9px] font-black uppercase tracking-[0.25em] text-on-surface/35"><span>{dateLabel(featured.publishedAt)}</span><span>01 / Lead story</span></div><h2 className="max-w-2xl font-headline text-4xl font-black uppercase leading-[0.9] tracking-[-0.06em] transition-colors group-hover:text-primary md:text-6xl">{featured.title}</h2><p className="mt-7 max-w-lg text-sm leading-relaxed text-on-surface/55">{featured.excerpt || 'A considered dispatch from the Unifex studio.'}</p></div><div className="mt-12 flex items-center justify-between border-t border-outline-variant/15 pt-6 text-[9px] font-black uppercase tracking-[0.3em] text-primary"><span>Read the full dispatch</span><ArrowUpRight className="h-5 w-5 transition-transform group-hover:translate-x-1 group-hover:-translate-y-1" /></div></div></Link><AdSlot label="In-feed sponsor slot" /><div className="mt-5 grid gap-4 md:grid-cols-2 lg:grid-cols-3">{remaining.map((post, index) => <motion.article key={post.id} initial={{ opacity: 0, y: 25 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.2 }} transition={{ delay: index * 0.08 }} whileHover={reduceMotion ? undefined : { y: -7 }} className="group overflow-hidden border border-outline-variant/15 bg-surface transition-colors hover:border-primary/55"><Link href={`/blog/${post.slug}`}><div className="relative aspect-[1.45/1] overflow-hidden bg-[#171914]"><img src={post.coverImage || fallbackImages[(index + 1) % fallbackImages.length]} alt={post.title} loading="lazy" className="h-full w-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:scale-110 group-hover:opacity-90 group-hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-black/70 to-transparent" /><span className="absolute bottom-4 left-5 text-[9px] font-black uppercase tracking-[0.25em] text-primary">{post.category?.name || 'Journal'}</span></div><div className="p-6"><div className="mb-5 flex justify-between text-[9px] font-black uppercase tracking-[0.22em] text-on-surface/35"><span>{dateLabel(post.publishedAt)}</span><span>{post.readTime} min</span></div><h3 className="line-clamp-3 font-headline text-2xl font-black uppercase leading-[0.95] tracking-tight transition-colors group-hover:text-primary">{post.title}</h3><div className="mt-8 flex items-center gap-2 text-[9px] font-black uppercase tracking-[0.25em] text-primary">Read dispatch <ChevronRight className="h-4 w-4 transition-transform group-hover:translate-x-2" /></div></div></Link></motion.article>)}</div></> : <div className="border border-dashed border-primary/25 p-16 text-center text-sm text-on-surface/45">No dispatches match that search yet.</div>}
      </section>

      <section className="border-t border-primary/15 bg-primary py-24 md:py-36"><div className="container mx-auto px-6 text-center md:px-12"><Sparkles className="mx-auto mb-8 h-8 w-8 text-black" /><h2 className="mx-auto mb-10 max-w-5xl font-headline text-5xl font-black uppercase leading-[0.85] tracking-[-0.08em] text-black md:text-8xl">Keep the signal.<br /><span className="text-black/35">Lose the noise.</span></h2><Link href="/contact" className="inline-flex items-center gap-4 bg-black px-8 py-5 text-[10px] font-black uppercase tracking-[0.35em] text-white transition-colors hover:bg-white hover:text-black">Talk to the studio <ArrowUpRight className="h-4 w-4" /></Link></div></section>
    </main>
  )
}
