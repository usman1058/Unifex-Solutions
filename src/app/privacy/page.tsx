'use client'

import { motion } from 'framer-motion'
import { Shield, Lock, Eye, FileText, ArrowUpRight } from 'lucide-react'
import Link from 'next/link'

export default function PrivacyPolicyPage() {
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
              Data Integrity
            </motion.span>
            <motion.h1 
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="text-[10vw] md:text-[8vw] font-headline font-black tracking-tighter leading-[0.8] mb-12 italic uppercase"
            >
              PRIVACY<br />PROTOCOLS
            </motion.h1>
            
            <p className="text-xl font-light text-on-surface/80 max-w-xl leading-relaxed border-l border-primary/20 pl-8">
              Documenting the structural safeguards and operational directives governing the processing of personnel and entity data.
            </p>
            
            <div className="mt-12 flex items-center gap-4 text-[10px] font-black tracking-widest text-primary uppercase">
               Last Update Internal Clock: {lastUpdated.toUpperCase()}
            </div>
          </div>
        </div>
        <div className="absolute top-0 right-0 w-1/4 h-full bg-surface-container-low/30 -skew-x-12 translate-x-1/2 pointer-events-none" />
      </section>

      {/* Structured Content */}
      <section className="py-32">
        <div className="container mx-auto px-6">
          <div className="max-w-4xl mx-auto">
             <div className="space-y-32">
                
                <motion.div 
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="group"
                >
                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-12 h-12 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-700">
                         <FileText className="w-5 h-5" />
                      </div>
                      <h2 className="text-4xl font-headline font-black tracking-tighter uppercase italic">01 // PREAMBLE</h2>
                   </div>
                   <div className="prose prose-invert prose-lg max-w-none prose-p:text-foreground/80 font-light leading-relaxed border-l border-border/10 pl-12 ml-6">
                      <p>
                        Welcome to Unifex Solutions. We recognize the imperative of data architectural integrity. This protocol defines our mandate 
                        regarding the acquisition, retention, and transmission of data assets when engaging with our digital infrastructure.
                      </p>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="group"
                >
                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-12 h-12 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-700">
                         <Eye className="w-5 h-5" />
                      </div>
                      <h2 className="text-4xl font-headline font-black tracking-tighter uppercase italic">02 // DATA ACQUISITION</h2>
                   </div>
                   <div className="border-l border-border/10 pl-12 ml-6 space-y-8">
                      <p className="text-lg font-light text-on-surface/80 italic">Unifex categorizes data assets into the following nodes:</p>
                      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                         {[
                            { label: 'IDENTITY NODE', desc: 'Legal nomenclature, entity identifiers, and verification credentials.' },
                            { label: 'SIGNAL NODE', desc: 'Transmission endpoints, email ciphers, and communication frequencies.' },
                            { label: 'DEVICE DATA', desc: 'IP addresses, browser telemetry, and navigational heatmaps.' },
                            { label: 'SECURE NODE', desc: 'Encrypted hash values and session authentication tokens.' }
                         ].map((node, i) => (
                            <div key={i} className="p-8 border border-border/10 bg-surface-container-low/50 hover:bg-background transition-all duration-500">
                               <h3 className="text-xs font-black tracking-[0.3em] text-primary mb-4 uppercase">{node.label}</h3>
                               <p className="text-sm font-light text-on-surface/80 leading-relaxed">{node.desc}</p>
                            </div>
                         ))}
                      </div>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="group"
                >
                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-12 h-12 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-700">
                         <Lock className="w-5 h-5" />
                      </div>
                      <h2 className="text-4xl font-headline font-black tracking-tighter uppercase italic">03 // SAFEGUARD DIRECTIVES</h2>
                   </div>
                   <div className="prose prose-invert prose-lg max-w-none prose-p:text-foreground/80 font-light leading-relaxed border-l border-border/10 pl-12 ml-6">
                      <p>
                        Our engineering units have deployed advanced structural security measures to mitigate accidental data loss, unauthorized tactical access, 
                        or procedural alteration. Access is strictly audited and limited to authorized personnel units with clearance for data handling.
                      </p>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="group"
                >
                   <div className="flex items-center gap-6 mb-12">
                      <div className="w-12 h-12 border border-primary/20 flex items-center justify-center text-primary group-hover:bg-primary group-hover:text-primary-foreground transition-all duration-700">
                         <Shield className="w-5 h-5" />
                      </div>
                      <h2 className="text-4xl font-headline font-black tracking-tighter uppercase italic">04 // YOUR RIGHTS</h2>
                   </div>
                   <div className="prose prose-invert prose-lg max-w-none border-l border-border/10 pl-12 ml-6">
                      <p className="text-on-surface/80 font-light mb-8">
                        Under global architectural data regulations, you retain direct control over your information substrate:
                      </p>
                      <ul className="space-y-4">
                         {['NODE ACCESS REQUEST', 'RECTIFICATION OF TELEMETRY', 'ERASURE OF DATA ASSETS', 'TRANSVERSE PORTABILITY'].map(right => (
                            <li key={right} className="flex items-center gap-4 text-xs font-black tracking-widest text-foreground/30 uppercase">
                               <div className="w-2 h-2 rounded-full bg-primary" />
                               {right}
                            </li>
                         ))}
                      </ul>
                   </div>
                </motion.div>

                <motion.div 
                   initial={{ opacity: 0, y: 30 }}
                   whileInView={{ opacity: 1, y: 0 }}
                   viewport={{ once: true }}
                   className="pt-24 border-t border-border/10 text-center"
                >
                   <h2 className="text-[10px] font-black tracking-[0.6em] text-on-surface/80 uppercase mb-8">Signal Clarification</h2>
                   <p className="text-xl font-light text-on-surface/80 mb-12 uppercase italic tracking-tighter">Request terminal link for data inquiries:</p>
                   <Link href="/contact" className="inline-flex items-center gap-4 px-12 py-6 border border-primary/20 text-primary text-[10px] font-black tracking-[0.4em] uppercase hover:bg-primary hover:text-primary-foreground transition-all rounded-sm architectural-glow">
                      CONTACT D.P.O. <ArrowUpRight className="w-4 h-4" />
                   </Link>
                </motion.div>

             </div>
          </div>
        </div>
      </section>
    </main>
  )
}
