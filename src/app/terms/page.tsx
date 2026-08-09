'use client'

import { motion } from 'framer-motion'
import { Scale, ShieldAlert, Gavel, ScrollText, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function TermsPage() {
  const lastUpdated = new Date().toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })

  return (
    <main className="min-h-screen pt-24 overflow-hidden">
      {/* Premium Hero */}
      <section className="relative py-32 border-b border-border/10">
        <div className="container mx-auto px-6 relative z-10">
          <div className="max-w-5xl">
            <motion.span 
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              className="text-[10px] font-bold tracking-[0.6em] text-primary uppercase mb-8 block"
            >
              Legal Framework
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[10vw] md:text-[8vw] font-headline font-black tracking-tighter leading-[0.8] mb-12 italic uppercase"
            >
              OPERATIONAL<br />STATUTES
            </motion.h1>
            
            <p className="text-xl font-light text-on-surface/80 max-w-xl leading-relaxed border-l border-primary/20 pl-8">
              Defining the governing ordinances, entity liabilities, and structural conditions for the utilization of Unifex tactical assets.
            </p>
            
            <div className="mt-12 flex items-center gap-4 text-[10px] font-black tracking-widest text-primary uppercase">
               Last Update Internal Clock: {lastUpdated.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/4 h-full bg-surface-container-low/30 -skew-x-12 translate-x-1/2 pointer-events-none" />
      </section>

      {/* Structured Mandates */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
             <div className="space-y-24">
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                >
                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-12 h-12 border border-primary/20 flex items-center justify-center text-primary">
                         <Gavel className="w-5 h-5" />
                      </div>
                      <h2 className="text-4xl font-headline font-black tracking-tighter uppercase italic">01 // BINDING DIRECTIVE</h2>
                   </div>
                   <div className="prose prose-invert prose-lg max-w-none border-l border-border/10 pl-12 ml-6">
                      <p className="text-foreground/80 font-light leading-relaxed">
                        By accessing the Unifex Platform or initializing any engineering workflow, you acknowledge full submission to the mandates detailed herein. 
                        Failure to comply results in immediate revocation of operational access.
                      </p>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                >
                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-12 h-12 border border-primary/20 flex items-center justify-center text-primary">
                         <Scale className="w-5 h-5" />
                      </div>
                      <h2 className="text-4xl font-headline font-black tracking-tighter uppercase italic">02 // INTELLECTUAL ASSETS</h2>
                   </div>
                   <div className="prose prose-invert prose-lg max-w-none border-l border-border/10 pl-12 ml-6">
                      <p className="text-foreground/80 font-light leading-relaxed">
                        The Unifex structural architecture, code matrices, visual frameworks, and tactical methodologies are protected by global intellectual domain laws. 
                        Unauthorized replication or modification of these assets is strictly prohibited.
                      </p>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                >
                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-12 h-12 border border-primary/20 flex items-center justify-center text-primary">
                         <ScrollText className="w-5 h-5" />
                      </div>
                      <h2 className="text-4xl font-headline font-black tracking-tighter uppercase italic">03 // USER SUBMISSIONS</h2>
                   </div>
                   <div className="prose prose-invert prose-lg max-w-none border-l border-border/10 pl-12 ml-6">
                      <p className="text-foreground/80 font-light leading-relaxed">
                         Any data units, tactical debriefs, or operational inputs provided by the user grant Unifex a non-exclusive, worldwide mandate 
                         to utilize, analyze, and integrate such data for the improvement of the platform's architectural integrity.
                      </p>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                >
                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-12 h-12 border border-primary/20 flex items-center justify-center text-primary">
                         <ShieldAlert className="w-5 h-5" />
                      </div>
                      <h2 className="text-4xl font-headline font-black tracking-tighter uppercase italic">04 // LIABILITY VECTORS</h2>
                   </div>
                   <div className="prose prose-invert prose-lg max-w-none border-l border-border/10 pl-12 ml-6">
                      <p className="text-foreground/80 font-light leading-relaxed">
                        Unifex Solutions shall not be held liable for any indirect, incidental, or structural damages arising from the engagement of our services. 
                        Users operate with full awareness of the kinetic nature of digital systems.
                      </p>
                   </div>
                </motion.div>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-12 border-t border-border/10">
                   {[
                      { section: '05 // INDEMNITY', content: 'Users hereby indemnify Unifex units from any liabilities arising from breach of statutes.' },
                      { section: '06 // SEVERABILITY', content: 'Invalidity of any single clause does not compromise the integrity of the total framework.' },
                      { section: '07 // JURISDICTION', content: 'Terms are governed by the primary registration district of the Unifex Entity.' },
                      { section: '08 // UPDATES', content: 'Statutes are subject to kinetic revision. Regular audit by user is required.' }
                   ].map((item, i) => (
                      <div key={i} className="p-8 border border-border/5 bg-surface-container-low/50">
                         <h3 className="text-xs font-black tracking-[0.3em] text-primary mb-4 uppercase">{item.section}</h3>
                         <p className="text-sm font-light text-foreground/40 leading-relaxed">{item.content}</p>
                      </div>
                   ))}
                </div>

                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="pt-24 text-center"
                >
                   <h2 className="text-[10px] font-black tracking-[0.6em] text-foreground/20 uppercase mb-8">Statutory Clarification</h2>
                   <p className="text-xl font-light text-foreground/40 mb-12 uppercase italic tracking-tighter">Request terminal link for legal inquiries:</p>
                   <Link href="/contact" className="inline-flex items-center gap-4 px-12 py-6 border border-primary/20 text-primary text-[10px] font-black tracking-[0.4em] uppercase hover:bg-primary hover:text-primary-foreground transition-all rounded-sm architectural-glow">
                      CONTACT LEGAL UNIT <ArrowUpRight className="w-4 h-4" />
                   </Link>
                </motion.div>

             </div>
          </div>
        </div>
      </section>
    </main>
  )
}
