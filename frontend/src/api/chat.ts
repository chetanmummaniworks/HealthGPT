import apiClient from './client'

export interface ChatMessage {
  role: 'user' | 'assistant'
  content: string
}

export interface ChatContext {
  symptoms?: string[]
  predictions?: {
    disease: string
    model_score: number
  }[]
  top_score?: number
  needs_caution?: boolean
  confidence_level?: string
}

export interface ChatRequest {
  message: string
  conversation: ChatMessage[]
  context?: ChatContext
}

export interface ChatResponse {
  response: string
}

export async function sendChatMessage(
  message: string,
  conversation: ChatMessage[] = [],
  context?: ChatContext,
): Promise<ChatResponse> {
  const response = await apiClient.post<ChatResponse>(
    '/chat',
    {
      message,
      conversation,
      context,
    },
  )

  return response.data
}