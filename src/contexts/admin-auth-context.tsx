'use client'

import { createContext, useContext, useState, useEffect, ReactNode } from 'react'

interface AdminAuthContextType {
  isAuthenticated: boolean
  login: (email: string, password: string) => Promise<{ success: boolean; message?: string }>
  logout: () => void
  isLoading: boolean
}

const AdminAuthContext = createContext<AdminAuthContextType | undefined>(undefined)

export function AdminAuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 4000)

    fetch('/api/admin/session', { credentials: 'include', signal: controller.signal })
      .then((response) => {
        if (!response.ok) throw new Error('Session check failed')
        return response.json()
      })
      .then((data) => setIsAuthenticated(data.authenticated === true))
      .catch(() => setIsAuthenticated(false))
      .finally(() => {
        window.clearTimeout(timeout)
        setIsLoading(false)
      })

    return () => {
      window.clearTimeout(timeout)
      controller.abort()
    }
  }, [])

  const login = async (email: string, password: string): Promise<{ success: boolean; message?: string }> => {
    const controller = new AbortController()
    const timeout = window.setTimeout(() => controller.abort(), 12000)

    try {
      const response = await fetch('/api/admin/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
        signal: controller.signal,
        body: JSON.stringify({ email, password }),
      })
      const data = await response.json().catch(() => null)
      const success = response.ok && data?.success === true
      setIsAuthenticated(success)
      return {
        success,
        message: data?.error?.message || (response.ok ? undefined : 'The login service returned an unexpected response.'),
      }
    } finally {
      window.clearTimeout(timeout)
    }
  }

  const logout = () => {
    void fetch('/api/admin/logout', { method: 'POST', credentials: 'include' })
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
