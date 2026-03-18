// Chat configuration
export const chatConfig = {
  // AI Model settings
  model: {
    name: 'openai/gpt-4o-mini',
    maxTokens: 1024,
    temperature: 0.7,
  },

  // UI settings
  ui: {
    messagesPerPage: 50,
    autoScroll: true,
    showTimestamps: false,
    enableMarkdown: true,
    enableCodeHighlight: true,
  },

  // Input settings
  input: {
    maxLength: 4000,
    minLength: 1,
    placeholder: 'Type your message... (Shift + Enter for new line)',
    enableVoiceInput: false,
  },

  // API settings
  api: {
    timeout: 30000, // 30 seconds
    retryAttempts: 3,
    retryDelay: 1000, // 1 second
  },

  // Storage settings
  storage: {
    maxConversations: 100,
    maxMessagesPerConversation: 1000,
    persistToLocalStorage: true,
  },

  // System prompt for AI
  systemPrompt: `You are a helpful, friendly AI assistant. You provide clear, concise, and accurate responses. 
You support markdown formatting including code blocks, lists, and links. 
When providing code examples, use appropriate language syntax highlighting.
Be conversational and helpful while maintaining professionalism.`,
}

// Export individual configs for easier access
export const modelConfig = chatConfig.model
export const uiConfig = chatConfig.ui
export const inputConfig = chatConfig.input
export const apiConfig = chatConfig.api
export const storageConfig = chatConfig.storage
