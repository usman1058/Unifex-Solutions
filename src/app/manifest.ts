import type { MetadataRoute } from 'next'

export default function manifest(): MetadataRoute.Manifest {
  return {
    name: 'Unifex Solutions',
    short_name: 'Unifex',
    description: 'High-performance software, secure systems, and digital products by Unifex Solutions.',
    start_url: '/',
    display: 'standalone',
    background_color: '#0a0a0a',
    theme_color: '#0a0a0a',
    icons: [{ src: '/logo.webp', sizes: '675x663', type: 'image/webp', purpose: 'any maskable' }],
  }
}
