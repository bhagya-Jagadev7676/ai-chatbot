// OpenRouter API client using native fetch (no SDK required)

export type ChatMessage = {
  role: 'user' | 'assistant'
  content: string
}

const OPENROUTER_API_URL = 'https://openrouter.ai/api/v1/chat/completions'
const MODEL = 'openai/gpt-4o-mini'

// Non-streaming chat call (kept for compatibility)
export async function chat(messages: ChatMessage[]): Promise<string> {
  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
      'X-Title': 'AI Chat App',
    },
    body: JSON.stringify({ model: MODEL, messages }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `OpenRouter error ${res.status}`)
  }

  const data = await res.json()
  return data.choices?.[0]?.message?.content ?? ''
}

// Streaming chat call — returns the raw Response for the route to pipe through
export async function chatStream(messages: ChatMessage[]): Promise<Response> {
  const res = await fetch(OPENROUTER_API_URL, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      Authorization: `Bearer ${process.env.OPENROUTER_API_KEY}`,
      'HTTP-Referer': process.env.NEXT_PUBLIC_API_URL ?? 'http://localhost:3000',
      'X-Title': 'AI Chat App',
    },
    body: JSON.stringify({ model: MODEL, messages, stream: true }),
  })

  if (!res.ok) {
    const err = await res.json().catch(() => ({}))
    throw new Error(err?.error?.message ?? `OpenRouter error ${res.status}`)
  }

  return res
}
