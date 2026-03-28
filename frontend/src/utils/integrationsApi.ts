const BASE = '/api/integrations';

// ─── Stripe ──────────────────────────────────────────────────────────────────

export async function connectStripe(code: string) {
  const res = await fetch(`${BASE}/stripe/connect`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
  if (!res.ok) throw new Error('Stripe connect failed');
  return res.json();
}

export async function disconnectStripe() {
  const res = await fetch(`${BASE}/stripe/disconnect`, { method: 'POST' });
  if (!res.ok) throw new Error('Stripe disconnect failed');
  return res.json();
}

export async function syncStripeData() {
  const res = await fetch(`${BASE}/stripe/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Stripe sync failed');
  return res.json();
}

export async function getStripeInvoices() {
  const res = await fetch(`${BASE}/stripe/invoices`);
  if (!res.ok) throw new Error('Failed to fetch invoices');
  return res.json();
}

// ─── Supabase ─────────────────────────────────────────────────────────────────

export async function connectSupabase(config: { url: string; anonKey: string }) {
  const res = await fetch(`${BASE}/supabase/connect`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
  if (!res.ok) throw new Error('Supabase connect failed');
  return res.json();
}

export async function syncSupabaseData() {
  const res = await fetch(`${BASE}/supabase/sync`, { method: 'POST' });
  if (!res.ok) throw new Error('Supabase sync failed');
  return res.json();
}

export async function backupSupabaseData() {
  const res = await fetch(`${BASE}/supabase/backup`, { method: 'POST' });
  if (!res.ok) throw new Error('Backup failed');
  return res.json();
}

// ─── GitHub ───────────────────────────────────────────────────────────────────

export async function connectGitHub(code: string) {
  const res = await fetch(`${BASE}/github/connect`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ code }) });
  if (!res.ok) throw new Error('GitHub connect failed');
  return res.json();
}

export async function triggerDeploy(branch = 'main') {
  const res = await fetch(`${BASE}/github/deploy`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ branch }) });
  if (!res.ok) throw new Error('Deploy trigger failed');
  return res.json();
}

export async function getGitHubCommits() {
  const res = await fetch(`${BASE}/github/commits`);
  if (!res.ok) throw new Error('Failed to fetch commits');
  return res.json();
}

// ─── Webhooks ────────────────────────────────────────────────────────────────

export interface WebhookConfig {
  eventType: string;
  targetUrl: string;
  active: boolean;
  headers?: Record<string, string>;
  retryPolicy?: number;
}

export async function createWebhook(config: WebhookConfig) {
  const res = await fetch(`${BASE}/webhooks/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
  if (!res.ok) throw new Error('Webhook create failed');
  return res.json();
}

export async function deleteWebhookApi(id: string) {
  const res = await fetch(`${BASE}/webhooks/${id}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Webhook delete failed');
  return res.json();
}

export async function testWebhook(id: string) {
  const res = await fetch(`${BASE}/webhooks/${id}/test`, { method: 'POST' });
  if (!res.ok) throw new Error('Webhook test failed');
  return res.json();
}

export async function getWebhookLogs(id: string) {
  const res = await fetch(`${BASE}/webhooks/${id}/logs`);
  if (!res.ok) throw new Error('Failed to fetch logs');
  return res.json();
}

// ─── API Keys ────────────────────────────────────────────────────────────────

export interface ApiKeyConfig {
  name: string;
  permissions: string[];
  environment: 'production' | 'staging';
  expiresAt?: string;
}

export async function createApiKey(config: ApiKeyConfig) {
  const res = await fetch(`${BASE}/api-keys/create`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(config) });
  if (!res.ok) throw new Error('API key create failed');
  return res.json();
}

export async function rotateApiKey(id: string) {
  const res = await fetch(`${BASE}/api-keys/${id}/rotate`, { method: 'POST' });
  if (!res.ok) throw new Error('API key rotate failed');
  return res.json();
}

export async function revokeApiKeyApi(id: string) {
  const res = await fetch(`${BASE}/api-keys/${id}/revoke`, { method: 'POST' });
  if (!res.ok) throw new Error('API key revoke failed');
  return res.json();
}

// ─── Health ───────────────────────────────────────────────────────────────────

export async function getHealthStatus() {
  const res = await fetch(`${BASE}/health`);
  if (!res.ok) throw new Error('Health check failed');
  return res.json();
}
