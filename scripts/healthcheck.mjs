const baseUrl = process.env.HEALTHCHECK_URL || 'http://localhost:3000'
const paths = ['/', '/manifest.webmanifest', '/robots.txt', '/sitemap.xml', '/api/health']

let failed = false
for (const path of paths) {
  try {
    const response = await fetch(`${baseUrl}${path}`)
    const expected = path === '/api/health' ? [200, 503] : [200]
    if (!expected.includes(response.status)) {
      failed = true
      console.error(`[healthcheck] ${path}: unexpected HTTP ${response.status}`)
    } else {
      console.log(`[healthcheck] ${path}: ${response.status}`)
    }
  } catch (error) {
    failed = true
    console.error(`[healthcheck] ${path}: ${error.message}`)
  }
}

if (failed) process.exitCode = 1
