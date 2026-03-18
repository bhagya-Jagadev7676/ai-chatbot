'use client'

import React, { useRef, useEffect } from 'react'
import { Button } from '@/components/ui/button'
import { Send } from 'lucide-react'

interface ChatInputProps {
  onSend: (message: string) => void
  disabled?: boolean
}

export function ChatInput({ onSend, disabled = false }: ChatInputProps) {
  const textareaRef = useRef<HTMLTextAreaElement>(null)

  const handleKeyDown = (e: React.KeyboardEvent<HTMLTextAreaElement>) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault()
      const message = textareaRef.current?.value.trim()
      if (message) {
        onSend(message)
        if (textareaRef.current) {
          textareaRef.current.value = ''
          textareaRef.current.style.height = 'auto'
        }
      }
    }
  }

  const handleInput = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
    const textarea = e.target
    textarea.style.height = 'auto'
    textarea.style.height = Math.min(textarea.scrollHeight, 120) + 'px'
  }

  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.focus()
    }
  }, [])

  return (
    <div className="flex gap-2 items-end">
      <textarea
        ref={textareaRef}
        placeholder="Type your message... (Shift + Enter for new line)"
        onKeyDown={handleKeyDown}
        onChange={handleInput}
        disabled={disabled}
        className="flex-1 resize-none rounded-lg border border-input bg-background px-4 py-2 text-sm placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50 max-h-32"
        rows={1}
      />
      <Button
        onClick={() => {
          const message = textareaRef.current?.value.trim()
          if (message) {
            onSend(message)
            if (textareaRef.current) {
              textareaRef.current.value = ''
              textareaRef.current.style.height = 'auto'
            }
          }
        }}
        disabled={disabled}
        size="icon"
        className="h-10 w-10"
      >
        <Send className="h-4 w-4" />
      </Button>
    </div>
  )
}
