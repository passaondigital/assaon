const BASE = '/api';

function getToken() {
  return localStorage.getItem('assaon_token');
}

function authHeaders(): HeadersInit {
  const token = getToken();
  return token ? { Authorization: `Bearer ${token}` } : {};
}

async function request<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await fetch(`${BASE}${path}`, {
    ...init,
    headers: {
      'Content-Type': 'application/json',
      ...authHeaders(),
      ...(init.headers || {}),
    },
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(err.error || `HTTP ${res.status}`);
  }

  return res.json();
}

export const api = {
  auth: {
    signup: (data: { email: string; name: string; password: string }) =>
      request<{ token: string; user: User }>('/auth/signup', { method: 'POST', body: JSON.stringify(data) }),
    login: (data: { email: string; password: string }) =>
      request<{ token: string; user: User }>('/auth/login', { method: 'POST', body: JSON.stringify(data) }),
    me: () => request<{ user: User }>('/auth/me'),
  },
  projects: {
    list: () => request<{ projects: Project[] }>('/projects'),
    create: (data: { name: string; description?: string; type?: string }) =>
      request<{ project: Project }>('/projects', { method: 'POST', body: JSON.stringify(data) }),
    get: (id: string) => request<{ project: Project }>(`/projects/${id}`),
    update: (id: string, data: Partial<Project>) =>
      request<{ project: Project }>(`/projects/${id}`, { method: 'PATCH', body: JSON.stringify(data) }),
    delete: (id: string) => request<{ success: boolean }>(`/projects/${id}`, { method: 'DELETE' }),
  },
  chat: {
    sessions: () => request<{ sessions: ChatSession[] }>('/chat/sessions'),
    createSession: (data?: { projectId?: string; title?: string }) =>
      request<{ session: ChatSession }>('/chat/sessions', { method: 'POST', body: JSON.stringify(data || {}) }),
    messages: (sessionId: string) =>
      request<{ messages: ChatMessage[] }>(`/chat/sessions/${sessionId}/messages`),
    deleteSession: (sessionId: string) =>
      request<{ success: boolean }>(`/chat/sessions/${sessionId}`, { method: 'DELETE' }),
  },
};

export interface User {
  id: string;
  email: string;
  name: string;
  plan: 'free' | 'pro' | 'enterprise';
  created_at?: string;
}

export interface Project {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  subdomain?: string;
  custom_domain?: string;
  status: 'draft' | 'live' | 'paused';
  type: string;
  created_at: string;
  updated_at: string;
}

export interface ChatSession {
  id: string;
  user_id: string;
  project_id?: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export interface ChatMessage {
  id: string;
  session_id: string;
  role: 'user' | 'assistant' | 'system';
  content: string;
  created_at: string;
}
