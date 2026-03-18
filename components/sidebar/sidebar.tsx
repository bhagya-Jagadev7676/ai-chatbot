'use client'

import React from 'react'
import { useRouter } from 'next/navigation'
import { Button } from '@/components/ui/button'
import { ConversationList } from './conversation-list'
import { ThemeToggle } from '@/components/theme-toggle'
import { Conversation } from '@/lib/store'
import { createClient } from '@/lib/supabase/client'
import { Plus, Menu, X, Bot, LogOut } from 'lucide-react'

interface SidebarProps {
  conversations: Conversation[]
  currentId: string | null
  onNewChat: () => void
  onSelectConversation: (id: string) => void
  onDeleteConversation: (id: string) => void
  isOpen: boolean
  onToggle: () => void
  userEmail?: string
}

export function Sidebar({
  conversations,
  currentId,
  onNewChat,
  onSelectConversation,
  onDeleteConversation,
  isOpen,
  onToggle,
  userEmail,
}: SidebarProps) {
  const router = useRouter()
  const supabase = createClient()

  const handleSignOut = async () => {
    await supabase.auth.signOut()
    router.push('/auth/signin')
    router.refresh()
  }
  return (
    <>
      {/* Mobile hamburger */}
      <Button
        variant="ghost"
        size="icon"
        className="md:hidden fixed top-3 left-3 z-40"
        onClick={onToggle}
        aria-label="Toggle sidebar"
      >
        {isOpen ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
      </Button>

      {/* Sidebar panel */}
      <aside
        className={`fixed md:relative w-64 h-screen bg-card border-r border-border flex flex-col transition-transform duration-300 z-30
          ${isOpen ? 'translate-x-0' : '-translate-x-full md:translate-x-0'}`}
      >
        {/* Brand */}
        <div className="flex items-center gap-2 px-4 py-4 border-b border-border">
          <Bot className="h-5 w-5 text-primary" />
          <span className="font-semibold text-sm">AI Chatbot</span>
        </div>

        {/* New chat */}
        <div className="p-3 border-b border-border">
          <Button onClick={onNewChat} className="w-full gap-2" size="sm">
            <Plus className="h-4 w-4" />
            New Chat
          </Button>
        </div>

        {/* Conversation list */}
        <ConversationList
          conversations={conversations}
          currentId={currentId}
          onSelect={(id) => {
            onSelectConversation(id)
            if (window.innerWidth < 768) onToggle() // close on mobile only
          }}
          onDelete={onDeleteConversation}
        />

        {/* Footer with theme toggle + sign out */}
        <div className="p-3 border-t border-border space-y-2">
          {userEmail && (
            <p className="text-xs text-muted-foreground truncate px-1">{userEmail}</p>
          )}
          <div className="flex items-center justify-between">
            <Button
              variant="ghost"
              size="sm"
              className="gap-2 text-xs text-muted-foreground"
              onClick={handleSignOut}
            >
              <LogOut className="h-3.5 w-3.5" />
              Sign out
            </Button>
            <ThemeToggle />
          </div>
        </div>
      </aside>

      {/* Mobile backdrop */}
      {isOpen && (
        <div
          className="fixed inset-0 bg-black/40 md:hidden z-20"
          onClick={onToggle}
        />
      )}
    </>
  )
}
