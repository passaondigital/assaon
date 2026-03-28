import React from 'react';
import { useIntegrations } from '../hooks/useIntegrations';
import IntegrationsSidebar from '../components/integrations/IntegrationsSidebar';
import StripeTab from '../components/integrations/StripeTab';
import SupabaseTab from '../components/integrations/SupabaseTab';
import GitHubTab from '../components/integrations/GitHubTab';
import WebhooksTab from '../components/integrations/WebhooksTab';
import ApiKeysTab from '../components/integrations/ApiKeysTab';
import HealthMonitor from '../components/integrations/HealthMonitor';
import '../styles/integrations.scss';

const INT_TABS = [
  { id: 'stripe'  as const, label: 'Stripe' },
  { id: 'supabase'as const, label: 'Supabase' },
  { id: 'github'  as const, label: 'GitHub' },
];

export default function Phase4Integrations() {
  const ig = useIntegrations();

  return (
    <div className="int-layout">
      <IntegrationsSidebar activeTab={ig.activeTab} onTabChange={ig.setActiveTab} />

      <div className="int-main">
        <header className="int-header">
          <div className="int-header__left">
            <h1 className="int-header__title">
              {ig.activeTab === 'integrations' && 'Integrations'}
              {ig.activeTab === 'api-dashboard' && 'API Dashboard'}
              {ig.activeTab === 'health' && 'Health Monitor'}
            </h1>
            <span className="int-header__sub">assaon.com · Phase 4</span>
          </div>
          <div className="int-header__right">
            <span className="int-header__badge">● Live</span>
          </div>
        </header>

        <div className="int-content">
          {/* ── Integrations Tab ─────────────────────────────── */}
          {ig.activeTab === 'integrations' && (
            <>
              <div className="int-subtabs">
                {INT_TABS.map(t => (
                  <button
                    key={t.id}
                    className={`int-subtab ${ig.activeIntegration === t.id ? 'active' : ''}`}
                    onClick={() => ig.setActiveIntegration(t.id)}
                  >
                    {t.label}
                  </button>
                ))}
              </div>

              {ig.activeIntegration === 'stripe' && (
                <StripeTab
                  connection={ig.getConnection('stripe')!}
                  onSync={() => ig.syncService('stripe')}
                  syncing={ig.syncing === 'stripe'}
                />
              )}
              {ig.activeIntegration === 'supabase' && (
                <SupabaseTab
                  connection={ig.getConnection('supabase')!}
                  onSync={() => ig.syncService('supabase')}
                  syncing={ig.syncing === 'supabase'}
                />
              )}
              {ig.activeIntegration === 'github' && (
                <GitHubTab
                  connection={ig.getConnection('github')!}
                  onSync={() => ig.syncService('github')}
                  syncing={ig.syncing === 'github'}
                />
              )}
            </>
          )}

          {/* ── API Dashboard Tab ─────────────────────────────── */}
          {ig.activeTab === 'api-dashboard' && (
            <div className="api-dashboard">
              <WebhooksTab
                webhooks={ig.webhooks}
                onAdd={ig.addWebhook}
                onToggle={ig.toggleWebhook}
                onDelete={ig.deleteWebhook}
                getLogs={ig.getLogsForWebhook}
              />
              <ApiKeysTab
                apiKeys={ig.apiKeys}
                onAdd={ig.addApiKey}
                onRevoke={ig.revokeApiKey}
              />
            </div>
          )}

          {/* ── Health Monitor Tab ────────────────────────────── */}
          {ig.activeTab === 'health' && (
            <HealthMonitor connections={ig.connections} lastCheck={ig.lastHealthCheck} />
          )}
        </div>
      </div>
    </div>
  );
}
