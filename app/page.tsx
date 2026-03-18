'use client'

import { useState, useEffect } from 'react'
import { useChatStore, Message } from '@/lib/store'
import { Sidebar } from '@/components/sidebar/sidebar'
import { ChatWindow } from '@/components/chat/chat-window'
import { ChatInput } from '@/components/chat/chat-input'
import { createClient } from '@/lib/supabase/client'
import {
  fetchConversations,
  createConversationInDB,
  updateConversationTitleInDB,
  deleteConversationFromDB,
  insertMessage,
} from '@/lib/db'

export default function Home() {
  const [sidebarOpen, setSidebarOpen] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [userId, setUserId] = useState<string | null>(null)
  const [userEmail, setUserEmail] = useState<string | undefined>()

  const {
    conversations,
    currentConversationId,
    loading,
    error,
    setCurrentConversation,
    deleteConversation,
    updateConversationTitle,
    addMessage,
    setLoading,
    setError,
    getCurrentMessages,
    getCurrentConversation,
  } = useChatStore()

  // ── Bootstrap: load user + conversations from DB ──────────────
  useEffect(() => {
    const supabase = createClient()

    supabase.auth.getUser().then(async ({ data: { user } }) => {
      if (!user) return
      setUserId(user.id)
      setUserEmail(user.email)

      // Load persisted conversations into the store
      try {
        const convs = await fetchConversations(user.id)
        if (convs.length > 0) {
          useChatStore.setState({
            conversations: convs,
            currentConversationId: convs[0].id,
          })
        } else {
          // No conversations yet — create one automatically
          await createNewConversation(user.id)
        }
      } catch (e) {
        console.error('Failed to load conversations', e)
        await createNewConversation(user.id)
      }

      setMounted(true)
    })
  }, []) // eslint-disable-line react-hooks/exhaustive-deps

  // ── Internal helper: create conversation in store + DB ────────
  const createNewConversation = async (uid: string) => {
    const newId = Date.now().toString()
    useChatStore.setState((state) => ({
      conversations: [
        { id: newId, title: 'New Chat', messages: [], createdAt: new Date(), updatedAt: new Date() },
        ...state.conversations,
      ],
      currentConversationId: newId,
    }))
    try {
      await createConversationInDB(uid, newId, 'New Chat')
    } catch (e) {
      console.error('Failed to persist conversation', e)
    }
    return newId
  }

  // ── Create a new conversation (store + DB) ────────────────────
  const handleNewChat = async () => {
    if (!userId) return
    await createNewConversation(userId)
  }

  // ── Delete conversation (store + DB) ──────────────────────────
  const handleDeleteConversation = async (id: string) => {
    deleteConversation(id)
    try {
      await deleteConversationFromDB(id)
    } catch (e) {
      console.error('Failed to delete conversation', e)
    }
  }

  // ── Send message ──────────────────────────────────────────────
  const handleSendMessage = async (content: string) => {
    if (!content.trim()) return

    // Ensure we have an active conversation
    let convId = currentConversationId
    if (!convId) {
      if (!userId) return
      convId = await createNewConversation(userId)
    }

    const userMessage: Message = {
      id: `${Date.now()}-user`,
      role: 'user',
      content: content.trim(),
      timestamp: new Date(),
    }

    addMessage(userMessage)

    // Auto-title from first message
    const conv = getCurrentConversation()
    if (conv && conv.messages.length === 0) {
      const title = content.trim().slice(0, 40) + (content.length > 40 ? '…' : '')
      updateConversationTitle(convId, title)
      updateConversationTitleInDB(convId, title).catch(console.error)
    }

    // Persist user message
    insertMessage(convId, userMessage).catch(console.error)

    setLoading(true)
    setError(null)

    try {
      const history = [...getCurrentMessages(), userMessage].map((m) => ({
        role: m.role,
        content: m.content,
      }))

      const res = await fetch('/api/chat', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ messages: history }),
      })

      if (!res.ok) {
        const err = await res.json().catch(() => ({}))
        throw new Error(err.error || `HTTP ${res.status}`)
      }

      // Add empty assistant message to stream into
      const aiMessage: Message = {
        id: `${Date.now()}-ai`,
        role: 'assistant',
        content: '',
        timestamp: new Date(),
      }
      addMessage(aiMessage)

      // Stream SSE tokens
      const reader = res.body!.getReader()
      const decoder = new TextDecoder()
      let accumulated = ''

      while (true) {
        const { done, value } = await reader.read()
        if (done) break

        const chunk = decoder.decode(value, { stream: true })
        for (const line of chunk.split('\n')) {
          if (!line.startsWith('data: ')) continue
          const data = line.slice(6).trim()
          if (data === '[DONE]') break

          try {
            const parsed = JSON.parse(data)
            const token: string = parsed.choices?.[0]?.delta?.content ?? ''
            if (token) {
              accumulated += token
              useChatStore.getState().updateLastMessage(accumulated)
            }
          } catch {
            // ignore malformed lines
          }
        }
      }

      // Persist final AI message to DB
      const finalAiMessage = { ...aiMessage, content: accumulated }
      insertMessage(convId, finalAiMessage).catch(console.error)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Something went wrong. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  if (!mounted) return null

  const currentMessages = getCurrentMessages()

  return (
    <div className="flex h-screen bg-background overflow-hidden">
      <Sidebar
        conversations={conversations}
        currentId={currentConversationId}
        onNewChat={handleNewChat}
        onSelectConversation={setCurrentConversation}
        onDeleteConversation={handleDeleteConversation}
        isOpen={sidebarOpen}
        onToggle={() => setSidebarOpen((v) => !v)}
        userEmail={userEmail}
      />

      {/* Main area */}
      <div className="flex flex-col flex-1 min-w-0">
        <header className="flex items-center h-12 px-4 border-b border-border md:px-6 shrink-0">
          <span className="ml-10 md:ml-0 text-sm font-medium truncate text-muted-foreground">
            {getCurrentConversation()?.title ?? 'New Chat'}
          </span>
        </header>

        <ChatWindow messages={currentMessages} loading={loading} />

        {error && (
          <div className="mx-4 mb-2 px-4 py-2 rounded-lg bg-destructive/10 border border-destructive/20 text-sm text-destructive">
            {error}
          </div>
        )}

        <div className="px-4 py-3 border-t border-border bg-card shrink-0">
          <ChatInput onSend={handleSendMessage} disabled={loading} />
          <p className="text-xs text-center text-muted-foreground mt-2">
            AI can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  )
}
