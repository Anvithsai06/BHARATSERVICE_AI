import type { SearchResponse, ChatRequest, ChatResponse, HealthStatus, Service } from '@/types';

const API_BASE = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:8000';

async function apiFetch<T>(path: string, options?: RequestInit): Promise<T> {
  const res = await fetch(`${API_BASE}${path}`, {
    headers: { 'Content-Type': 'application/json' },
    ...options,
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({ detail: 'Unknown error' }));
    throw new Error(err.detail || `Request failed: ${res.status}`);
  }
  return res.json();
}

export async function searchServices(
  query: string,
  topK = 6
): Promise<SearchResponse> {
  return apiFetch<SearchResponse>('/api/search', {
    method: 'POST',
    body: JSON.stringify({ query, top_k: topK }),
  });
}

export async function sendChatMessage(req: ChatRequest): Promise<ChatResponse> {
  return apiFetch<ChatResponse>('/api/chat', {
    method: 'POST',
    body: JSON.stringify(req),
  });
}

export async function getAllServices(): Promise<Service[]> {
  return apiFetch<Service[]>('/api/services');
}

export async function getCategories(): Promise<string[]> {
  return apiFetch<string[]>('/api/services/categories');
}

export async function checkHealth(): Promise<HealthStatus> {
  return apiFetch<HealthStatus>('/health');
}
