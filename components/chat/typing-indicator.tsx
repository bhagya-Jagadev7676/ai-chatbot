'use client'

export function TypingIndicator() {
  return (
    <div className="flex gap-1 items-center">
      <div className="typing-dot w-2 h-2 bg-muted-foreground rounded-full"></div>
      <div className="typing-dot w-2 h-2 bg-muted-foreground rounded-full"></div>
      <div className="typing-dot w-2 h-2 bg-muted-foreground rounded-full"></div>
    </div>
  )
}
