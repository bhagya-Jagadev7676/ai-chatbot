'use client'

import React, { useEffect, useRef } from 'react'
import { ChatMessage } from './message'
import { TypingIndicator } from './typing-indicator'
import { Message } from '@/lib/store'
import { Bot } from 'lucide-react'

interface ChatWindowProps {
  messages: Message[]
  loading: boolean
}

export function ChatWindow({ messages, loading }: ChatWindowProps) {
  const bottomRef = useRef<HTMLDivElement>(null)

  // Auto-scroll to bottom whenever messages or loading state changes
  useEffect(() => {
    bottomRef.current?.scrollIntoView({ behavior: 'smooth' })
  }, [messages, loading])

  return (
    <div className="flex-1 overflow-y-auto px-4 py-6">
      {messages.length === 0 && !loading ? (
        <div className="flex flex-col items-center justify-center h-full gap-3 text-center select-none">
          <Bot className="h-12 w-12 text-muted-foreground/40" />
          <h2 className="text-xl font-semibold">How can I help you today?</h2>
          <p className="text-sm text-muted-foreground max-w-xs">
            Start a conversation — ask me anything, request code, or explore ideas.
          </p>
        </div>
      ) : (
        <>
          {messages.map((message) => (
            <ChatMessage key={message.id} message={message} />
          ))}

          {loading && (
            <div className="flex gap-3 mb-4">
              <div className="bg-muted rounded-lg rounded-bl-none px-4 py-3">
                <TypingIndicator />
              </div>
            </div>
          )}

          {/* Scroll anchor */}
          <div ref={bottomRef} />
        </>
      )}
    </div>
  )
}
