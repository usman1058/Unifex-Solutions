'use client'

import Link from 'next/link'
import { useEffect, useState } from 'react'

type ConsentChoice = 'accepted' | 'rejected'

export default function ConsentBanner() {
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    setVisible(window.localStorage.getItem('unifex_consent') === null)
    const reopen = () => setVisible(true)
    window.addEventListener('unifex:open-consent', reopen)
    return () => window.removeEventListener('unifex:open-consent', reopen)
  }, [])

  const choose = (choice: ConsentChoice) => {
    const wasAccepted = window.localStorage.getItem('unifex_consent') === 'accepted'
    window.localStorage.setItem('unifex_consent', choice)
    window.dispatchEvent(new CustomEvent('unifex:consent', { detail: { choice } }))
    setVisible(false)
    if (choice === 'rejected' && wasAccepted && document.querySelector('script[src^="https://pagead2.googlesyndication.com/pagead/js/adsbygoogle.js"]')) {
      window.location.reload()
    }
  }

  if (!visible) return null

  return (
    <aside id="privacy-choices" role="region" aria-labelledby="privacy-choices-title" className="fixed inset-x-4 bottom-4 z-[100] rounded-2xl border border-primary/35 bg-[#16120d]/95 p-5 text-white shadow-2xl backdrop-blur-xl sm:inset-x-auto sm:left-6 sm:max-w-xl">
      <p id="privacy-choices-title" className="text-sm font-bold uppercase tracking-[0.15em] text-primary">Privacy choices</p>
      <p className="mt-3 text-base leading-6 text-white/85">Google advertising is optional and appears on blog detail pages only after you accept. Rejecting keeps the ad script off this browser. Read our <Link className="text-primary underline underline-offset-4" href="/privacy">Privacy Policy</Link> and <Link className="text-primary underline underline-offset-4" href="/cookies">Cookie Policy</Link>.</p>
      <div className="mt-5 flex flex-wrap gap-3">
        <button type="button" onClick={() => choose('accepted')} className="min-h-11 rounded-full bg-primary px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-black">Accept optional</button>
        <button type="button" onClick={() => choose('rejected')} className="min-h-11 rounded-full border border-white/30 px-4 py-2 text-xs font-bold uppercase tracking-[0.12em] text-white">Reject optional</button>
      </div>
    </aside>
  )
}
