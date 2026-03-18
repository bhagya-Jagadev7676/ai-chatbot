'use client'

import React from 'react'
import { Conversation } from '@/lib/store'
import { Button } from '@/components/ui/button'
import { Trash2, MessageSquare } from 'lucide-react'
import { ScrollArea } from '@/components/ui/scroll-area'

interface ConversationListProps {
  conversations: Conversation[]
  currentId: string | null
  onSelect: (id: string) => void
  onDelete: (id: string) => void
}

export function ConversationList({
  conversations,
  currentId,
  onSelect,
  onDelete,
}: ConversationListProps) {
  return (
    <ScrollArea className="flex-1">
      <div className="space-y-2 p-4">
        {conversations.length === 0 ? (
          <p className="text-sm text-muted-foreground text-center py-8">
            No conversations yet
          </p>
        ) : (
          conversations.map((conv) => (
            <div
              key={conv.id}
              className={`flex items-center gap-2 p-3 rounded-lg cursor-pointer transition-colors ${
                currentId === conv.id
                  ? 'bg-primary text-primary-foreground'
                  : 'hover:bg-muted'
              }`}
            >
              <MessageSquare className="h-4 w-4 flex-shrink-0" />
              <div
                className="flex-1 min-w-0"
                onClick={() => onSelect(conv.id)}
              >
                <p className="text-sm font-medium truncate">{conv.title}</p>
                <p className="text-xs opacity-70">
                  {conv.messages.length} messages
                </p>
              </div>
              <Button
                variant="ghost"
                size="icon"
                className="h-8 w-8 flex-shrink-0"
                onClick={(e) => {
                  e.stopPropagation()
                  onDelete(conv.id)
                }}
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))
        )}
      </div>
    </ScrollArea>
  )
}
