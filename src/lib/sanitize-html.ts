const ALLOWED_TAGS = new Set(['a', 'b', 'blockquote', 'br', 'code', 'div', 'em', 'h2', 'h3', 'h4', 'hr', 'i', 'li', 'ol', 'p', 'pre', 'span', 'strong', 'ul'])

/** Restrict CMS HTML to simple formatting and safe links before rendering it as markup. */
export function sanitizeCmsHtml(input: string): string {
  return input
    .replace(/<!--[\s\S]*?-->/g, '')
    .replace(/<(script|style|iframe|object|embed|svg|math|form|input|button)\b[^>]*>[\s\S]*?<\/\1\s*>/gi, '')
    .replace(/<\/?([a-z][\w:-]*)\b([^>]*)>/gi, (match, rawTag: string, rawAttrs: string) => {
      const tag = rawTag.toLowerCase()
      if (!ALLOWED_TAGS.has(tag)) return ''
      if (match.startsWith('</')) return `</${tag}>`
      if (tag === 'br' || tag === 'hr') return `<${tag}>`
      if (tag !== 'a') return `<${tag}>`
      const href = rawAttrs.match(/\bhref\s*=\s*(['"])(.*?)\1/i)?.[2]
      if (!href || !/^(https?:|mailto:|\/|#)/i.test(href) || /^\/\//.test(href)) return '<a>'
      return `<a href="${href.replace(/&/g, '&amp;').replace(/"/g, '&quot;')}" rel="nofollow noopener noreferrer">`
    })
}
