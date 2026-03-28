import React from 'react';
import IntegrationCard from './IntegrationCard';
import type { IntegrationConnection } from '../../hooks/useIntegrations';

interface Props {
  connection: IntegrationConnection;
  onSync: () => void;
  syncing: boolean;
}

const SYNC_HISTORY = [
  { time: '2026-03-28 14:45', action: 'Full Sync',    status: 'success', details: '1,234 records synced' },
  { time: '2026-03-28 14:00', action: 'Incremental',  status: 'success', details: '45 new records' },
  { time: '2026-03-28 13:00', action: 'Incremental',  status: 'success', details: '12 new records' },
  { time: '2026-03-28 12:00', action: 'Full Sync',    status: 'error',   details: 'Timeout after 30s' },
  { time: '2026-03-28 11:00', action: 'Incremental',  status: 'success', details: '8 new records' },
];

export default function SupabaseTab({ connection, onSync, syncing }: Props) {
  const cfg = connection.config as { projectUrl: string; tables: number; records: number };

  function handleBackup() {
    alert('[Mock] Backup triggered. In production this creates a pg_dump and stores it in S3.');
  }

  return (
    <div className="int-tab-content">
      <IntegrationCard connection={connection} onSync={onSync} syncing={syncing}>
        <div className="supa-status-grid">
          <div className="supa-status-item ok">
            <span className="supa-status-icon">✅</span>
            <div>
              <span className="supa-status-label">Connection</span>
              <span className="supa-status-val">Connected</span>
            </div>
          </div>
          <div className="supa-status-item ok">
            <span className="supa-status-icon">✅</span>
            <div>
              <span className="supa-status-label">Project URL</span>
              <span className="supa-status-val supa-url">{cfg.projectUrl}</span>
            </div>
          </div>
          <div className="supa-status-item ok">
            <span className="supa-status-icon">✅</span>
            <div>
              <span className="supa-status-label">Tables</span>
              <span className="supa-status-val">{cfg.tables.toLocaleString()}</span>
            </div>
          </div>
          <div className="supa-status-item ok">
            <span className="supa-status-icon">✅</span>
            <div>
              <span className="supa-status-label">Total Records</span>
              <span className="supa-status-val">{cfg.records.toLocaleString()}</span>
            </div>
          </div>
        </div>

        <div className="int-card__actions">
          <button className="btn btn--primary btn--sm" onClick={onSync} disabled={syncing}>{syncing ? '⟳ Syncing…' : '🔄 Sync Now'}</button>
          <button className="btn btn--secondary btn--sm" onClick={handleBackup}>⬇️ Backup</button>
          <a href={`https://${cfg.projectUrl.replace('https://', '')}`} target="_blank" rel="noreferrer" className="btn btn--secondary btn--sm">📊 Dashboard ↗</a>
        </div>
      </IntegrationCard>

      <div className="int-section">
        <div className="int-section__header"><h3>Sync History</h3></div>
        <div className="int-table-wrap">
          <table className="int-table">
            <thead><tr><th>Timestamp</th><th>Action</th><th>Status</th><th>Details</th></tr></thead>
            <tbody>
              {SYNC_HISTORY.map((row, i) => (
                <tr key={i}>
                  <td className="int-table__dim">{row.time}</td>
                  <td>{row.action}</td>
                  <td><span className={`int-badge int-badge--${row.status === 'success' ? 'ok' : 'err'}`}>{row.status === 'success' ? '✓ Success' : '✗ Error'}</span></td>
                  <td className="int-table__dim">{row.details}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
