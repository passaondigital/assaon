import React from 'react';
import type { IntegrationConnection } from '../../hooks/useIntegrations';

interface Props {
  connection: IntegrationConnection;
  onSync?: () => void;
  syncing?: boolean;
  children?: React.ReactNode;
}

const SERVICE_META: Record<string, { logo: string; name: string; color: string }> = {
  stripe:   { logo: '💳', name: 'Stripe',   color: '#635bff' },
  supabase: { logo: '⚡', name: 'Supabase', color: '#3ecf8e' },
  github:   { logo: '🐙', name: 'GitHub',   color: '#ffffff' },
  email:    { logo: '📧', name: 'Email',    color: '#F5970A' },
};

export default function IntegrationCard({ connection, onSync, syncing, children }: Props) {
  const meta = SERVICE_META[connection.service] || { logo: '🔌', name: connection.service, color: '#888' };
  const isConnected = connection.status === 'connected';

  return (
    <div className="int-card">
      <div className="int-card__header">
        <div className="int-card__logo" style={{ background: `${meta.color}18`, border: `1px solid ${meta.color}30` }}>
          <span style={{ fontSize: 22 }}>{meta.logo}</span>
        </div>
        <div className="int-card__title-wrap">
          <h3 className="int-card__title">{meta.name}</h3>
          <span className="int-card__account">{connection.accountId}</span>
        </div>
        <span className={`int-badge ${isConnected ? 'int-badge--ok' : 'int-badge--err'}`}>
          {isConnected ? '● Connected' : '○ Disconnected'}
        </span>
      </div>

      <div className="int-card__stats">
        <div className="int-card__stat">
          <span className="int-card__stat-label">Uptime</span>
          <span className="int-card__stat-value">{connection.health.uptime}%</span>
        </div>
        <div className="int-card__stat">
          <span className="int-card__stat-label">Avg Response</span>
          <span className="int-card__stat-value">{connection.health.avgResponseTime}ms</span>
        </div>
        <div className="int-card__stat">
          <span className="int-card__stat-label">Last Sync</span>
          <span className="int-card__stat-value">{new Date(connection.lastSync).toLocaleTimeString('de-DE', { hour: '2-digit', minute: '2-digit' })}</span>
        </div>
        <div className="int-card__stat">
          <span className="int-card__stat-label">Errors</span>
          <span className={`int-card__stat-value ${connection.health.errorCount > 0 ? 'err' : 'ok'}`}>{connection.health.errorCount}</span>
        </div>
      </div>

      {children && <div className="int-card__body">{children}</div>}

      {onSync && (
        <div className="int-card__actions">
          <button className="btn btn--secondary btn--sm" onClick={onSync} disabled={syncing}>
            {syncing ? '⟳ Syncing…' : '🔄 Sync Now'}
          </button>
        </div>
      )}
    </div>
  );
}
