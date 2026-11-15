'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, Clock3, Copy, Facebook, Instagram, Link2, Linkedin, List, Share2 } from 'lucide-react'
import Link from 'next/link'
import Script from 'next/script'
import { useEffect, useRef, useState } from 'react'

interface ArticleProps {
  title: string
  content: string
  excerpt: string | null
  author: string
  coverImage: string | null
  readTime: number
  publishedAt: string
  category: string
  tags: string[]
  sharePlacement: 'hero' | 'sidebar' | 'after-excerpt' | 'after-content'
}

interface RelatedPost {
  id: string
  slug: string
  title: string
  coverImage: string | null
  readTime: number
  category: string
}

function AdSlot({ label }: { label: string }) {
  return <div data-ad-slot className="my-12 flex min-h-24 items-center justify-center border-y border-dashed border-primary/35 bg-[#151713] px-4 text-center text-xs font-bold uppercase tracking-[0.2em] text-on-surface/70">{label}</div>
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function ShareRail({ copied, onShare }: { copied: boolean; onShare: (network: 'facebook' | 'instagram' | 'linkedin' | 'copy') => void }) {
  return <div className="flex items-center gap-2"><span className="mr-2 text-xs font-black uppercase tracking-[0.15em] text-on-surface/70">Share</span><button type="button" aria-label="Share on Facebook" onClick={() => onShare('facebook')} className="flex h-11 w-11 items-center justify-center border border-outline-variant/35 text-on-surface/75 transition-colors hover:border-primary hover:bg-primary hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Facebook aria-hidden="true" className="h-4 w-4" /></button><button type="button" aria-label="Share on Instagram" onClick={() => onShare('instagram')} className="flex h-11 w-11 items-center justify-center border border-outline-variant/35 text-on-surface/75 transition-colors hover:border-primary hover:bg-primary hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Instagram aria-hidden="true" className="h-4 w-4" /></button><button type="button" aria-label="Share on LinkedIn" onClick={() => onShare('linkedin')} className="flex h-11 w-11 items-center justify-center border border-outline-variant/35 text-on-surface/75 transition-colors hover:border-primary hover:bg-primary hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Linkedin aria-hidden="true" className="h-4 w-4" /></button><button type="button" aria-label={copied ? 'Article link copied' : 'Copy article link'} onClick={() => onShare('copy')} className="flex h-11 w-11 items-center justify-center border border-outline-variant/35 text-on-surface/75 transition-colors hover:border-primary hover:bg-primary hover:text-black focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary">{copied ? <Check aria-hidden="true" className="h-4 w-4" /> : <Link2 aria-hidden="true" className="h-4 w-4" />}</button></div>
}

export default function BlogArticleExperience({ article, relatedPosts }: { article: ArticleProps; relatedPosts: RelatedPost[] }) {
  const reduceMotion = useReducedMotion()
  const articleRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [headings, setHeadings] = useState<Array<{ id: string; text: string }>>([])
  const [copied, setCopied] = useState(false)
  const [adsAllowed, setAdsAllowed] = useState(false)

  useEffect(() => {
    const syncConsent = () => setAdsAllowed(window.localStorage.getItem('unifex_consent') === 'accepted')
    syncConsent()
    window.addEventListener('unifex:consent', syncConsent)
    return () => window.removeEventListener('unifex:consent', syncConsent)
  }, [])

  useEffect(() => {
    const root = articleRef.current
    if (!root) return
    const nodes = Array.from(root.querySelectorAll('h2, h3'))
    setHeadings(nodes.map((node, index) => {
      const id = slugify(node.textContent || `section-${index}`) || `section-${index}`
      node.id = id
      return { id, text: node.textContent || '' }
    }))
    const updateProgress = () => {
      const top = root.getBoundingClientRect().top + window.scrollY
      const total = Math.max(1, root.offsetHeight - window.innerHeight)
      setProgress(Math.min(100, Math.max(0, ((window.scrollY - top + 120) / total) * 100)))
    }
    updateProgress()
    window.addEventListener('scroll', updateProgress, { passive: true })
    return () => window.removeEventListener('scroll', updateProgress)
  }, [article.content])

  const handleShare = async (network: 'facebook' | 'instagram' | 'linkedin' | 'copy') => {
    const url = window.location.href
    if (network === 'facebook') {
      window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer')
      return
    }
    if (network === 'linkedin') {
      window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer')
      return
    }
    if (network === 'instagram' && navigator.share) {
      await navigator.share({ title: article.title, url })
      return
    }
    if (!navigator.clipboard?.writeText) return
    await navigator.clipboard.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const shareRail = <ShareRail copied={copied} onShare={handleShare} />

  return <>
    {adsAllowed && <Script
      async
      src="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js?client=ca-pub-9704794346591870"
      crossOrigin="anonymous"
      strategy="afterInteractive"
    />}
    <motion.div className="fixed left-0 right-0 top-24 z-30 h-1 origin-left bg-primary shadow-[0_0_18px_rgba(255,184,123,0.7)]" style={{ scaleX: progress / 100 }} />
    <section className="border-b border-primary/15 py-16 md:py-24"><div className="container mx-auto px-6 md:px-12"><div className="grid min-w-0 grid-cols-1 max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"><div><Link href="/blog" className="mb-12 inline-flex min-h-11 items-center gap-3 text-xs font-bold uppercase tracking-[0.16em] text-on-surface/75 transition-colors hover:text-primary">← Back to blogs</Link><p className="mb-7 text-xs font-bold uppercase tracking-[0.2em] text-primary">{article.category} / Long read</p><h1 className="blog-article-title max-w-5xl min-w-0 font-headline font-black uppercase leading-[0.9] tracking-[-0.075em] sm:text-7xl md:text-8xl">{article.title}</h1><div className="mt-10 flex flex-wrap items-center gap-4 border-t border-outline-variant/45 pt-6 text-sm font-bold uppercase tracking-[0.1em] text-on-surface/85 sm:gap-6"><span>By {article.author || 'Editorial team'}</span><span>{new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(article.publishedAt))}</span><span className="flex items-center gap-2 text-primary"><Clock3 className="h-4 w-4" /> {article.readTime} min read</span></div>{article.sharePlacement === 'hero' && <div className="mt-8">{shareRail}</div>}</div>{article.coverImage ? <div className="relative aspect-[1.15/1] overflow-hidden border border-primary/30 bg-[#171914]"><img src={article.coverImage} alt={article.title} className="h-full w-full object-cover opacity-75 grayscale transition-all duration-1000 hover:scale-105 hover:opacity-100 hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" /><span className="absolute bottom-5 left-5 text-[9px] font-black uppercase tracking-[0.3em] text-primary">Main image / field notes</span></div> : <div className="relative flex aspect-[1.15/1] items-center justify-center overflow-hidden border border-primary/40 bg-[#11110f]"><div aria-hidden="true" className="absolute inset-0 bg-[radial-gradient(ellipse_at_30%_25%,rgba(255,184,123,0.2),transparent_55%)]" /><div aria-hidden="true" className="absolute -right-7 -top-12 font-headline text-[13rem] font-black italic leading-none text-primary/[0.08]">01</div><div aria-hidden="true" className="absolute inset-x-0 top-1/2 h-px bg-gradient-to-r from-transparent via-primary/50 to-transparent" /><div className="relative mx-6 w-full max-w-md border border-primary/35 bg-black/50 p-7 backdrop-blur-sm sm:p-10"><p className="mb-5 text-xs font-black uppercase tracking-[0.25em] text-primary">Unifex / Field notes</p><p className="font-headline text-4xl font-black uppercase leading-[0.92] tracking-[-0.06em] text-white sm:text-5xl">Signal<br />over noise.</p><p className="mt-6 border-t border-white/20 pt-4 text-xs font-bold uppercase tracking-[0.16em] text-on-surface/75">Engineering / Product / Growth</p></div></div>}</div></div></section>

    <section className="container mx-auto px-6 py-16 md:px-12 md:py-24"><div className="grid gap-14 lg:grid-cols-[0.3fr_0.7fr] lg:gap-20"><aside className="space-y-8 lg:sticky lg:top-36 lg:self-start"><div className="rounded-sm border border-primary/45 bg-[#191a16] p-6 shadow-[0_12px_40px_rgba(0,0,0,0.22)]"><p className="mb-4 flex items-center gap-3 text-sm font-black uppercase tracking-[0.18em] text-primary"><List aria-hidden="true" className="h-5 w-5" /> On this page</p>{headings.length > 0 ? <nav aria-label="Article sections" className="space-y-1">{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className="flex min-h-11 items-center rounded-sm border-l-2 border-transparent px-3 py-2 text-base leading-snug text-on-surface/85 transition-colors hover:border-primary hover:bg-white/[0.04] hover:text-white focus-visible:border-primary focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary">{heading.text}</a>)}</nav> : <p className="text-sm leading-relaxed text-on-surface/75">A focused dispatch from the studio.</p>}</div>{article.tags.length > 0 && <div className="hidden rounded-sm border border-white/20 bg-[#191a16] p-6 lg:block"><h2 className="mb-2 text-sm font-black uppercase tracking-[0.18em] text-primary">Explore topics</h2><p className="mb-4 text-sm leading-relaxed text-on-surface/75">Browse more posts by topic.</p><nav aria-label="Article topics" className="flex flex-wrap gap-2">{article.tags.map((tag) => <Link key={tag} href={`/blog?tag=${encodeURIComponent(slugify(tag))}`} className="inline-flex min-h-11 items-center rounded-full border border-white/25 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-on-surface/90 transition-colors hover:border-primary hover:bg-primary hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#191a16]">{tag}</Link>)}</nav></div>}{article.sharePlacement === 'sidebar' && <div className="hidden border border-outline-variant/15 bg-surface p-6 lg:block">{shareRail}</div>}<div className="hidden lg:block"><AdSlot label="Sidebar sponsor slot" /></div></aside><article ref={articleRef} className="min-w-0"><div className="mb-12 border-l-2 border-primary pl-5 text-xl font-medium leading-relaxed text-on-surface/90 sm:pl-7 sm:text-2xl">{article.excerpt}</div>{article.sharePlacement === 'after-excerpt' && <div className="mb-10">{shareRail}</div>}<AdSlot label="Article sponsor slot" /><div className="blog-article-content prose-headings:font-headline prose-headings:font-black prose-headings:uppercase prose-headings:tracking-[-0.035em] prose-headings:text-white prose-h2:text-3xl sm:prose-h2:text-4xl lg:prose-h2:text-5xl prose-h3:text-2xl sm:prose-h3:text-3xl prose-p:font-normal prose-p:leading-[1.8] prose-p:text-on-surface/90 prose-a:font-semibold prose-a:text-primary prose-a:underline prose-a:decoration-primary/50 prose-strong:text-white prose-blockquote:border-primary prose-blockquote:bg-white/[0.04] prose-blockquote:px-6 prose-blockquote:py-2 prose-blockquote:text-on-surface/85 prose-img:border prose-img:border-white/25" dangerouslySetInnerHTML={{ __html: article.content }} />{article.sharePlacement === 'after-content' && <div className="my-12 border-y border-primary/15 py-6">{shareRail}</div>}<AdSlot label="End-of-article sponsor slot" /><div className="flex flex-wrap items-center justify-between gap-6 border-t border-white/25 pt-8"><div><p className="mb-3 text-sm font-black uppercase tracking-[0.18em] text-primary">Topics covered</p><nav aria-label="Article topics" className="flex flex-wrap gap-2">{article.tags.map((tag) => <Link key={tag} href={`/blog?tag=${encodeURIComponent(slugify(tag))}`} className="inline-flex min-h-11 items-center rounded-full border border-white/25 bg-white/[0.04] px-4 py-2 text-xs font-bold uppercase tracking-[0.1em] text-on-surface/90 transition-colors hover:border-primary hover:bg-primary hover:text-black focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2 focus-visible:ring-offset-[#191a16]">{tag}</Link>)}</nav></div><button type="button" onClick={() => handleShare('copy')} className="inline-flex min-h-11 items-center gap-3 text-sm font-bold uppercase tracking-[0.12em] text-primary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary"><Share2 aria-hidden="true" className="h-5 w-5" /> {copied ? 'Copied' : 'Share article'}</button></div></article></div></section>

    {relatedPosts.length > 0 && <section className="border-t border-primary/15 bg-[#10110e] py-20 md:py-28"><div className="container mx-auto px-6 md:px-12"><div className="mb-12 flex items-end justify-between"><div><p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">Continue reading</p><h2 className="font-headline text-5xl font-black uppercase tracking-[-0.07em] text-white md:text-7xl">More signal.</h2></div><Link href="/blog" className="hidden items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-primary md:flex">All dispatches <ArrowUpRight className="h-4 w-4" /></Link></div><div className="grid gap-4 md:grid-cols-3">{relatedPosts.map((post, index) => <motion.article key={post.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={reduceMotion ? undefined : { y: -7 }} className="group overflow-hidden border border-outline-variant/15 bg-surface transition-colors hover:border-primary/55"><Link href={`/blog/${post.slug}`}><div className="relative aspect-[1.5/1] overflow-hidden bg-[#171914]">{post.coverImage ? <img src={post.coverImage} alt={post.title} loading="lazy" className="h-full w-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:scale-110 group-hover:opacity-90 group-hover:grayscale-0" /> : <div aria-hidden="true" className="absolute inset-0"><div className="absolute inset-0 bg-[radial-gradient(ellipse_at_25%_25%,rgba(255,184,123,0.18),transparent_60%)]" /><span className="absolute -right-3 -top-8 font-headline text-[9rem] font-black italic leading-none text-primary/[0.09]">0{index + 1}</span><span className="absolute bottom-0 left-5 right-5 h-px bg-gradient-to-r from-primary/60 via-primary/20 to-transparent" /></div>}<span className="absolute bottom-4 left-5 text-[9px] font-black uppercase tracking-[0.25em] text-primary">{post.category}</span></div><div className="p-6"><span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/35">{post.readTime} min read</span><h3 className="mt-5 line-clamp-3 font-headline text-2xl font-black uppercase leading-[0.95] tracking-tight transition-colors group-hover:text-primary">{post.title}</h3></div></Link></motion.article>)}</div></div></section>}
  </>
}
