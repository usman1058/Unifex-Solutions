import { db } from '@/lib/db'

export type AIProvider = 'openai' | 'anthropic' | 'google' | 'custom'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
  model: string
  baseUrl: string
}

export function ngcDefaultTopTopics(): string[] {
  return [
    'software development trends',
    'cybersecurity best practices',
    'cloud architecture',
    'AI engineering'
  ]
}

// Resolve AI configuration from the AppSetting store, falling back to env vars.
export async function getAIConfig(): Promise<AIConfig> {
  const [provider, apiKey, model, baseUrl] = await Promise.all([
    db.appSetting.findUnique({ where: { key: 'ai_provider' } }),
    db.appSetting.findUnique({ where: { key: 'ai_api_key' } }),
    db.appSetting.findUnique({ where: { key: 'ai_model' } }),
    db.appSetting.findUnique({ where: { key: 'ai_base_url' } }),
  ])

  return {
    provider: (provider?.value as AIProvider) || (process.env.AI_PROVIDER as AIProvider) || 'openai',
    apiKey: apiKey?.value || process.env.AI_API_KEY || '',
    model: model?.value || process.env.AI_MODEL || 'gpt-4o-mini',
    baseUrl: baseUrl?.value || process.env.AI_BASE_URL || '',
  }
}

export async function ensureAIConfigured(): Promise<{ configured: boolean; provider: AIProvider; model: string; reason?: string }> {
  const cfg = await getAIConfig()
  if (!cfg?.apiKey) {
    return { configured: false, provider: cfg?.provider || 'openai', model: cfg?.model || '', reason: 'No AI API key configured. Add one in Admin → Settings.' }
  }
  return { configured: true, provider: cfg.provider, model: cfg.model }
}

interface ChatMessage {
  role: 'system' | 'user' | 'assistant'
  content: string
}

// Generic chat completion across supported providers.
export async function chatCompletion(
  messages: ChatMessage[],
  opts: { temperature?: number; maxTokens?: number } = {}
): Promise<string> {
  const cfg = await getAIConfig()
  if (!cfg?.apiKey) {
    throw new Error('AI is not configured. Add an API key under Admin → Settings.')
  }

  const temperature = opts.temperature ?? 0.7
  const maxTokens = opts.maxTokens ?? 600
  const baseUrl = normalizeBaseUrl(cfg.provider, cfg.baseUrl)

  const body: Record<string, unknown> = {
    model: cfg.model,
    messages,
    temperature,
    max_tokens: maxTokens,
  }

  let url = `${baseUrl}/chat/completions`
  let headers: Record<string, string> = { 'Content-Type': 'application/json' }
  let key = 'apiKey'

  if (cfg.provider === 'anthropic') {
    headers = {
      'Content-Type': 'application/json',
      'x-api-key': cfg.apiKey,
      'anthropic-version': '2023-06-01',
    }
    body.messages = body.messages as ChatMessage[] | undefined
    delete body.messages
    const sys = messages.filter((m) => m.role === 'system').map((m) => m.content)
    body.system = sys[sys.length - 1] || ''
    body.messages = messages.filter((m) => m.role !== 'system')
    key = 'text'
  } else if (cfg.provider === 'google') {
    key = 'text'
    url = `${baseUrl}/${cfg.model}:generateContent`
    headers = { 'Content-Type': 'application/json', 'x-goog-api-key': cfg.apiKey }
    body.contents = messages.map((m) => ({
      role: m.role === 'assistant' ? 'model' : 'user',
      parts: [{ text: m.content }],
    }))
    body.generationConfig = { temperature, maxOutputTokens: maxTokens }
    delete body.model
    delete body.messages
    delete body.max_tokens
  } else {
    headers.Authorization = `Bearer ${cfg.apiKey}`
  }

  const res = await fetch(url, {
    method: 'POST',
    headers,
    body: JSON.stringify(body),
  })

  if (!res.ok) {
    const text = await res.text()
    throw new Error(`AI request failed (${res.status}): ${text.slice(0, 300)}`)
  }

  const data = await res.json()
  return extractText(data, cfg.provider, key)
}

function normalizeBaseUrl(provider: AIProvider, baseUrl: string): string {
  if (baseUrl) return baseUrl.replace(/\/$/, '')
  switch (provider) {
    case 'openai':
      return 'https://api.openai.com/v1'
    case 'anthropic':
      return 'https://api.anthropic.com/v1'
    case 'google':
      return 'https://generativelanguage.googleapis.com/v1beta'
    default:
      return 'https://api.openai.com/v1'
  }
}

function extractText(data: any, provider: AIProvider, key: string): string {
  if (provider === 'anthropic') {
    return (data.content?.[0]?.text || '').trim()
  }
  if (provider === 'google') {
    return (data.candidates?.[0]?.content?.parts?.[0]?.text || '').trim()
  }
  return (data.choices?.[0]?.message?.content || '').trim()
}

// Generate a ready-to-publish social/media post from a topic.
export async function generateSocialPost(topic: string, ctx: { brand?: string; tone?: string; maxWords?: number } = {}): Promise<{ title: string; content: string }> {
  const brand = ctx.brand || 'Unifex Solutions'
  const tone = ctx.tone || 'professional, concise, engaging'
  const maxWords = ctx.maxWords || 120

  const sys = [
    `You are the content strategist for ${brand}, a software development + cyber security agency.`,
    `Write a NEW, original, publication-ready blog post about: "${topic}".`,
    `It must be factually plausible, insightful, and actionable.`,
    `Return ONLY strict JSON with exactly two keys: "title" and "content".`,
    `"content" must be plain HTML paragraphs with no more than ~${maxWords} words.`,
  ].join(' ')

  const user = 'Topic: ' + topic + '\nTone: ' + tone + '\nReturn JSON:\n{"title":"...","content":"<p>...</p>"}'

  const raw = await chatCompletion(
    [
      { role: 'system', content: sys },
      { role: 'user', content: user },
    ],
    { temperature: 0.8, maxTokens: 700 }
  )

  try {
    const cleaned = raw.trim().replace(/```(json)?/gi, '').trim()
    const parsed = JSON.parse(cleaned)
    return {
      title: String(parsed.title || '').trim(),
      content: String(parsed.content || '').trim(),
    }
  } catch {
    // Fallback: treat entire output as content with a generic title.
    return { title: topic, content: `<p>${raw}</p>` }
  }
}

// Quickly produce a short status/social snippet for a given topic.
export async function generateSocialSnippet(topic: string, platform: string, maxChars = 280): Promise<string> {
  const sys = [
    'You write engaging short social media posts.',
    `Produce a ${platform} post (max ${maxChars} chars) about: "${topic}".`,
    'Include 2-4 relevant hashtags. Plain text only.',
  ].join(' ')

  try {
    return await chatCompletion(
      [
        { role: 'system', content: sys },
        { role: 'user', content: `Write the ${platform} post now.` },
      ],
      { temperature: 0.9, maxTokens: 200 }
    )
  } catch {
    return `${topic}#tech #software #cybersecurity`
  }
}