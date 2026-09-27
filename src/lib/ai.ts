import { db } from '@/lib/db'
import { createFallbackBlogImage, storeGeneratedImage } from '@/lib/media'

export type AIProvider = 'local' | 'openai' | 'anthropic' | 'google' | 'custom'

export const LOCAL_AI_MODEL = 'Xenova/LaMini-Flan-T5-77M'
export const DEFAULT_IMAGE_MODEL = 'black-forest-labs/FLUX.1-schnell'

export type ImageProvider = 'fallback' | 'gemini' | 'huggingface' | 'custom'

export interface AIConfig {
  provider: AIProvider
  apiKey: string
  model: string
  baseUrl: string
}

export interface ImageConfig {
  provider: ImageProvider
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

// Resolve AI configuration from the AppSetting store. API keys are deliberately
// settings-only so they are never copied from deployment environment variables
// into request handling or client-visible configuration.
export async function getAIConfig(): Promise<AIConfig> {
  const [provider, apiKey, model, baseUrl] = await Promise.all([
    db.appSetting.findUnique({ where: { key: 'ai_provider' } }),
    db.appSetting.findUnique({ where: { key: 'ai_api_key' } }),
    db.appSetting.findUnique({ where: { key: 'ai_model' } }),
    db.appSetting.findUnique({ where: { key: 'ai_base_url' } }),
  ])

  const storedProvider = provider?.value as AIProvider | undefined
  const storedModel = model?.value || process.env.AI_MODEL || ''
  const storedKey = apiKey?.value || ''
  const legacySeed = storedProvider === 'openai' && !storedKey && (!model?.value || model.value === 'gpt-4o-mini')
  return {
    provider: legacySeed ? 'local' : storedProvider || (process.env.AI_PROVIDER as AIProvider) || 'local',
    apiKey: apiKey?.value || '',
    model: legacySeed ? LOCAL_AI_MODEL : storedModel || LOCAL_AI_MODEL,
    baseUrl: baseUrl?.value || process.env.AI_BASE_URL || '',
  }
}

export async function getImageConfig(): Promise<ImageConfig> {
  const [provider, apiKey, model, baseUrl] = await Promise.all([
    db.appSetting.findUnique({ where: { key: 'image_provider' } }),
    db.appSetting.findUnique({ where: { key: 'image_api_key' } }),
    db.appSetting.findUnique({ where: { key: 'image_model' } }),
    db.appSetting.findUnique({ where: { key: 'image_base_url' } }),
  ])
  return {
    provider: (provider?.value as ImageProvider) || (process.env.IMAGE_PROVIDER as ImageProvider) || 'fallback',
    apiKey: apiKey?.value || '',
    model: model?.value || process.env.IMAGE_MODEL || (provider?.value === 'gemini' ? 'gemini-3.1-flash-image' : DEFAULT_IMAGE_MODEL),
    baseUrl: baseUrl?.value || process.env.IMAGE_BASE_URL || '',
  }
}

export async function generateBlogImageUrl(topic: string): Promise<string> {
  const config = await getImageConfig()
  if (!topic.trim()) throw new Error('Image topic is required')
  if (!config.apiKey || config.provider === 'fallback') {
    return storeGeneratedImage(createFallbackBlogImage(topic), 'image/svg+xml')
  }

  try {
    const generated = config.provider === 'gemini'
      ? await generateGeminiImage(topic, config)
      : await generateHuggingFaceImage(topic, config)
    return storeGeneratedImage(generated.data, generated.mimeType)
  } catch {
    // Do not log provider responses here: they can contain request metadata or
    // sensitive diagnostics. The fallback keeps scheduled publishing reliable.
    console.warn('[ai] Image generation failed; using branded fallback')
    return storeGeneratedImage(createFallbackBlogImage(topic), 'image/svg+xml')
  }
}

async function generateGeminiImage(topic: string, config: ImageConfig): Promise<{ data: Uint8Array; mimeType: string }> {
  const model = config.model || 'gemini-3.1-flash-image'
  const baseUrl = (config.baseUrl || 'https://generativelanguage.googleapis.com/v1beta').replace(/\/$/, '')
  const response = await fetch(`${baseUrl}/models/${encodeURIComponent(model)}:generateContent?key=${encodeURIComponent(config.apiKey)}`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      contents: [{ parts: [{ text: `Create a clean editorial blog cover image, 16:9 composition, no readable text, for this topic: ${topic}` }] }],
      generationConfig: { responseModalities: ['IMAGE', 'TEXT'] },
    }),
  })
  if (!response.ok) throw new Error(`Gemini image request failed (${response.status})`)
  const body = await response.json()
  const part = body.candidates?.[0]?.content?.parts?.find((item: any) => item.inlineData?.data)
  if (!part?.inlineData?.data) throw new Error('Gemini returned no image')
  return { data: Uint8Array.from(Buffer.from(part.inlineData.data, 'base64')), mimeType: part.inlineData.mimeType || 'image/png' }
}

async function generateHuggingFaceImage(topic: string, config: ImageConfig): Promise<{ data: Uint8Array; mimeType: string }> {
  const baseUrl = (config.baseUrl || 'https://router.huggingface.co/hf-inference/models').replace(/\/$/, '')
  const response = await fetch(`${baseUrl}/${config.model}`, {
    method: 'POST',
    headers: { Authorization: `Bearer ${config.apiKey}`, 'Content-Type': 'application/json' },
    body: JSON.stringify({ inputs: `Editorial blog cover, modern technology magazine style, 16:9, no text: ${topic}` }),
  })
  if (!response.ok) throw new Error(`Hugging Face image request failed (${response.status})`)
  const mimeType = response.headers.get('content-type')?.split(';')[0] || 'image/png'
  return { data: new Uint8Array(await response.arrayBuffer()), mimeType }
}

export async function ensureAIConfigured(): Promise<{ configured: boolean; provider: AIProvider; model: string; reason?: string }> {
  const cfg = await getAIConfig()
  if (cfg.provider === 'local') {
    return { configured: true, provider: 'local', model: cfg.model || LOCAL_AI_MODEL }
  }
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
  if (cfg.provider === 'local') {
    return runLocalModel(messages.map((message) => `${message.role}: ${message.content}`).join('\n'), opts.maxTokens ?? 180)
  }
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

let localGeneratorPromise: Promise<any> | null = null

async function runLocalModel(prompt: string, maxTokens: number): Promise<string> {
  if (!localGeneratorPromise) {
    localGeneratorPromise = (async () => {
      const { env, pipeline } = await import('@huggingface/transformers')
      env.cacheDir = process.env.LOCAL_AI_CACHE_DIR || '.cache/transformers'
      return pipeline('text2text-generation', LOCAL_AI_MODEL, { dtype: 'q4' })
    })()
  }
  const generator = await localGeneratorPromise
  const output = await generator(prompt, { max_new_tokens: Math.min(Math.max(maxTokens, 32), 256), temperature: 0.7 })
  return String(output?.[0]?.generated_text || '').trim()
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

  let raw = ''
  try {
    raw = await chatCompletion(
      [
        { role: 'system', content: sys },
        { role: 'user', content: user },
      ],
      { temperature: 0.8, maxTokens: 700 }
    )
  } catch (error) {
    if ((await getAIConfig()).provider !== 'local') throw error
    return localFallbackSocialPost(topic, brand, maxWords)
  }

  try {
    const cleaned = raw.trim().replace(/```(json)?/gi, '').trim()
    const parsed = JSON.parse(cleaned)
    return {
      title: String(parsed.title || '').trim(),
      content: String(parsed.content || '').trim(),
    }
  } catch {
    // Fallback: treat entire output as content with a generic title.
    return { title: topic, content: `<p>${raw || `A practical look at ${topic}.`}</p>` }
  }
}

function localFallbackSocialPost(topic: string, brand: string, maxWords: number) {
  const safeTopic = topic.replace(/[<>]/g, '').trim() || 'software delivery'
  const content = `${safeTopic} deserves a clear plan, measurable outcomes, and secure execution. ${brand} helps teams turn complex digital work into reliable systems with practical next steps.`
  return {
    title: safeTopic.slice(0, 90),
    content: `<p>${content.split(/\s+/).slice(0, maxWords).join(' ')}</p>`,
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
    const result = await chatCompletion(
      [
        { role: 'system', content: sys },
        { role: 'user', content: `Write the ${platform} post now.` },
      ],
      { temperature: 0.9, maxTokens: 200 }
    )
    return result.slice(0, maxChars).trim()
  } catch {
    return `${topic}#tech #software #cybersecurity`
  }
}
