import Link from 'next/link'
import { ArrowLeft } from 'lucide-react'

export default function NotFound() {
  return (
    <main className="bg-background text-on-surface min-h-screen flex items-center justify-center p-10">
      <div className="max-w-2xl w-full text-center border border-outline-variant/10 bg-surface-container-low p-16 relative overflow-hidden">
        <span className="text-[10px] font-black tracking-[0.6em] text-primary mb-8 block uppercase italic">Error // 404</span>
        
        <h1 className="text-6xl md:text-8xl font-headline font-black tracking-tighter uppercase mb-6 text-on-surface/20">
          PAGE NOT FOUND
        </h1>
        
        <p className="text-xs font-black tracking-[0.3em] text-on-surface/60 uppercase leading-relaxed mb-12 italic">
          THE PAGE YOU ARE LOOKING FOR DOES NOT EXIST OR HAS BEEN MOVED.
        </p>

        <Link
          href="/"
          className="inline-flex items-center gap-4 px-12 py-6 bg-primary text-black font-black text-[10px] tracking-[0.4em] uppercase hover:bg-white transition-all"
        >
          <ArrowLeft className="w-4 h-4" /> RETURN HOME
        </Link>
      </div>
    </main>
  )
}
