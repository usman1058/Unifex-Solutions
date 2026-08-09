import crypto from 'node:crypto'
import { cookies } from 'next/headers'

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

export function verifyCredentials(email: string, password: string) {
  const config = getConfig()
  return email === config.email && password === config.password
}

export function createSessionToken() {
  const payload = `admin:${Date.now()}`
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
  const issuedAt = Number(payload.split(':')[1])
  return Number.isFinite(issuedAt) && Date.now() - issuedAt < 1000 * 60 * 60 * 24 * 7
}

export async function isAdminRequest() {
  const cookieStore = await cookies()
  return isValidSessionToken(cookieStore.get(ADMIN_SESSION_COOKIE)?.value)
}
