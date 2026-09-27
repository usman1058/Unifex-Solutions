import crypto from 'node:crypto'
import { cookies } from 'next/headers'
import { db } from '@/lib/db'

export const ADMIN_SESSION_COOKIE = 'unifex_admin_session'

function getConfig() {
  if (
    process.env.NODE_ENV === 'production' &&
    (!process.env.ADMIN_EMAIL || !process.env.ADMIN_PASSWORD || !process.env.ADMIN_SESSION_SECRET)
  ) {
    throw new Error('ADMIN_EMAIL, ADMIN_PASSWORD, and ADMIN_SESSION_SECRET must be configured in production')
  }

  return {
    email: process.env.ADMIN_EMAIL || 'admin@example.com',
    password: process.env.ADMIN_PASSWORD || 'admin123',
    secret: process.env.ADMIN_SESSION_SECRET || 'development-only-change-me',
  }
}

function sign(value: string) {
  return crypto.createHmac('sha256', getConfig().secret).update(value).digest('hex')
}

function hashPassword(password: string) {
  return crypto.createHash('sha256').update(password).digest('hex')
}

export async function verifyCredentials(email: string, password: string) {
  const config = getConfig()
  if (email === config.email && password === config.password) return true

  // Database-backed admin users
  const admin = await db.adminUser.findUnique({ where: { email } })
  if (admin && admin.isActive && admin.passwordHash === hashPassword(password)) {
    return true
  }

  return false
}

export function createSessionToken() {
  const payload = `admin:${Date.now()}:${crypto.randomBytes(18).toString('base64url')}`
  return `${payload}.${sign(payload)}`
}

export function isValidSessionToken(token?: string) {
  if (!token) return false
  const separator = token.lastIndexOf('.')
  if (separator < 1) return false
  const payload = token.slice(0, separator)
  const signature = token.slice(separator + 1)
  const expected = sign(payload)
  if (signature.length !== expected.length) return false
  const validSignature = crypto.timingSafeEqual(Buffer.from(signature), Buffer.from(expected))
  if (!validSignature) return false
  const [scope, issuedAtValue] = payload.split(':')
  if (scope !== 'admin') return false
  const issuedAt = Number(issuedAtValue)
  return Number.isFinite(issuedAt) && Date.now() - issuedAt < 1000 * 60 * 60 * 24 * 7
}

export async function isAdminRequest() {
  const cookieStore = await cookies()
  return isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
}
