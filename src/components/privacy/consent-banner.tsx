'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type ConsentChoice = 'accepted' | 'rejected'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(window.localStorage.getItem('unifex_consent') === null)
  }, [])

  const choose = (choice: ConsentChoice) => {
    window.localStorage.setItem('unifex_consent', choice)
    window.dispatchEvent(new CustomEvent('unifex:consent', { detail: { choice } }))
    setVisible(false)
  }

  if (!visible) return null

  return (
    <aside className="fixed inset-x-4 bottom-4 z-[100] rounded-2xl border border-primary/30 bg-[#16120d]/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:left-6 sm:max-w-xl" aria-label="Privacy choices">
      <p className="text-xs font-bold uppercase tracking-[0.2em] text-primary">Privacy choices</p>
      <p className="mt-3 text-sm leading-6 text-white/70">We use essential technologies to operate this site and may use analytics or advertising technologies when enabled. Read our <Link className="text-primary underline" href="/privacy">Privacy Policy</Link> and <Link className="text-primary underline" href="/cookies">Cookie Policy</Link>.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button onClick={() => choose('accepted')} className="rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-black">Accept optional</button>
        <button onClick={() => choose('rejected')} className="rounded-full border border-white/20 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">Reject optional</button>
        <Link href="/cookies" className="rounded-full border border-primary/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-primary">Manage choices</Link>
      </div>
    </aside>
  )
}
