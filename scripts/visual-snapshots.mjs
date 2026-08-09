import { mkdir, writeFile } from 'node:fs/promises'
import { dirname, resolve } from 'node:path'

const outDir = resolve(process.cwd(), 'artifacts', 'visual')

const targets = [
  { path: '/', name: 'home' },
  { path: '/services', name: 'services' },
  { path: '/portfolio', name: 'portfolio' },
  { path: '/blog', name: 'blog' },
  { path: '/contact', name: 'contact' },
  { path: '/admin/login', name: 'admin-login' },
]

const viewports = [
  { w: 375, h: 812, label: 'mobile' },
  { w: 768, h: 1024, label: 'tablet' },
  { w: 1440, h: 900, label: 'desktop' },
  { w: 1920, h: 1080, label: 'wide' },
]

async function main() {
  const { chromium } = await import('playwright')

  await mkdir(outDir, { recursive: true })

  const baseUrl = process.env.VISUAL_BASE_URL || 'http://localhost:3000'
  const browser =
    (await chromium
      .launch({ channel: 'chrome' })
      .catch(() => chromium.launch({ channel: 'msedge' }))
      .catch(() => chromium.launch()))

  try {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 1,
      })
      const page = await context.newPage()
      page.setDefaultNavigationTimeout(120_000)
      page.setDefaultTimeout(120_000)

      for (const t of targets) {
        const url = new URL(t.path, baseUrl).toString()
        // Some routes may keep the network busy (API errors, long polling).
        // We only require a committed navigation and best-effort DOM readiness.
        try {
          await page.goto(url, { waitUntil: 'commit', timeout: 60_000 })
        } catch {
          // still try to screenshot whatever rendered
        }
        await page.waitForLoadState('domcontentloaded', { timeout: 60_000 }).catch(() => {})
        await page.waitForTimeout(900) // allow fonts + initial motion settle

        const filePath = resolve(outDir, `${t.name}__${vp.label}__${vp.w}x${vp.h}.png`)
        await mkdir(dirname(filePath), { recursive: true })
        await page.screenshot({ path: filePath, fullPage: true })
      }

      await page.close()
      await context.close()
    }
  } finally {
    await browser.close()
  }

  const manifestPath = resolve(outDir, 'manifest.json')
  await writeFile(
    manifestPath,
    JSON.stringify(
      {
        baseUrl: process.env.VISUAL_BASE_URL || 'http://localhost:3000',
        createdAt: new Date().toISOString(),
        targets,
        viewports,
      },
      null,
      2,
    ),
  )
}

main().catch((err) => {
  console.error(err)
  process.exit(1)
})

