export function isPlaceholderProjectUrl(projectUrl: string | null | undefined): boolean {
  if (!projectUrl) return false

  try {
    const normalizedUrl = /^[a-z][a-z\d+.-]*:/i.test(projectUrl) ? projectUrl : `https://${projectUrl}`
    const hostname = new URL(normalizedUrl).hostname.toLowerCase().replace(/^www\./, '')
    return hostname === 'example.com' || hostname.endsWith('.example.com')
  } catch {
    return false
  }
}
