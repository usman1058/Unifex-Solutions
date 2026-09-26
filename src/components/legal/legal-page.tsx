import Link from 'next/link'

type Section = {
  title: string
  paragraphs?: string[]
  bullets?: string[]
}

export default function LegalPage({
  eyebrow,
  title,
  intro,
  updated,
  sections,
}: {
  eyebrow: string
  title: string
  intro: string
  updated: string
  sections: Section[]
}) {
  return (
    <main className="min-h-screen px-4 pb-24 pt-32 sm:px-6 lg:px-12">
      <div className="mx-auto max-w-5xl">
        <header className="border-b border-primary/20 pb-12">
          <p className="text-xs font-semibold uppercase tracking-[0.28em] text-primary">{eyebrow}</p>
          <h1 className="mt-6 max-w-4xl font-headline text-5xl font-black uppercase leading-[0.9] tracking-[-0.07em] sm:text-7xl lg:text-8xl">{title}</h1>
          <p className="mt-8 max-w-3xl text-base leading-8 text-on-surface/70 sm:text-lg">{intro}</p>
          <p className="mt-8 text-xs font-semibold uppercase tracking-[0.2em] text-on-surface/45">Last updated: {updated}</p>
        </header>

        <div className="divide-y divide-outline-variant/15">
          {sections.map((section, index) => (
            <section key={section.title} className="grid gap-6 py-12 md:grid-cols-[0.3fr_0.7fr] md:gap-12">
              <h2 className="text-sm font-bold uppercase tracking-[0.18em] text-primary">{String(index + 1).padStart(2, '0')} / {section.title}</h2>
              <div className="space-y-5 text-sm leading-8 text-on-surface/70 sm:text-base">
                {section.paragraphs?.map((paragraph) => <p key={paragraph}>{paragraph}</p>)}
                {section.bullets && (
                  <ul className="list-disc space-y-2 pl-5 marker:text-primary">
                    {section.bullets.map((bullet) => <li key={bullet}>{bullet}</li>)}
                  </ul>
                )}
              </div>
            </section>
          ))}
        </div>

        <footer className="border-t border-primary/20 pt-10 text-sm leading-7 text-on-surface/60">
          Questions about these documents? Contact <a className="text-primary hover:underline" href="mailto:info@unifexsolutions.com">info@unifexsolutions.com</a> or visit the <Link className="text-primary hover:underline" href="/contact">contact page</Link>.
        </footer>
      </div>
    </main>
  )
}
