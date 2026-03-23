import { create } from 'zustand';
import type { Service, ChatMessage, SearchStatus, ChatStatus } from '@/types';
import { searchServices, sendChatMessage } from '@/utils/api';

interface SearchState {
  query: string;
  results: Service[];
  status: SearchStatus;
  error: string | null;
  hasSearched: boolean;
  setQuery: (q: string) => void;
  runSearch: (q: string) => Promise<void>;
  clearResults: () => void;
}

interface ChatState {
  messages: ChatMessage[];
  status: ChatStatus;
  error: string | null;
  isOpen: boolean;
  activeServiceContext: string | null;
  sendMessage: (content: string) => Promise<void>;
  openChat: (serviceContext?: string) => void;
  closeChat: () => void;
  clearChat: () => void;
}

function generateId(): string {
  return Math.random().toString(36).slice(2, 10);
}

function makeWelcomeMessage(): ChatMessage {
  return {
    id: generateId(),
    role: 'assistant',
    content:
      "Namaste! 🙏 I'm your AI assistant for Indian Government Services.\n\nI can help you:\n- **Find the right service** for your needs\n- **Guide you step-by-step** through application processes\n- **List required documents** for any service\n- **Answer your questions** about fees, timelines, and eligibility\n\nHow can I assist you today?",
    timestamp: new Date(),
  };
}

export const useSearchStore = create<SearchState>((set) => ({
  query: '',
  results: [],
  status: 'idle',
  error: null,
  hasSearched: false,

  setQuery: (q) => set({ query: q }),

  runSearch: async (q) => {
    if (!q.trim()) return;
    set({ status: 'loading', error: null, hasSearched: true, query: q });
    try {
      const data = await searchServices(q.trim());
      set({ status: 'success', results: data.results });
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Search failed. Please try again.';
      set({ status: 'error', error: msg, results: [] });
    }
  },

  clearResults: () =>
    set({ results: [], status: 'idle', error: null, hasSearched: false, query: '' }),
}));

export const useChatStore = create<ChatState>((set, get) => ({
  messages: [makeWelcomeMessage()],
  status: 'idle',
  error: null,
  isOpen: false,
  activeServiceContext: null,

  sendMessage: async (content) => {
    const userMsg: ChatMessage = {
      id: generateId(),
      role: 'user',
      content,
      timestamp: new Date(),
    };
    set((s) => ({ messages: [...s.messages, userMsg], status: 'loading', error: null }));

    try {
      const { messages, activeServiceContext } = get();
      const history = messages.slice(-10).map((m) => ({
        role: m.role,
        content: m.content,
      }));
      const res = await sendChatMessage({
        message: content,
        history,
        service_context: activeServiceContext ?? undefined,
      });
      const assistantMsg: ChatMessage = {
        id: generateId(),
        role: 'assistant',
        content: res.response,
        timestamp: new Date(),
      };
      set((s) => ({ messages: [...s.messages, assistantMsg], status: 'idle' }));
    } catch (e: unknown) {
      const msg = e instanceof Error ? e.message : 'Failed to get response.';
      set({ status: 'error', error: msg });
    }
  },

  openChat: (serviceContext) =>
    set({ isOpen: true, activeServiceContext: serviceContext ?? null }),

  closeChat: () => set({ isOpen: false, activeServiceContext: null }),

  clearChat: () =>
    set({ messages: [makeWelcomeMessage()], status: 'idle', error: null }),
}));
