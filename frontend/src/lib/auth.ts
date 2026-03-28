import { api, User } from './api';

const TOKEN_KEY = 'assaon_token';

export function saveToken(token: string) {
  localStorage.setItem(TOKEN_KEY, token);
}

export function clearToken() {
  localStorage.removeItem(TOKEN_KEY);
}

export function getToken() {
  return localStorage.getItem(TOKEN_KEY);
}

export function isLoggedIn() {
  return !!getToken();
}

export async function getCurrentUser(): Promise<User | null> {
  if (!getToken()) return null;
  try {
    const { user } = await api.auth.me();
    return user;
  } catch {
    clearToken();
    return null;
  }
}
