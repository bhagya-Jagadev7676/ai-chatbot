import { createClient } from '@/lib/supabase/client'
import { Message, Conversation } from '@/lib/store'

const supabase = createClient()

// ── Conversations ──────────────────────────────────────────────

export async function fetchConversations(userId: string): Promise<Conversation[]> {
  const { data, error } = await supabase
    .from('conversations')
    .select('*, messages(*)')
    .eq('user_id', userId)
    .order('updated_at', { ascending: false })

  if (error) throw error

  return (data ?? []).map((row: any) => ({
    id: row.id,
    title: row.title,
    createdAt: new Date(row.created_at),
    updatedAt: new Date(row.updated_at),
    messages: (row.messages ?? [])
      .sort((a: any, b: any) => new Date(a.created_at).getTime() - new Date(b.created_at).getTime())
      .map((m: any) => ({
        id: m.id,
        role: m.role,
        content: m.content,
        timestamp: new Date(m.created_at),
      })),
  }))
}

export async function createConversationInDB(
  userId: string,
  id: string,
  title: string
): Promise<void> {
  const { error } = await supabase.from('conversations').insert({
    id,
    user_id: userId,
    title,
  })
  if (error) throw error
}

export async function updateConversationTitleInDB(
  id: string,
  title: string
): Promise<void> {
  const { error } = await supabase
    .from('conversations')
    .update({ title, updated_at: new Date().toISOString() })
    .eq('id', id)
  if (error) throw error
}

export async function deleteConversationFromDB(id: string): Promise<void> {
  const { error } = await supabase.from('conversations').delete().eq('id', id)
  if (error) throw error
}

// ── Messages ───────────────────────────────────────────────────

export async function insertMessage(
  conversationId: string,
  message: Message
): Promise<void> {
  const { error } = await supabase.from('messages').insert({
    id: message.id,
    conversation_id: conversationId,
    role: message.role,
    content: message.content,
    created_at: message.timestamp.toISOString(),
  })
  if (error) throw error
}

export async function updateMessageContent(
  messageId: string,
  content: string
): Promise<void> {
  const { error } = await supabase
    .from('messages')
    .update({ content })
    .eq('id', messageId)
  if (error) throw error
}
