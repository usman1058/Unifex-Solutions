import HeroBackground from '@/components/home/hero-background'
import HeroContent from '@/components/home/hero-content'
import { db } from '@/lib/db'
import Link from 'next/link'
import { FadeIn, StaggerContainer, KineticBorder, AnimatedCounter } from '@/components/ui/motion-wrapper'
import { ArrowUpRight, CheckCircle2 } from 'lucide-react'
import ServicesParallaxSection from '@/components/home/services-parallax-section'
import PortfolioCarousel from '@/components/home/portfolio-carousel'
import KineticFlowSection from '@/components/home/kinetic-flow-section'
import MetricsSection from '@/components/home/metrics-section'
import TestimonialSpotlight from '@/components/home/testimonial-spotlight'
import HomepageClientMotion from '@/components/home/homepage-client-motion'
import CurvedLoop from '@/components/ui/curved-loop'
import LogoLoop from '@/components/ui/logo-loop'
import CardSwap, { Card } from '@/components/ui/card-swap'
import TextReveal from '@/components/ui/text-reveal'
import ScrollReveal from '@/components/ui/scroll-reveal'
import CircularText from '@/components/ui/circular-text'
import HomeIntroLoader from '@/components/home/home-intro-loader'
import {
  SiGithub, SiReact, SiNextdotjs, SiTypescript, SiTailwindcss,
  SiDocker, SiNodedotjs, SiPostgresql, SiPrisma, SiFigma,
  SiVuedotjs, SiGraphql, SiMongodb, SiRust
} from 'react-icons/si'

const techLogos = [
  { node: <SiGithub />, title: 'GitHub' },
  { node: <SiReact />, title: 'React' },
  { node: <SiNextdotjs />, title: 'Next.js' },
  { node: <SiTypescript />, title: 'TypeScript' },
  { node: <SiTailwindcss />, title: 'Tailwind CSS' },
  { node: <SiDocker />, title: 'Docker' },
  { node: <SiNodedotjs />, title: 'Node.js' },
  { node: <SiPostgresql />, title: 'PostgreSQL' },
  { node: <SiPrisma />, title: 'Prisma' },
  { node: <SiFigma />, title: 'Figma' },
  { node: <SiVuedotjs />, title: 'Vue.js' },
  { node: <SiGraphql />, title: 'GraphQL' },
  { node: <SiMongodb />, title: 'MongoDB' },
  { node: <SiRust />, title: 'Rust' },
]

export const revalidate = 60

// Fallback services in case DB returns fewer than 5
const defaultServices = [
  {
    id: 's1',
    slug: 'web-development',
    title: 'Web Development',
    description: 'High-performance, scalable web applications built with modern frontend frameworks and optimal SEO.',
    icon: 'Globe',
    features: ['Custom Web Applications', 'Responsive UI Architecture', 'Progressive Web Apps (PWA)', 'SEO & Performance Tuning'],
  },
  {
    id: 's2',
    slug: 'full-stack-development',
    title: 'Full-Stack Development',
    description: 'End-to-end custom software architecture, cloud microservices, and robust API integrations.',
    icon: 'Layers',
    features: ['Enterprise Architecture', 'RESTful & GraphQL APIs', 'Database Design & Optimization', 'Cloud Microservices'],
  },
  {
    id: 's3',
    slug: 'crm-development-integration',
    title: 'CRM Development & Integration',
    description: 'Custom CRM systems, workflow automation, and enterprise database integrations.',
    icon: 'Database',
    features: ['Custom CRM Platforms', 'Salesforce & HubSpot Integration', 'Workflow Automation', 'Analytics Dashboards'],
  },
  {
    id: 's4',
    slug: 'cybersecurity-penetration-testing',
    title: 'Cybersecurity & Penetration Testing',
    description: 'Threat assessments, vulnerability testing, data encryption, and compliance audits.',
    icon: 'Shield',
    features: ['Penetration Testing', 'Vulnerability Assessments', 'Data Encryption Standards', 'Compliance Audits (SOC 2 / GDPR)'],
  },
  {
    id: 's5',
    slug: 'digital-marketing',
    title: 'Digital Marketing',
    description: 'Data-driven growth marketing, performance campaigns, search optimization, and analytics.',
    icon: 'TrendingUp',
    features: ['Technical SEO & Growth', 'Performance Campaign Management', 'Conversion Rate Optimization (CRO)', 'Analytics & Attribution'],
  },
]


export default async function Home() {
  const [statsDb, servicesDb, caseStudiesDb, testimonialsDb, clientsDb] = await Promise.all([
    db.stat.findMany({ where: { published: true }, orderBy: { displayOrder: 'asc' } }),
    db.service.findMany({ where: { published: true }, orderBy: { displayOrder: 'asc' }, take: 5 }),
    db.caseStudy.findMany({ where: { published: true }, orderBy: { displayOrder: 'asc' }, take: 2 }),
    db.testimonial.findMany({ where: { published: true, featured: true }, orderBy: { displayOrder: 'asc' }, take: 1 }),
    db.client.findMany({ where: { published: true }, orderBy: { displayOrder: 'asc' } }),
  ])

  // Process services to ensure 5 clean service items
  const servicesList = servicesDb.length >= 5 ? servicesDb.map(s => ({
    id: s.id,
    slug: s.slug,
    title: s.title,
    description: s.description,
    features: s.features ? (JSON.parse(s.features) as string[]) : []
  })) : defaultServices

  // Process stats to guarantee 4 items
  const statsList = statsDb.length >= 4 ? statsDb : [
    { id: '1', value: '150+', label: 'PROJECTS COMPLETED' },
    { id: '2', value: '100+', label: 'HAPPY CLIENTS' },
    { id: '3', value: '25+', label: 'TEAM MEMBERS' },
    { id: '4', value: '8+', label: 'YEARS EXPERIENCE' },
  ]

  const featuredTestimonial = testimonialsDb[0] || {
    name: 'Sarah Johnson',
    role: 'CEO',
    company: 'TechStart Inc.',
    content: 'Unifex Solutions engineered our full-stack platform and fortified our cloud infrastructure. Their team delivered flawless execution on time and within scope.',
  }

  const clientLogos = clientsDb.length > 0 ? clientsDb.map(c => c.name) : [
    'TECHSTART INC.', 'GROWTHHUB', 'RETAILMAX', 'SECUREBANK', 'HEALTHPLUS', 'EDUTECH'
  ]

  const caseStudiesList = caseStudiesDb.length >= 2 ? caseStudiesDb : [
    {
      id: 'cs1',
      slug: 'ecommerce-platform',
      title: 'E-Commerce Platform for Retail Giant',
      industry: 'E-Commerce',
      thumbnailUrl: 'https://images.unsplash.com/photo-1556742049-0cfed4f6a45d?q=80&w=800&auto=format&fit=crop'
    },
    {
      id: 'cs2',
      slug: 'mobile-banking-app',
      title: 'Mobile Banking App & Security Core',
      industry: 'FinTech & Security',
      thumbnailUrl: 'https://images.unsplash.com/photo-1551288049-bebda4e38f71?q=80&w=800&auto=format&fit=crop'
    }
  ]

  return (
    <main className="w-full min-h-screen bg-background text-on-surface overflow-x-clip">
      <HomeIntroLoader />
      {/* SECTION 1: ENHANCED INTERACTIVE 3D HERO SECTION */}
      <section className="relative min-h-[90vh] md:min-h-screen flex items-center justify-center pt-28 pb-44 overflow-hidden">
        <HeroBackground />

        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-20 w-full">
          <HomepageClientMotion type="hero">
            <HeroContent />
          </HomepageClientMotion>
        </div>

        <div className="absolute bottom-16 left-0 w-full z-10 pointer-events-none">
          <CurvedLoop
            marqueeText="ARCHITECT ✦ ENGINEER ✦ DEPLOY ✦ SCALE ✦ SECURE ✦ INNOVATE ✦"
            speed={1.5}
            curveAmount={200}
            direction="left"
            interactive={false}
            className="text-on-surface/30 font-headline"
          />
        </div>
      </section>

      {/* SECTION 2: DUAL LOGO LOOP */}
      <section className="py-16 bg-surface-container-lowest overflow-hidden border-y border-outline-variant/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 mb-6">
          <span className="text-[10px] font-label tracking-[0.3em] uppercase text-on-surface-variant/60 block text-center md:text-left">
            TRUSTED BY FORWARD-THINKING ENTERPRISES WORLDWIDE
          </span>
        </div>
        <LogoLoop
          logos={techLogos}
          speed={80}
          direction="left"
          logoHeight={36}
          gap={64}
          fadeOut
          scaleOnHover
        />
        <div className="flex items-center gap-4 max-w-7xl mx-auto px-4 sm:px-6 my-6">
          <div className="h-px flex-1 bg-gradient-to-r from-transparent via-primary/20 to-primary/40" />
          <span className="inline-block text-primary/30 text-xs animate-[spin_4s_linear_infinite]">✦</span>
          <div className="h-px flex-1 bg-gradient-to-r from-primary/40 via-primary/20 to-transparent" />
        </div>
        <LogoLoop
          logos={techLogos}
          speed={80}
          direction="right"
          logoHeight={36}
          gap={64}
          fadeOut
          scaleOnHover
        />
      </section>

      {/* SECTION 3: ABOUT US */}
      <section className="relative py-24 sm:py-32 px-4 sm:px-6 md:px-12 max-w-7xl mx-auto overflow-hidden">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-16 items-center">
          <div>
            <FadeIn direction="left">
              <div>
                <span className="font-label text-primary text-xs tracking-[0.3em] uppercase mb-3 block font-bold">
                  STUDIO // ABOUT US
                </span>
                <TextReveal delay={0.1} className="mb-4">
                  <h2 className="text-3xl sm:text-5xl md:text-6xl font-headline font-black uppercase tracking-tight">
                    ENGINEERING THE <span className="text-primary">FUTURE</span> OF DIGITAL
                  </h2>
                </TextReveal>

                <div className="flex items-center gap-3 mb-6">
                  <div className="h-px flex-1 bg-gradient-to-r from-primary/60 to-transparent" />
                  <span className="inline-block text-primary/60 text-lg animate-[spin_3s_linear_infinite]">✦</span>
                  <div className="h-px flex-1 bg-gradient-to-l from-primary/60 to-transparent" />
                </div>

                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={2}
                  blurStrength={6}
                  containerClassName="mb-6"
                  textClassName="!text-lg sm:!text-xl !font-light !font-label !tracking-wide text-on-surface-variant !leading-relaxed"
                  rotationEnd="center center"
                  wordAnimationEnd="center center"
                >
                  Unifex Solutions is an enterprise digital agency engineering full-stack systems, cybersecurity, and scalable architecture for forward-thinking organizations worldwide.
                </ScrollReveal>

                <ScrollReveal
                  baseOpacity={0}
                  enableBlur={true}
                  baseRotation={2}
                  blurStrength={6}
                  containerClassName="mb-8"
                  textClassName="!text-lg sm:!text-xl !font-light !font-label !tracking-wide text-on-surface-variant !leading-relaxed"
                  rotationEnd="center center"
                  wordAnimationEnd="center center"
                >
                  From startups to Fortune 500 enterprises, we deliver production-grade software combining cutting-edge technology with rigorous security and performance optimization.
                </ScrollReveal>

                <TextReveal delay={0.7}>
                  <Link
                    href="/about"
                    className="inline-flex items-center gap-2 text-xs font-label tracking-[0.2em] uppercase text-primary hover:text-white transition-colors py-2 group"
                  >
                    LEARN MORE ABOUT US
                    <ArrowUpRight className="w-4 h-4 group-hover:translate-x-1 group-hover:-translate-y-1 transition-transform" />
                  </Link>
                </TextReveal>
              </div>
            </FadeIn>
          </div>

          <FadeIn direction="right" className="relative w-full" viewportMargin="-100px">
            <div className="relative w-full" style={{ height: '400px' }}>
              <CardSwap
                width={500}
                height={380}
                cardDistance={60}
                verticalDistance={75}
                delay={4500}
                pauseOnHover={false}
                skewAmount={5}
                easing="elastic"
              >
                <Card customClass="about-card">
                  <div className="p-8 flex flex-col h-full bg-gradient-to-br from-[#1B1722] to-[#2a1f1a] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent animate-pulse" />
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-pulse" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div>
                        <span className="text-5xl font-headline font-black text-primary/20 inline-block animate-pulse">01</span>
                        <div className="w-8 h-[2px] bg-primary/60 mt-3 mb-4" />
                        <h3 className="text-xl font-headline font-black uppercase text-white">Who We Are</h3>
                      </div>
                      <div className="flex flex-col items-center my-5 gap-2">
                        <span className="inline-block text-primary/30 text-[10px] animate-[spin_4s_linear_infinite]">✦</span>
                        <CircularText
                          text="WE*BUILD*ALL*"
                          spinDuration={16}
                          onHover="speedUp"
                          className="!w-20 !h-20 !text-[8px]"
                        />
                      </div>
                      <p className="text-sm font-label leading-relaxed text-white/80 tracking-wide">
                        A collective of engineers, architects, and strategists united by a mission to
                        build digital excellence — one system at a time.
                      </p>
                    </div>
                  </div>
                </Card>
                <Card customClass="about-card">
                  <div className="p-8 flex flex-col h-full bg-gradient-to-br from-[#2F293A] to-[#3a2828] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent animate-pulse" />
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-pulse" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div>
                        <span className="text-5xl font-headline font-black text-primary/20 inline-block animate-pulse">02</span>
                        <div className="w-8 h-[2px] bg-primary/60 mt-3 mb-4" />
                        <h3 className="text-xl font-headline font-black uppercase text-white">Our Mission</h3>
                      </div>
                      <div className="flex flex-col items-center my-5 gap-2">
                        <span className="inline-block text-primary/30 text-[10px] animate-[spin_4s_linear_infinite]">✦</span>
                        <CircularText
                          text="MISSION*DRIVEN*CODE*"
                          spinDuration={14}
                          onHover="speedUp"
                          className="!w-20 !h-20 !text-[8px]"
                        />
                      </div>
                      <p className="text-sm font-label leading-relaxed text-white/80 tracking-wide">
                        To architect secure, scalable, and high-performance digital solutions that
                        empower enterprises to thrive in an evolving technological landscape.
                      </p>
                    </div>
                  </div>
                </Card>
                <Card customClass="about-card">
                  <div className="p-8 flex flex-col h-full bg-gradient-to-br from-[#1B1722] to-[#3a2218] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent animate-pulse" />
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-pulse" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div>
                        <span className="text-5xl font-headline font-black text-primary/20 inline-block animate-pulse">03</span>
                        <div className="w-8 h-[2px] bg-primary/60 mt-3 mb-4" />
                        <h3 className="text-xl font-headline font-black uppercase text-white">Our Values</h3>
                      </div>
                      <div className="flex flex-col items-center my-5 gap-2">
                        <span className="inline-block text-primary/30 text-[10px] animate-[spin_4s_linear_infinite]">✦</span>
                        <CircularText
                          text="CORE*VALUES*SET*"
                          spinDuration={18}
                          onHover="speedUp"
                          className="!w-20 !h-20 !text-[8px]"
                        />
                      </div>
                      <p className="text-sm font-label leading-relaxed text-white/80 tracking-wide">
                        Precision engineering, uncompromising security, transparent collaboration, and
                        relentless pursuit of quality in every line of code.
                      </p>
                    </div>
                  </div>
                </Card>
                <Card customClass="about-card">
                  <div className="p-8 flex flex-col h-full bg-gradient-to-br from-[#2F293A] to-[#2a1f1a] relative overflow-hidden">
                    <div className="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-primary via-primary/50 to-transparent animate-pulse" />
                    <div className="absolute -top-4 -right-4 w-24 h-24 bg-primary/5 rounded-full blur-xl animate-pulse" />
                    <div className="relative z-10 flex flex-col h-full">
                      <div>
                        <span className="text-5xl font-headline font-black text-primary/20 inline-block animate-pulse">04</span>
                        <div className="w-8 h-[2px] bg-primary/60 mt-3 mb-4" />
                        <h3 className="text-xl font-headline font-black uppercase text-white">Our Approach</h3>
                      </div>
                      <div className="flex flex-col items-center my-5 gap-2">
                        <span className="inline-block text-primary/30 text-[10px] animate-[spin_4s_linear_infinite]">✦</span>
                        <CircularText
                          text="KINETIC*FLOW*SET*"
                          spinDuration={12}
                          onHover="speedUp"
                          className="!w-20 !h-20 !text-[8px]"
                        />
                      </div>
                      <p className="text-sm font-label leading-relaxed text-white/80 tracking-wide">
                        Deep-dive discovery, meticulous architecture, agile development, and
                        continuous optimization — The Kinetic Flow methodology.
                      </p>
                    </div>
                  </div>
                </Card>
              </CardSwap>
            </div>
          </FadeIn>
        </div>
      </section>

      <ServicesParallaxSection services={servicesList} />

      <PortfolioCarousel projects={caseStudiesList} />

      <KineticFlowSection />

      <MetricsSection stats={statsList} />

      {featuredTestimonial && <TestimonialSpotlight testimonial={featuredTestimonial} />}

      {/* SECTION 10: FINAL CTA SECTION */}
      <section className="py-28 sm:py-36 relative overflow-hidden bg-surface-container-lowest border-t border-outline-variant/15">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 md:px-12 relative z-10 text-center">
          <FadeIn direction="up">
            <h2 className="text-3xl sm:text-6xl lg:text-7xl font-headline font-black uppercase tracking-tight mb-8 leading-none">
              READY TO ELEVATE YOUR <br />
              <span className="text-primary">DIGITAL INFRASTRUCTURE?</span>
            </h2>
            <p className="text-on-surface-variant max-w-xl mx-auto text-sm sm:text-base mb-12 font-light leading-relaxed">
              Partner with Unifex Solutions to engineer robust software, secure digital assets, and accelerate enterprise growth.
            </p>
            <Link
              href="/contact"
              className="inline-flex items-center gap-3 px-10 sm:px-14 py-5 bg-primary text-black hover:bg-white transition-colors duration-300 font-label font-black text-xs tracking-[0.3em] uppercase shadow-2xl active:scale-95"
            >
              START A PROJECT WITH UNIFEX
              <ArrowUpRight className="w-5 h-5" />
            </Link>
          </FadeIn>
        </div>
      </section>
    </main>
  )
}


