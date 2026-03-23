export interface Service {
  id: string;
  service_name: string;
  category: string;
  description: string;
  url: string;
  ministry: string;
  documents: string[];
  processing_time: string;
  fee: string;
  tags: string[];
  relevance_score?: number;
}

export interface SearchResponse {
  query: string;
  results: Service[];
  total: number;
}

export interface ChatMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: Date;
}

export interface ChatRequest {
  message: string;
  history: { role: string; content: string }[];
  service_context?: string;
}

export interface ChatResponse {
  response: string;
  model?: string;
}

export interface HealthStatus {
  status: string;
  ai_connected: boolean;
  total_services: number;
}

export type SearchStatus = 'idle' | 'loading' | 'success' | 'error';
export type ChatStatus = 'idle' | 'loading' | 'error';
