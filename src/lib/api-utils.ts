// API Response Types and Helpers

export interface ApiResponse<T = any> {
  success: boolean
  data?: T
  error?: {
    code: string
    message: string
    details?: any
  }
  meta?: {
    total?: number
    page?: number
    limit?: number
    hasMore?: boolean
  }
}

export interface PaginationParams {
  page?: number
  limit?: number
  sortBy?: string
  sortOrder?: 'asc' | 'desc'
}

export interface FilterParams {
  published?: boolean
  featured?: boolean
  category?: string
  tag?: string
  search?: string
}

// Success Response Helper
export function successResponse<T>(data: T, meta?: any): ApiResponse<T> {
  return {
    success: true,
    data,
    meta
  }
}

// Error Response Helper
export function errorResponse(code: string, message: string, details?: any): ApiResponse {
  return {
    success: false,
    error: {
      code,
      message,
      details
    }
  }
}

// Parse Pagination Params
export function parsePaginationParams(searchParams: URLSearchParams) {
  const page = Math.max(1, parseInt(searchParams.get('page') || '1'))
  const limit = Math.min(100, Math.max(1, parseInt(searchParams.get('limit') || '10')))
  const sortBy = searchParams.get('sortBy') || 'createdAt'
  const sortOrder = (searchParams.get('sortOrder') === 'asc' ? 'asc' : 'desc') as 'asc' | 'desc'

  return { page, limit, sortBy, sortOrder }
}

// Calculate Pagination Meta
export function calculatePaginationMeta(total: number, page: number, limit: number) {
  return {
    total,
    page,
    limit,
    totalPages: Math.ceil(total / limit),
    hasMore: page * limit < total
  }
}

// Generate Slug from Title
export function generateSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^\w\s-]/g, '')
    .replace(/\s+/g, '-')
    .replace(/-+/g, '-')
    .trim()
}

// Validate Email
export function isValidEmail(email: string): boolean {
  const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/
  return emailRegex.test(email)
}

// Validate URL
export function isValidUrl(url: string): boolean {
  try {
    new URL(url)
    return true
  } catch {
    return false
  }
}

// Sanitize HTML (basic)
export function sanitizeHtml(html: string): string {
  // Basic sanitization - in production, use a library like DOMPurify
  return html
    .replace(/<script\b[^<]*(?:(?!<\/script>)<[^<]*)*<\/script>/gi, '')
    .replace(/<iframe\b[^<]*(?:(?!<\/iframe>)<[^<]*)*<\/iframe>/gi, '')
}

// Extract plain text from HTML
export function extractTextFromHtml(html: string): string {
  return html.replace(/<[^>]*>/g, '').trim()
}

// Truncate text
export function truncateText(text: string, maxLength: number, suffix: string = '...'): string {
  if (text.length <= maxLength) return text
  return text.slice(0, maxLength - suffix.length).trim() + suffix
}

// Calculate reading time (words per minute = 200)
export function calculateReadingTime(content: string): number {
  const words = content.split(/\s+/).length
  return Math.ceil(words / 200)
}
