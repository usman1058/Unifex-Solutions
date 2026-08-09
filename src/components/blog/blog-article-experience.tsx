'use client'

import { motion, useReducedMotion } from 'framer-motion'
import { ArrowUpRight, Check, Clock3, Copy, Facebook, Instagram, Link2, Linkedin, List, Share2 } from 'lucide-react'
import Link from 'next/link'
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
  return <div data-ad-slot className="my-12 flex min-h-24 items-center justify-center border-y border-dashed border-primary/15 bg-primary/[0.02] text-[9px] font-black uppercase tracking-[0.35em] text-on-surface/25">{label}</div>
}

function slugify(value: string) {
  return value.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/(^-|-$)/g, '')
}

function ShareRail({ copied, onShare }: { copied: boolean; onShare: (network: 'facebook' | 'instagram' | 'linkedin' | 'copy') => void }) {
  return <div className="flex items-center gap-2"><span className="mr-2 text-[9px] font-black uppercase tracking-[0.25em] text-on-surface/35">Share</span><button type="button" title="Share on Facebook" onClick={() => onShare('facebook')} className="flex h-9 w-9 items-center justify-center border border-outline-variant/20 text-on-surface/50 transition-colors hover:border-primary hover:bg-primary hover:text-black"><Facebook className="h-4 w-4" /></button><button type="button" title="Share on Instagram" onClick={() => onShare('instagram')} className="flex h-9 w-9 items-center justify-center border border-outline-variant/20 text-on-surface/50 transition-colors hover:border-primary hover:bg-primary hover:text-black"><Instagram className="h-4 w-4" /></button><button type="button" title="Share on LinkedIn" onClick={() => onShare('linkedin')} className="flex h-9 w-9 items-center justify-center border border-outline-variant/20 text-on-surface/50 transition-colors hover:border-primary hover:bg-primary hover:text-black"><Linkedin className="h-4 w-4" /></button><button type="button" title="Copy article link" onClick={() => onShare('copy')} className="flex h-9 w-9 items-center justify-center border border-outline-variant/20 text-on-surface/50 transition-colors hover:border-primary hover:bg-primary hover:text-black">{copied ? <Check className="h-4 w-4" /> : <Link2 className="h-4 w-4" />}</button></div>
}

export default function BlogArticleExperience({ article, relatedPosts }: { article: ArticleProps; relatedPosts: RelatedPost[] }) {
  const reduceMotion = useReducedMotion()
  const articleRef = useRef<HTMLElement>(null)
  const [progress, setProgress] = useState(0)
  const [headings, setHeadings] = useState<Array<{ id: string; text: string }>>([])
  const [copied, setCopied] = useState(false)

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
    if (network === 'facebook') window.open(`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer')
    else if (network === 'linkedin') window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${encodeURIComponent(url)}`, '_blank', 'noopener,noreferrer')
    else if (network === 'instagram' && navigator.share) await navigator.share({ title: article.title, url })
    else await navigator.clipboard?.writeText(url)
    setCopied(true)
    window.setTimeout(() => setCopied(false), 1800)
  }

  const shareRail = <ShareRail copied={copied} onShare={handleShare} />

  return <>
    <motion.div className="fixed left-0 right-0 top-24 z-30 h-1 origin-left bg-primary shadow-[0_0_18px_rgba(213,255,0,0.7)]" style={{ scaleX: progress / 100 }} />
    <section className="border-b border-primary/15 py-16 md:py-24"><div className="container mx-auto px-6 md:px-12"><div className="grid max-w-7xl gap-12 lg:grid-cols-[0.95fr_1.05fr] lg:items-end"><div><Link href="/blog" className="mb-12 inline-flex items-center gap-3 text-[10px] font-black uppercase tracking-[0.3em] text-on-surface/45 transition-colors hover:text-primary">← Back to journal</Link><p className="mb-7 text-[10px] font-black uppercase tracking-[0.45em] text-primary">{article.category} / Long read</p><h1 className="max-w-5xl font-headline text-5xl font-black uppercase leading-[0.84] tracking-[-0.08em] md:text-8xl">{article.title}</h1><div className="mt-10 flex flex-wrap items-center gap-6 border-t border-outline-variant/15 pt-6 text-[9px] font-black uppercase tracking-[0.22em] text-on-surface/40"><span>By {article.author || 'Editorial team'}</span><span>{new Intl.DateTimeFormat('en', { month: 'short', day: '2-digit', year: 'numeric' }).format(new Date(article.publishedAt))}</span><span className="flex items-center gap-2 text-primary"><Clock3 className="h-3.5 w-3.5" /> {article.readTime} min read</span></div>{article.sharePlacement === 'hero' && <div className="mt-8">{shareRail}</div>}</div>{article.coverImage ? <div className="relative aspect-[1.15/1] overflow-hidden border border-primary/30 bg-[#171914]"><img src={article.coverImage} alt={article.title} className="h-full w-full object-cover opacity-75 grayscale transition-all duration-1000 hover:scale-105 hover:opacity-100 hover:grayscale-0" /><div className="absolute inset-0 bg-gradient-to-t from-black/75 via-transparent to-transparent" /><span className="absolute bottom-5 left-5 text-[9px] font-black uppercase tracking-[0.3em] text-primary">Main image / field notes</span></div> : <div className="relative flex aspect-[1.15/1] items-center justify-center border border-dashed border-primary/25 bg-primary/[0.03]"><span className="text-[9px] font-black uppercase tracking-[0.3em] text-primary/50">Editorial image pending</span></div>}</div></div></section>

    <section className="container mx-auto px-6 py-16 md:px-12 md:py-24"><div className="grid gap-14 lg:grid-cols-[0.3fr_0.7fr] lg:gap-20"><aside className="space-y-8 lg:sticky lg:top-36 lg:self-start"><div className="border border-primary/25 bg-[#151713] p-6"><p className="mb-5 flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-primary"><List className="h-4 w-4" /> On this page</p>{headings.length > 0 ? <nav className="space-y-3">{headings.map((heading) => <a key={heading.id} href={`#${heading.id}`} className="block text-xs leading-relaxed text-on-surface/45 transition-colors hover:text-primary">{heading.text}</a>)}</nav> : <p className="text-xs text-on-surface/35">A focused dispatch from the studio.</p>}</div>{article.tags.length > 0 && <div className="border border-primary/20 bg-[#151713] p-6"><p className="mb-5 text-[9px] font-black uppercase tracking-[0.3em] text-primary">Filter by tag</p><div className="flex flex-wrap gap-2">{article.tags.map((tag) => <Link key={tag} href={`/blog?tag=${encodeURIComponent(slugify(tag))}`} className="border border-outline-variant/20 px-3 py-2 text-[9px] font-black uppercase tracking-[0.15em] text-on-surface/50 transition-colors hover:border-primary hover:text-primary">{tag}</Link>)}</div></div>}{article.sharePlacement === 'sidebar' && <div className="border border-outline-variant/15 bg-surface p-6">{shareRail}</div>}<AdSlot label="Sidebar sponsor slot" /></aside><article ref={articleRef} className="min-w-0"><div className="mb-12 border-l-2 border-primary/50 pl-6 text-lg leading-relaxed text-on-surface/65 md:text-2xl">{article.excerpt}</div>{article.sharePlacement === 'after-excerpt' && <div className="mb-10">{shareRail}</div>}<AdSlot label="Article sponsor slot" /><div className="prose prose-invert prose-lg max-w-none prose-headings:font-headline prose-headings:font-black prose-headings:uppercase prose-headings:tracking-[-0.04em] prose-headings:text-white prose-p:font-light prose-p:leading-[1.9] prose-p:text-on-surface/75 prose-a:text-primary prose-strong:text-white prose-blockquote:border-primary prose-blockquote:text-on-surface/65 prose-img:border prose-img:border-primary/20" dangerouslySetInnerHTML={{ __html: article.content }} />{article.sharePlacement === 'after-content' && <div className="my-12 border-y border-primary/15 py-6">{shareRail}</div>}<AdSlot label="End-of-article sponsor slot" /><div className="flex flex-wrap items-center justify-between gap-5 border-t border-primary/15 pt-8"><div className="flex flex-wrap gap-2">{article.tags.map((tag) => <Link key={tag} href={`/blog?tag=${encodeURIComponent(slugify(tag))}`} className="border border-outline-variant/20 px-3 py-2 text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/45 transition-colors hover:border-primary hover:text-primary">{tag}</Link>)}</div><button onClick={() => handleShare('copy')} className="inline-flex items-center gap-3 text-[9px] font-black uppercase tracking-[0.25em] text-primary"><Share2 className="h-4 w-4" /> {copied ? 'Copied' : 'Share article'}</button></div></article></div></section>

    {relatedPosts.length > 0 && <section className="border-t border-primary/15 bg-[#10110e] py-20 md:py-28"><div className="container mx-auto px-6 md:px-12"><div className="mb-12 flex items-end justify-between"><div><p className="mb-4 text-[10px] font-black uppercase tracking-[0.4em] text-primary">Continue reading</p><h2 className="font-headline text-5xl font-black uppercase tracking-[-0.07em] text-white md:text-7xl">More signal.</h2></div><Link href="/blog" className="hidden items-center gap-3 text-[9px] font-black uppercase tracking-[0.3em] text-primary md:flex">All dispatches <ArrowUpRight className="h-4 w-4" /></Link></div><div className="grid gap-4 md:grid-cols-3">{relatedPosts.map((post, index) => <motion.article key={post.id} initial={{ opacity: 0, y: 22 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: index * 0.08 }} whileHover={reduceMotion ? undefined : { y: -7 }} className="group overflow-hidden border border-outline-variant/15 bg-surface transition-colors hover:border-primary/55"><Link href={`/blog/${post.slug}`}><div className="relative aspect-[1.5/1] overflow-hidden bg-[#171914]">{post.coverImage && <img src={post.coverImage} alt={post.title} loading="lazy" className="h-full w-full object-cover opacity-60 grayscale transition-all duration-700 group-hover:scale-110 group-hover:opacity-90 group-hover:grayscale-0" />}<span className="absolute bottom-4 left-5 text-[9px] font-black uppercase tracking-[0.25em] text-primary">{post.category}</span></div><div className="p-6"><span className="text-[9px] font-black uppercase tracking-[0.2em] text-on-surface/35">{post.readTime} min read</span><h3 className="mt-5 line-clamp-3 font-headline text-2xl font-black uppercase leading-[0.95] tracking-tight transition-colors group-hover:text-primary">{post.title}</h3></div></Link></motion.article>)}</div></div></section>}
  </>
}
