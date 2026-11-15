export type EditorialPost = {
  id: string
  slug: string
  title: string
  excerpt: string
  content: string
  author: string
  coverImage: string | null
  readTime: number
  publishedAt: string
  category: { name: string; slug: string }
  tags: string[]
}

// Original, practical editorial content used while the CMS has no complete
// published articles. It avoids exposing the incomplete demo seed entries.
export const editorialPosts: EditorialPost[] = [
  {
    id: 'editorial-performance-budget',
    slug: 'a-practical-performance-budget-for-growing-websites',
    title: 'A Practical Performance Budget for a Growing Website',
    excerpt: 'A lightweight way to keep pages responsive as features, media, and integrations accumulate.',
    author: 'Unifex Editorial Team',
    coverImage: null,
    readTime: 5,
    publishedAt: '2026-11-12T09:00:00.000Z',
    category: { name: 'Engineering', slug: 'engineering' },
    tags: ['Web performance', 'Core Web Vitals'],
    content: `<p>Performance usually slips a little at a time: a larger hero image, another analytics tag, a library for one small interaction. A performance budget makes those trade-offs visible before they become a slow first visit.</p>
<h2>Choose measures people can feel</h2>
<p>Start with the page experience, not a single score. Track loading, interaction responsiveness, and visual stability on the routes that matter most: the landing page, service details, contact flow, and checkout or application flow. Use field data when available, and keep a repeatable lab run for changes that are not yet live.</p>
<h2>Set a small number of guardrails</h2>
<p>Pick limits the team can act on. For example, agree on a maximum initial JavaScript size, a compressed hero-image ceiling, and a small allowance for third-party scripts. The right values depend on the product and audience; the useful part is measuring the same things every release.</p>
<ul><li>Resize and compress images before delivery, and provide responsive image sizes.</li><li>Load below-the-fold media lazily while keeping the main visual available early.</li><li>Remove unused code and defer non-essential analytics or chat tools.</li><li>Reserve space for images, embeds, and banners to prevent layout shifts.</li></ul>
<h2>Review budgets during delivery</h2>
<p>Check key pages on a mid-range phone and a typical laptop, with a cold cache as well as a warm one. When a budget is exceeded, identify the change and decide whether to optimize it, split it, or accept the cost with a clear reason. That turns speed into a product decision rather than a last-minute cleanup.</p>
<p>A practical budget is not a promise of instant loading on every connection. It is a shared way to notice regressions early and keep the experience usable as the product grows.</p>`,
  },
  {
    id: 'editorial-accessible-forms',
    slug: 'accessible-forms-that-help-people-finish-the-task',
    title: 'Accessible Forms That Help People Finish the Task',
    excerpt: 'Clear labels, useful errors, and keyboard support make forms easier for everyone to complete.',
    author: 'Unifex Editorial Team',
    coverImage: null,
    readTime: 6,
    publishedAt: '2026-11-08T09:00:00.000Z',
    category: { name: 'Product design', slug: 'product-design' },
    tags: ['Accessibility', 'Forms', 'UX'],
    content: `<p>A form is a conversation: it asks for information, explains why it is needed, and helps someone recover when an answer is missing or invalid. Good form design makes that conversation understandable with a mouse, keyboard, screen reader, or touch screen.</p>
<h2>Write labels that stay visible</h2>
<p>Give every field a persistent label. A placeholder can show an example, but it should not be the only instruction because it disappears when someone starts typing. Group related questions with a clear heading, and ask only for details needed to handle the request.</p>
<h2>Make errors specific and recoverable</h2>
<p>When validation fails, explain what needs attention and how to fix it. Connect the message to its field, move focus to a useful summary when appropriate, and preserve the answers already entered. Avoid relying on color alone; pair color with text or an icon.</p>
<ul><li>Use the correct input type for email, phone, and numeric values.</li><li>Keep keyboard focus visible and make the tab order follow the visual order.</li><li>Use generous touch targets and enough spacing to prevent accidental taps.</li><li>Confirm successful submission in text, and explain what happens next.</li></ul>
<h2>Test the full journey</h2>
<p>Complete the form using only a keyboard, then try it at a narrow viewport with browser zoom increased. If possible, test with a screen reader and check that labels, required state, and error messages are announced. Automated checks can catch missing names and contrast issues, but they cannot decide whether the instructions make sense.</p>
<p>These small choices reduce uncertainty for all visitors. They also help teams receive more useful enquiries because people can understand what to provide and what to expect.</p>`,
  },
  {
    id: 'editorial-api-security',
    slug: 'a-clear-starting-point-for-securing-a-web-api',
    title: 'A Clear Starting Point for Securing a Web API',
    excerpt: 'Practical first steps for protecting API access, validating input, and handling sensitive data.',
    author: 'Unifex Editorial Team',
    coverImage: null,
    readTime: 6,
    publishedAt: '2026-11-03T09:00:00.000Z',
    category: { name: 'Security', slug: 'security' },
    tags: ['API security', 'Software engineering'],
    content: `<p>API security is an ongoing engineering practice. A useful starting point is to make every endpoint's access rules, input expectations, and data exposure explicit, then test those rules as the product changes.</p>
<h2>Use authorization at the resource level</h2>
<p>Authentication establishes who made a request. Authorization must still check whether that identity can read or change the specific record. Apply least privilege, verify ownership on every sensitive operation, and avoid trusting an identifier supplied by the browser on its own.</p>
<h2>Treat input as untrusted</h2>
<p>Validate request bodies, query parameters, and uploaded files against a defined schema. Set sensible size and rate limits, use parameterized database operations, and return errors that help a client recover without exposing stack traces or internal details.</p>
<ul><li>Require HTTPS and store secrets outside source control.</li><li>Use short-lived credentials where appropriate and rotate exposed keys promptly.</li><li>Log security-relevant events while omitting passwords, tokens, and unnecessary personal data.</li><li>Review dependency updates and test important authorization boundaries automatically.</li></ul>
<h2>Plan for safe failure</h2>
<p>Make sure rate limits and error handling fail in a predictable way. Keep backups and a recovery plan for important data, and monitor unusual access patterns. Security testing should use authorized environments and written scope, especially for penetration testing.</p>
<p>No checklist can guarantee that an API will never have a vulnerability. These controls create a sound baseline, and regular review helps the baseline adapt as users, integrations, and data change.</p>`,
  },
]

export function getEditorialPost(slug: string) {
  return editorialPosts.find((post) => post.slug === slug)
}
