import type { Metadata } from 'next'

export const siteName = 'Unifex Solutions'
export const siteDescription = 'Unifex Solutions is a software development company building custom websites, web applications, and secure digital products for businesses.'
export const siteUrl = (process.env.NEXT_PUBLIC_SITE_URL || 'https://unifexsolutions.com').replace(/\/$/, '')
export const siteLogo = `${siteUrl}/logo.webp`

export function absoluteUrl(path = '/') {
  return `${siteUrl}${path.startsWith('/') ? path : `/${path}`}`
}

type SeoOptions = {
  title: string
  description: string
  path?: string
  image?: string | null
  type?: 'website' | 'article'
  noIndex?: boolean
}

export function buildMetadata({ title, description, path = '/', image, type = 'website', noIndex = false }: SeoOptions): Metadata {
  const imageUrl = image ? (image.startsWith('http') ? image : absoluteUrl(image)) : siteLogo
  return {
    title,
    description,
    alternates: { canonical: absoluteUrl(path) },
    robots: noIndex ? { index: false, follow: false } : { index: true, follow: true },
    openGraph: {
      title,
      description,
      url: absoluteUrl(path),
      siteName,
      type,
      images: [{ url: imageUrl, alt: image ? title : `${siteName} logo` }],
    },
    twitter: {
      card: 'summary_large_image',
      title,
      description,
      images: [imageUrl],
    },
  }
}
