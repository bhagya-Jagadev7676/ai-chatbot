# AI Chatbot - Production Ready

A modern, full-stack AI chatbot application built with Next.js 14, React Server Components, ShadCN UI, and Anthropic Claude API.

## Features

- **Modern Chat Interface**: Clean, responsive UI similar to ChatGPT
- **Real-time Messaging**: Instant message delivery with typing indicators
- **Markdown Support**: Full markdown rendering with syntax highlighting for code blocks
- **Conversation History**: Save and manage multiple conversations
- **Mobile Responsive**: Works seamlessly on desktop and mobile devices
- **Dark Mode Ready**: Built-in dark mode support
- **State Management**: Zustand for efficient state management
- **Type Safe**: Full TypeScript support
- **Production Ready**: Error handling, loading states, and user feedback

## Tech Stack

- **Frontend**: Next.js 14 (App Router), React 18, TypeScript
- **UI Components**: ShadCN UI, Radix UI, Tailwind CSS
- **State Management**: Zustand
- **AI API**: Anthropic Claude
- **Code Highlighting**: React Syntax Highlighter
- **Markdown**: React Markdown with GFM support
- **Icons**: Lucide React

## Getting Started

### Prerequisites

- Node.js 18+ and npm/yarn
- Anthropic API key (get from https://console.anthropic.com)

### Installation

1. Clone the repository:
```bash
cd ai-chatbot
```

2. Install dependencies:
```bash
npm install
```

3. Set up environment variables:
```bash
# .env.local
ANTHROPIC_API_KEY=your_anthropic_api_key_here
NEXT_PUBLIC_API_URL=http://localhost:3000
```

4. Run the development server:
```bash
npm run dev
```

5. Open [http://localhost:3000](http://localhost:3000) in your browser

## Project Structure

```
ai-chatbot/
├── app/
│   ├── api/
│   │   └── chat/
│   │       └── route.ts          # Chat API endpoint
│   ├── page.tsx                  # Main chat page
│   ├── layout.tsx                # Root layout
│   └── globals.css               # Global styles
├── components/
│   ├── chat/
│   │   ├── message.tsx           # Message component with markdown
│   │   ├── chat-input.tsx        # Input textarea with send button
│   │   ├── chat-window.tsx       # Messages display area
│   │   └── typing-indicator.tsx  # Loading animation
│   ├── sidebar/
│   │   ├── sidebar.tsx           # Main sidebar
│   │   └── conversation-list.tsx # Conversation list
│   └── ui/
│       ├── button.tsx            # Button component
│       ├── input.tsx             # Input component
│       ├── card.tsx              # Card component
│       └── scroll-area.tsx       # Scroll area component
├── lib/
│   ├── store.ts                  # Zustand store
│   ├── openai.ts                 # API utilities
│   └── utils.ts                  # Helper functions
├── package.json
├── tsconfig.json
├── tailwind.config.ts
├── next.config.js
└── .env.local
```

## Usage

### Starting a Chat

1. Click "New Chat" in the sidebar to create a new conversation
2. Type your message in the input box
3. Press Enter or click the send button
4. The AI will respond with markdown-formatted text

### Keyboard Shortcuts

- **Enter**: Send message
- **Shift + Enter**: New line in message

### Managing Conversations

- Click on any conversation in the sidebar to switch to it
- Click the trash icon to delete a conversation
- Each conversation maintains its own message history

## API Integration

The chat API endpoint (`/api/chat`) handles:

- Message validation
- API communication with Anthropic Claude
- Error handling and logging
- Response formatting

### Example Request

```typescript
POST /api/chat
Content-Type: application/json

{
  "messages": [
    {
      "role": "user",
      "content": "Hello, how are you?"
    }
  ]
}
```

### Example Response

```json
{
  "content": "I'm doing well, thank you for asking! How can I help you today?"
}
```

## State Management

The app uses Zustand for state management with the following store:

- `conversations`: Array of all conversations
- `currentConversationId`: Currently active conversation
- `loading`: Loading state during API calls
- `error`: Error messages

### Store Actions

- `createConversation()`: Create new chat
- `setCurrentConversation(id)`: Switch conversation
- `deleteConversation(id)`: Delete conversation
- `addMessage(message)`: Add message to current conversation
- `setLoading(boolean)`: Update loading state
- `setError(error)`: Set error message

## Customization

### Change AI Model

Edit `/app/api/chat/route.ts`:

```typescript
const response = await client.messages.create({
  model: 'claude-3-opus-20240229', // Change model here
  max_tokens: 1024,
  messages: anthropicMessages,
})
```

### Styling

- Tailwind CSS configuration: `tailwind.config.ts`
- Global styles: `app/globals.css`
- Component styles: Individual component files

### Add Features

- **Database**: Integrate Prisma with MongoDB/PostgreSQL for persistent storage
- **Authentication**: Add NextAuth or Clerk for user authentication
- **Voice Input**: Integrate Web Speech API
- **File Upload**: Add file handling for document summarization

## Deployment

### Deploy to Vercel

1. Push code to GitHub
2. Connect repository to Vercel
3. Add environment variables in Vercel dashboard
4. Deploy

```bash
vercel deploy
```

### Environment Variables for Production

```
ANTHROPIC_API_KEY=your_production_key
NEXT_PUBLIC_API_URL=https://your-domain.com
```

## Performance Optimization

- Server-side rendering for initial load
- Client-side state management for instant UI updates
- Optimized re-renders with React hooks
- CSS-in-JS with Tailwind for minimal bundle size
- Image optimization with Next.js Image component

## Error Handling

The app includes comprehensive error handling:

- API error messages displayed to users
- Console logging for debugging
- Graceful fallbacks for failed requests
- Input validation

## Browser Support

- Chrome/Edge (latest)
- Firefox (latest)
- Safari (latest)
- Mobile browsers (iOS Safari, Chrome Mobile)

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
