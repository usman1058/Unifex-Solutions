'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<boolean>
  logout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    queueMicrotask(async () => {
      try {
        const res = await fetch('/api/admin/session')
        const data = await res.json()
        setIsAuthenticated(Boolean(data.authenticated))
      } catch (e) {
        console.warn('Failed to verify admin session:', e)
        setIsAuthenticated(false)
      } finally {
        setIsLoading(false)
      }
    })
  }, [])

  const login = async (email: string, password: string): Promise<boolean> => {
    try {
      const res = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        localStorage.setItem('adminAuth', 'true')
        setIsAuthenticated(true)
        return true
      }
      return false
    } catch (e) {
      console.warn('Admin login request failed:', e)
      return false
    }
  }

  const logout = () => {
    fetch('/api/admin/logout', { method: 'POST' }).catch(() => {})
    localStorage.removeItem('adminAuth')
    setIsAuthenticated(false)
  }

  return (
    <AdminAuthContext.Provider value={{ isAuthenticated, login, logout, isLoading }}>
      {children}
    </AdminAuthContext.Provider>
  )
}

export function useAdminAuth() {
  const context = useContext(AdminAuthContext)
  if (context === undefined) {
    throw new Error('useAdminAuth must be used within an AdminAuthProvider')
  }
  return context
}
