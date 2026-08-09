import { mkdir } from 'node:fs/promises'
import { resolve } from 'node:path'

const outDir = resolve(process.cwd(), 'artifacts', 'visual')

const viewports = [
  { w: 375, h: 812, label: 'mobile' },
  { w: 768, h: 1024, label: 'tablet' },
  { w: 1440, h: 900, label: 'desktop' },
]

async function main() {
  const { chromium } = await import('playwright')
  await mkdir(outDir, { recursive: true })

  const browser = await chromium
    .launch({ channel: 'chrome' })
    .catch(() => chromium.launch({ channel: 'msedge' }))

  try {
    for (const vp of viewports) {
      const context = await browser.newContext({
        viewport: { width: vp.w, height: vp.h },
        deviceScaleFactor: 1,
      })
      const page = await context.newPage()
      
      console.log(`Capturing ${vp.label} (${vp.w}x${vp.h})...`)
      await page.goto('http://localhost:3000/', { waitUntil: 'domcontentloaded', timeout: 30000 })
      await page.waitForTimeout(2000)

      const filePath = resolve(outDir, `unifex_home_${vp.label}_${vp.w}x${vp.h}.png`)
      await page.screenshot({ path: filePath, fullPage: true })
      console.log(`Saved: ${filePath}`)

      await page.close()
      await context.close()
    }
  } finally {
    await browser.close()
  }
}

main().catch(console.error)
