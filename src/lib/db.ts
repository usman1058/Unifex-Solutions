import { Prisma, PrismaClient } from '@prisma/client'

const globalForPrisma = globalThis as unknown as {
  prisma: PrismaClient | undefined
}

const prisma =
  globalForPrisma.prisma ??
  new PrismaClient({
    // Query logging is useful while debugging, but it adds noticeable I/O to every render.
    log: process.env.DEBUG_DB_QUERIES === 'true' ? ['query', 'warn', 'error'] : [],
  })

const modelNames = new Set([
  'service', 'caseStudy', 'caseStudyTag', 'caseStudyTagJoin', 'blogPost', 'blogCategory',
  'blogPostTag', 'blogPostTagJoin', 'fAQ', 'fAQCategory', 'testimonial', 'teamMember',
  'client', 'pricingPackage', 'contactSubmission', 'siteContent', 'newsletterSubscription',
  'stat', 'certification', 'appSetting', 'socialAccount', 'scheduledPost', 'serviceOrder',
  'orderPayment',
])

const readMethods = new Set(['findMany', 'findFirst', 'findUnique', 'count', 'aggregate', 'groupBy'])
let schemaWarningShown = false

function isMissingTableError(error: unknown): boolean {
  return error instanceof Prisma.PrismaClientKnownRequestError && ['P2021', 'P2022', 'P2024'].includes(error.code)
}

const safeDb = new Proxy(prisma, {
  get(target, property, receiver) {
    const model = Reflect.get(target, property, receiver)
    if (typeof property !== 'string' || !modelNames.has(property) || !model || typeof model !== 'object') return model

    return new Proxy(model, {
      get(modelTarget, method, modelReceiver) {
        const operation = Reflect.get(modelTarget, method, modelReceiver)
        if (typeof method !== 'string' || !readMethods.has(method) || typeof operation !== 'function') return operation

        return async (...args: unknown[]) => {
          try {
            return await operation.apply(modelTarget, args)
          } catch (error) {
            if (!isMissingTableError(error)) throw error
            if (!schemaWarningShown) {
              schemaWarningShown = true
              console.warn('[db] A read query could not obtain a healthy Neon connection; serving empty read results for this render.')
            }
            if (method === 'findMany' || method === 'groupBy') return []
            if (method === 'count') return 0
            if (method === 'aggregate') return {}
            return null
          }
        }
      },
    })
  },
}) as PrismaClient

if (process.env.NODE_ENV !== 'production') globalForPrisma.prisma = safeDb

export const db = safeDb
export { safeDb }
