import { create } from 'zustand'

export interface Message {
  id: string
  role: 'user' | 'assistant'
  content: string
  timestamp: Date
}

export interface Conversation {
  id: string
  title: string
  messages: Message[]
  createdAt: Date
  updatedAt: Date
}

interface ChatStore {
  conversations: Conversation[]
  currentConversationId: string | null
  loading: boolean
  error: string | null

  // Conversation actions
  createConversation: () => void
  setCurrentConversation: (id: string) => void
  deleteConversation: (id: string) => void
  updateConversationTitle: (id: string, title: string) => void

  // Message actions
  addMessage: (message: Message) => void
  updateLastMessage: (content: string) => void
  clearMessages: () => void

  // State actions
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void

  // Getters
  getCurrentConversation: () => Conversation | undefined
  getCurrentMessages: () => Message[]
}

export const useChatStore = create<ChatStore>((set, get) => ({
  conversations: [],
  currentConversationId: null,
  loading: false,
  error: null,

  createConversation: () => {
    const newConversation: Conversation = {
      id: Date.now().toString(),
      title: 'New Chat',
      messages: [],
      createdAt: new Date(),
      updatedAt: new Date(),
    }

    set((state) => ({
      conversations: [newConversation, ...state.conversations],
      currentConversationId: newConversation.id,
    }))
  },

  setCurrentConversation: (id: string) => {
    set({ currentConversationId: id })
  },

  deleteConversation: (id: string) => {
    set((state) => ({
      conversations: state.conversations.filter((c) => c.id !== id),
      currentConversationId:
        state.currentConversationId === id ? null : state.currentConversationId,
    }))
  },

  updateConversationTitle: (id: string, title: string) => {
    set((state) => ({
      conversations: state.conversations.map((c) =>
        c.id === id ? { ...c, title, updatedAt: new Date() } : c
      ),
    }))
  },

  addMessage: (message: Message) => {
    set((state) => {
      const conversationId = state.currentConversationId
      if (!conversationId) return state

      return {
        conversations: state.conversations.map((c) =>
          c.id === conversationId
            ? {
                ...c,
                messages: [...c.messages, message],
                updatedAt: new Date(),
              }
            : c
        ),
      }
    })
  },

  updateLastMessage: (content: string) => {
    set((state) => {
      const conversationId = state.currentConversationId
      if (!conversationId) return state

      return {
        conversations: state.conversations.map((c) => {
          if (c.id === conversationId && c.messages.length > 0) {
            const messages = [...c.messages]
            messages[messages.length - 1] = {
              ...messages[messages.length - 1],
              content,
            }
            return { ...c, messages, updatedAt: new Date() }
          }
          return c
        }),
      }
    })
  },

  clearMessages: () => {
    set((state) => {
      const conversationId = state.currentConversationId
      if (!conversationId) return state

      return {
        conversations: state.conversations.map((c) =>
          c.id === conversationId ? { ...c, messages: [] } : c
        ),
      }
    })
  },

  setLoading: (loading: boolean) => {
    set({ loading })
  },

  setError: (error: string | null) => {
    set({ error })
  },

  getCurrentConversation: () => {
    const state = get()
    return state.conversations.find((c) => c.id === state.currentConversationId)
  },

  getCurrentMessages: () => {
    const conversation = get().getCurrentConversation()
    return conversation?.messages || []
  },
}))
