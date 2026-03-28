import { useState, useEffect } from 'react';

export interface IntegrationConnection {
  id: string;
  service: 'stripe' | 'supabase' | 'github' | 'email';
  status: 'connected' | 'disconnected' | 'error' | 'syncing';
  connectedAt: string;
  lastSync: string;
  accountId: string;
  config: Record<string, unknown>;
  health: { uptime: number; lastCheck: string; avgResponseTime: number; errorCount: number };
}

export interface Webhook {
  id: string;
  eventType: string;
  targetUrl: string;
  active: boolean;
  createdAt: string;
  lastTriggered: string;
  successRate: number;
  headers: Record<string, string>;
}

export interface ApiKey {
  id: string;
  name: string;
  keyHash: string;
  prefix: string;
  createdAt: string;
  lastUsed: string;
  permissions: string[];
  environment: 'production' | 'staging';
  expiresAt?: string;
}

export interface WebhookLog {
  id: string;
  webhookId: string;
  timestamp: string;
  event: string;
  status: 'success' | 'failed' | 'retrying';
  responseCode: number;
  payloadSize: string;
}

// ─── Mock Data ────────────────────────────────────────────────────────────────

const MOCK_CONNECTIONS: IntegrationConnection[] = [
  {
    id: 'stripe', service: 'stripe', status: 'connected',
    connectedAt: '2026-01-15T10:00:00Z', lastSync: '2026-03-28T14:45:00Z',
    accountId: 'acc_1P2X3YZ456789', config: { liveMode: true, currency: 'EUR' },
    health: { uptime: 99.8, lastCheck: '2026-03-28T14:50:00Z', avgResponseTime: 234, errorCount: 0 },
  },
  {
    id: 'supabase', service: 'supabase', status: 'connected',
    connectedAt: '2026-01-10T08:00:00Z', lastSync: '2026-03-28T14:45:00Z',
    accountId: 'bavhqxhixjhxcuhtxzmh.supabase.co', config: { projectUrl: 'https://bavhqxhixjhxcuhtxzmh.supabase.co', tables: 247, records: 12456 },
    health: { uptime: 100, lastCheck: '2026-03-28T14:50:00Z', avgResponseTime: 89, errorCount: 0 },
  },
  {
    id: 'github', service: 'github', status: 'connected',
    connectedAt: '2026-01-01T00:00:00Z', lastSync: '2026-03-28T14:45:00Z',
    accountId: 'passaondigital/assaon', config: { branch: 'main', autoDeploy: true, lastCommit: 'a26f015 — Phase 3 Mission Control' },
    health: { uptime: 99.9, lastCheck: '2026-03-28T14:50:00Z', avgResponseTime: 156, errorCount: 0 },
  },
  {
    id: 'email', service: 'email', status: 'connected',
    connectedAt: '2026-02-01T00:00:00Z', lastSync: '2026-03-28T14:00:00Z',
    accountId: 'noreply@assaon.com', config: { provider: 'Resend', dailySent: 1234 },
    health: { uptime: 99.2, lastCheck: '2026-03-28T14:50:00Z', avgResponseTime: 312, errorCount: 2 },
  },
];

const MOCK_WEBHOOKS: Webhook[] = [
  { id: 'wh-1', eventType: 'user.created', targetUrl: 'https://hooks.assaon.com/user-created', active: true, createdAt: '2026-02-15T10:00:00Z', lastTriggered: '2026-03-28T14:23:00Z', successRate: 99.1, headers: { 'X-Assaon-Secret': 'whsec_••••••' } },
  { id: 'wh-2', eventType: 'payment.completed', targetUrl: 'https://hooks.assaon.com/payment', active: true, createdAt: '2026-02-20T12:00:00Z', lastTriggered: '2026-03-28T13:45:00Z', successRate: 97.3, headers: {} },
  { id: 'wh-3', eventType: 'project.deleted', targetUrl: 'https://hooks.assaon.com/cleanup', active: false, createdAt: '2026-03-01T09:00:00Z', lastTriggered: '2026-03-20T10:00:00Z', successRate: 100, headers: {} },
];

const MOCK_KEYS: ApiKey[] = [
  { id: 'key-1', name: 'production-key', keyHash: 'sk-live_••••••••••••••••••••••••••••••••••••••', prefix: 'sk-live', createdAt: '2026-02-01T00:00:00Z', lastUsed: '2026-03-28T14:50:00Z', permissions: ['read_users', 'write_projects', 'read_analytics'], environment: 'production' },
  { id: 'key-2', name: 'staging-key', keyHash: 'sk-test_••••••••••••••••••••••••••••••••••••••', prefix: 'sk-test', createdAt: '2026-03-15T00:00:00Z', lastUsed: '2026-03-25T10:00:00Z', permissions: ['read_users', 'read_projects'], environment: 'staging', expiresAt: '2026-06-15T00:00:00Z' },
];

const MOCK_LOGS: WebhookLog[] = [
  { id: 'log-1', webhookId: 'wh-1', timestamp: '2026-03-28T14:23:00Z', event: 'user.created', status: 'success', responseCode: 200, payloadSize: '1.2 KB' },
  { id: 'log-2', webhookId: 'wh-2', timestamp: '2026-03-28T13:45:00Z', event: 'payment.completed', status: 'retrying', responseCode: 429, payloadSize: '2.1 KB' },
  { id: 'log-3', webhookId: 'wh-1', timestamp: '2026-03-28T12:10:00Z', event: 'user.created', status: 'success', responseCode: 200, payloadSize: '890 B' },
  { id: 'log-4', webhookId: 'wh-2', timestamp: '2026-03-28T11:30:00Z', event: 'payment.completed', status: 'failed', responseCode: 500, payloadSize: '2.0 KB' },
  { id: 'log-5', webhookId: 'wh-3', timestamp: '2026-03-20T10:00:00Z', event: 'project.deleted', status: 'success', responseCode: 200, payloadSize: '650 B' },
];

export const WEBHOOK_EVENTS = [
  'user.created', 'user.updated', 'user.deleted',
  'project.created', 'project.updated', 'project.deleted',
  'payment.completed', 'subscription.started', 'subscription.cancelled',
  'deployment.started', 'deployment.completed', 'deployment.failed',
];

export const ALL_PERMISSIONS = ['read_users', 'write_users', 'read_projects', 'write_projects', 'read_analytics', 'admin'];

// ─── Hook ─────────────────────────────────────────────────────────────────────

export function useIntegrations() {
  const [activeTab, setActiveTab] = useState<'integrations' | 'api-dashboard' | 'health'>('integrations');
  const [activeIntegration, setActiveIntegration] = useState<'stripe' | 'supabase' | 'github'>('stripe');
  const [connections, setConnections] = useState<IntegrationConnection[]>(MOCK_CONNECTIONS);
  const [webhooks, setWebhooks] = useState<Webhook[]>(MOCK_WEBHOOKS);
  const [apiKeys, setApiKeys] = useState<ApiKey[]>(MOCK_KEYS);
  const [logs] = useState<WebhookLog[]>(MOCK_LOGS);
  const [syncing, setSyncing] = useState<string | null>(null);
  const [lastHealthCheck, setLastHealthCheck] = useState(new Date().toISOString());

  // Poll health every 30s
  useEffect(() => {
    const timer = setInterval(() => setLastHealthCheck(new Date().toISOString()), 30000);
    return () => clearInterval(timer);
  }, []);

  function getConnection(service: string) {
    return connections.find(c => c.service === service);
  }

  async function syncService(service: string) {
    setSyncing(service);
    await new Promise(r => setTimeout(r, 1500));
    setConnections(cs => cs.map(c => c.service === service ? { ...c, lastSync: new Date().toISOString() } : c));
    setSyncing(null);
  }

  function addWebhook(wh: Omit<Webhook, 'id' | 'createdAt' | 'lastTriggered' | 'successRate'>) {
    setWebhooks(ws => [...ws, { ...wh, id: `wh-${Date.now()}`, createdAt: new Date().toISOString(), lastTriggered: '-', successRate: 100 }]);
  }

  function toggleWebhook(id: string) {
    setWebhooks(ws => ws.map(w => w.id === id ? { ...w, active: !w.active } : w));
  }

  function deleteWebhook(id: string) {
    setWebhooks(ws => ws.filter(w => w.id !== id));
  }

  function addApiKey(cfg: { name: string; permissions: string[]; environment: 'production' | 'staging'; expiresAt?: string }) {
    const key: ApiKey = {
      id: `key-${Date.now()}`,
      name: cfg.name,
      keyHash: `sk-${cfg.environment === 'production' ? 'live' : 'test'}_${'•'.repeat(42)}`,
      prefix: `sk-${cfg.environment === 'production' ? 'live' : 'test'}`,
      createdAt: new Date().toISOString(),
      lastUsed: '-',
      permissions: cfg.permissions,
      environment: cfg.environment,
      expiresAt: cfg.expiresAt,
    };
    setApiKeys(ks => [...ks, key]);
  }

  function revokeApiKey(id: string) {
    setApiKeys(ks => ks.filter(k => k.id !== id));
  }

  function getLogsForWebhook(id: string) {
    return logs.filter(l => l.webhookId === id);
  }

  return {
    activeTab, setActiveTab,
    activeIntegration, setActiveIntegration,
    connections, getConnection, syncService, syncing,
    webhooks, addWebhook, toggleWebhook, deleteWebhook,
    apiKeys, addApiKey, revokeApiKey,
    logs, getLogsForWebhook,
    lastHealthCheck,
  };
}
