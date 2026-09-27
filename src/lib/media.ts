import crypto from 'node:crypto'
import { mkdir, writeFile } from 'node:fs/promises'
import path from 'node:path'

const MIME_EXTENSIONS: Record<string, string> = {
  'image/png': '.png',
  'image/jpeg': '.jpg',
  'image/webp': '.webp',
  'image/svg+xml': '.svg',
}

export async function storeGeneratedImage(data: Uint8Array, mimeType: string): Promise<string> {
  const extension = MIME_EXTENSIONS[mimeType] || '.png'
  const filename = `ai-${Date.now()}-${crypto.randomBytes(8).toString('hex')}${extension}`
  const directory = path.join(process.cwd(), 'public', 'uploads')
  await mkdir(directory, { recursive: true })
  await writeFile(path.join(directory, filename), data)
  return `/uploads/${filename}`
}

export function createFallbackBlogImage(topic: string): Uint8Array {
  const safeTopic = topic.replace(/[<>&"']/g, '').slice(0, 100) || 'Unifex dispatch'
  const svg = `<svg xmlns="http://www.w3.org/2000/svg" width="1600" height="900" viewBox="0 0 1600 900"><rect width="1600" height="900" fill="#10110e"/><circle cx="1250" cy="150" r="360" fill="#d5ff00" opacity=".16"/><path d="M0 760 1600 240" stroke="#d5ff00" stroke-width="2" opacity=".45"/><text x="100" y="220" fill="#d5ff00" font-family="Arial,sans-serif" font-size="28" font-weight="700" letter-spacing="8">UNIFEX / FIELD NOTE</text><text x="100" y="430" fill="#fff" font-family="Arial,sans-serif" font-size="74" font-weight="700">${safeTopic}</text><text x="100" y="790" fill="#fff" opacity=".55" font-family="Arial,sans-serif" font-size="22" letter-spacing="4">SYSTEMS IN MOTION</text></svg>`
  return new TextEncoder().encode(svg)
}
