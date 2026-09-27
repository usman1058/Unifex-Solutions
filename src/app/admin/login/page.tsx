'use client'

import { useState, useEffect } from 'react'
import { useAdminAuth } from '@/contexts/admin-auth-context'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'

export default function AdminLoginPage() {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [loading, setLoading] = useState(false)
  const { login, isAuthenticated } = useAdminAuth()
  const router = useRouter()

  useEffect(() => {
    if (isAuthenticated) {
      router.push('/admin/dashboard')
    }
  }, [isAuthenticated, router])

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      const success = await login(email, password)
      if (success) {
        toast.success('Welcome back, Administrator', {
          description: 'Session established. Redirecting to dashboard…',
        })
        router.push('/admin/dashboard')
      } else {
        toast.error('Authentication Failed', {
          description: 'Invalid email or password. Please verify your credentials.',
        })
      }
    } catch {
      toast.error('Login Service Unavailable', {
        description: 'Could not reach the authentication service. Check the server terminal.',
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <main className="min-h-screen bg-background text-on-surface flex items-center justify-center px-6 py-24">
      <div className="w-full max-w-[520px] border border-outline-variant/15 bg-surface-container-low p-12">
        <div className="mb-12">
          <div className="flex items-center justify-between gap-8">
            <div>
              <div className="text-[10px] font-black tracking-[0.6em] text-primary uppercase">ADMIN ACCESS</div>
              <h1 className="mt-6 text-4xl font-headline font-black tracking-tighter uppercase">CONTROL PANEL</h1>
              <p className="mt-4 text-sm text-on-surface-variant">Unifex Solutions Dashboard Login</p>
            </div>
            <div className="w-16 h-16 bg-outline-variant/20 flex items-center justify-center">
              <span className="text-2xl font-headline font-black text-on-surface">U</span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-8">
          <div>
            <label className="block text-[10px] font-black tracking-[0.3em] uppercase text-on-surface/70 mb-3">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full bg-transparent border-b-2 border-outline-variant/20 px-0 py-4 text-sm tracking-wide focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <div>
            <label className="block text-[10px] font-black tracking-[0.3em] uppercase text-on-surface/70 mb-3">Password</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full bg-transparent border-b-2 border-outline-variant/20 px-0 py-4 text-sm tracking-wide focus:outline-none focus:border-primary transition-colors"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-gradient-to-br from-primary to-primary-container text-on-primary-fixed px-8 py-4 font-label font-bold tracking-tighter uppercase hover:opacity-90 transition-opacity disabled:opacity-60"
          >
            {loading ? 'Signing in…' : 'Sign In'}
          </button>
        </form>

        <div className="mt-10 pt-8 border-t border-outline-variant/10 text-[10px] tracking-[0.2em] uppercase text-on-surface/50">
          <div>Use the administrator credentials configured in the deployment environment.</div>
          <div className="mt-6">
            <Link href="/" className="text-on-surface/60 hover:text-primary transition-colors">
              ← Back to Website
            </Link>
          </div>
        </div>
      </div>
    </main>
  )
}
