import type { ScheduledPost, SocialAccount } from '@prisma/client'

type PublishResult = { attempted: boolean; provider: string; skipped?: boolean }

function readConfig(account: SocialAccount): Record<string, string> {
  if (!account.config) return {}
  try {
    const value = JSON.parse(account.config)
    return value && typeof value === 'object' ? value : {}
  } catch {
    return {}
  }
}

function plainText(value: string): string {
  return value.replace(/<[^>]*>/g, ' ').replace(/\s+/g, ' ').trim()
}

async function assertResponse(response: Response, provider: string) {
  if (!response.ok) throw new Error(`${provider} publishing failed (${response.status})`)
}

export async function publishScheduledPost(post: ScheduledPost, account: SocialAccount | null): Promise<PublishResult> {
  if (post.platform === 'blog' || !account) {
    return { attempted: false, provider: 'internal', skipped: true }
  }
  if (!account.enabled) throw new Error(`The ${account.name} account is disabled`)
  if (account.platform !== post.platform) throw new Error('The selected social account does not match the scheduled platform')

  const config = readConfig(account)
  const text = plainText(post.content)

  if (post.platform === 'facebook') {
    if (!config.pageId || !config.accessToken) throw new Error('Facebook requires a Page ID and Page access token')
    const body = new URLSearchParams({ message: text, access_token: config.accessToken })
    if (post.link) body.set('link', post.link)
    const response = await fetch(`https://graph.facebook.com/v21.0/${encodeURIComponent(config.pageId)}/feed`, { method: 'POST', body })
    await assertResponse(response, 'Facebook')
    return { attempted: true, provider: 'facebook' }
  }

  if (post.platform === 'linkedin') {
    if (!config.authorUrn || !config.accessToken) throw new Error('LinkedIn requires an author URN and access token')
    const shareContent: Record<string, unknown> = {
      shareCommentary: { text },
      shareMediaCategory: post.link ? 'ARTICLE' : 'NONE',
    }
    if (post.link) shareContent.media = [{ status: 'READY', originalUrl: post.link, title: { text: post.title } }]
    const response = await fetch('https://api.linkedin.com/v2/ugcPosts', {
      method: 'POST',
      headers: {
        Authorization: `Bearer ${config.accessToken}`,
        'Content-Type': 'application/json',
        'X-Restli-Protocol-Version': '2.0.0',
      },
      body: JSON.stringify({ author: config.authorUrn, lifecycleState: 'PUBLISHED', specificContent: { 'com.linkedin.ugc.ShareContent': shareContent }, visibility: { 'com.linkedin.ugc.MemberNetworkVisibility': 'PUBLIC' } }),
    })
    await assertResponse(response, 'LinkedIn')
    return { attempted: true, provider: 'linkedin' }
  }

  if (post.platform === 'youtube') {
    if (!config.webhookUrl) throw new Error('YouTube blog publishing requires a webhook URL connected to your video workflow')
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(config.webhookSecret ? { Authorization: `Bearer ${config.webhookSecret}` } : {}) },
      body: JSON.stringify({ title: post.title, content: text, link: post.link, imageUrl: post.imageUrl, platform: 'youtube' }),
    })
    await assertResponse(response, 'YouTube workflow')
    return { attempted: true, provider: 'youtube-webhook' }
  }

  if (post.platform === 'generic-webhook') {
    if (!config.webhookUrl) throw new Error('A webhook URL is required')
    const response = await fetch(config.webhookUrl, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', ...(config.webhookSecret ? { Authorization: `Bearer ${config.webhookSecret}` } : {}) },
      body: JSON.stringify({ title: post.title, content: text, link: post.link, imageUrl: post.imageUrl, platform: post.platform }),
    })
    await assertResponse(response, 'Webhook')
    return { attempted: true, provider: 'webhook' }
  }

  return { attempted: false, provider: post.platform, skipped: true }
}
