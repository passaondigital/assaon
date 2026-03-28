import React, { useState } from 'react';
import type { Webhook, WebhookLog } from '../../hooks/useIntegrations';
import { WEBHOOK_EVENTS } from '../../hooks/useIntegrations';

interface Props {
  webhooks: Webhook[];
  onAdd: (wh: Omit<Webhook, 'id' | 'createdAt' | 'lastTriggered' | 'successRate'>) => void;
  onToggle: (id: string) => void;
  onDelete: (id: string) => void;
  getLogs: (id: string) => WebhookLog[];
}

export default function WebhooksTab({ webhooks, onAdd, onToggle, onDelete, getLogs }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [selectedId, setSelectedId] = useState<string | null>(null);
  const [form, setForm] = useState({ eventType: WEBHOOK_EVENTS[0], targetUrl: '', active: true, retryPolicy: 3 });

  function handleCreate() {
    if (!form.targetUrl.trim()) { alert('Target URL required'); return; }
    onAdd({ eventType: form.eventType, targetUrl: form.targetUrl, active: form.active, headers: {} });
    setShowCreate(false);
    setForm({ eventType: WEBHOOK_EVENTS[0], targetUrl: '', active: true, retryPolicy: 3 });
  }

  const logs = selectedId ? getLogs(selectedId) : [];

  return (
    <div className="int-tab-content">
      <div className="int-section">
        <div className="int-section__header">
          <h3>Webhooks <span className="int-count">{webhooks.filter(w => w.active).length} active</span></h3>
          <button className="btn btn--primary btn--sm" onClick={() => setShowCreate(v => !v)}>+ Create Webhook</button>
        </div>

        {showCreate && (
          <div className="wh-create-form">
            <h4>New Webhook</h4>
            <div className="form-row">
              <label>Event Type</label>
              <select className="int-select" value={form.eventType} onChange={e => setForm(f => ({ ...f, eventType: e.target.value }))}>
                {WEBHOOK_EVENTS.map(ev => <option key={ev} value={ev}>{ev}</option>)}
              </select>
            </div>
            <div className="form-row">
              <label>Target URL</label>
              <input className="int-input" type="url" placeholder="https://example.com/webhook" value={form.targetUrl} onChange={e => setForm(f => ({ ...f, targetUrl: e.target.value }))} />
            </div>
            <div className="form-row">
              <label>Retry Policy</label>
              <select className="int-select" value={form.retryPolicy} onChange={e => setForm(f => ({ ...f, retryPolicy: +e.target.value }))}>
                <option value={3}>3 times</option>
                <option value={5}>5 times</option>
                <option value={0}>No retry</option>
              </select>
            </div>
            <div className="form-row form-row--inline">
              <label>Active</label>
              <button className={`toggle-btn ${form.active ? 'on' : ''}`} onClick={() => setForm(f => ({ ...f, active: !f.active }))}>
                <span className="toggle-btn__knob" />
              </button>
            </div>
            <div className="wh-example">
              <span className="wh-example__label">Example Payload:</span>
              <pre className="wh-example__code">{JSON.stringify({ event: form.eventType, timestamp: new Date().toISOString(), data: { id: 'user-123', email: 'user@example.com' } }, null, 2)}</pre>
            </div>
            <div className="form-actions">
              <button className="btn btn--secondary btn--sm" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn--primary btn--sm" onClick={handleCreate}>Save Webhook</button>
            </div>
          </div>
        )}

        <div className="wh-list">
          {webhooks.map(wh => (
            <div key={wh.id} className={`wh-item ${!wh.active ? 'inactive' : ''}`}>
              <div className="wh-item__main">
                <div className="wh-item__event">
                  <code className="int-code">{wh.eventType}</code>
                  <button className={`toggle-btn sm ${wh.active ? 'on' : ''}`} onClick={() => onToggle(wh.id)}>
                    <span className="toggle-btn__knob" />
                  </button>
                </div>
                <div className="wh-item__url">{wh.targetUrl}</div>
                <div className="wh-item__meta">
                  Last: {wh.lastTriggered === '-' ? 'Never' : new Date(wh.lastTriggered).toLocaleString('de-DE')} ·
                  Success: <span className={`${wh.successRate > 95 ? 'ok-text' : wh.successRate > 80 ? 'warn-text' : 'err-text'}`}>{wh.successRate}%</span>
                </div>
              </div>
              <div className="wh-item__actions">
                <button className="action-btn-sm" onClick={() => setSelectedId(selectedId === wh.id ? null : wh.id)}>
                  {selectedId === wh.id ? 'Hide Logs' : 'View Logs'}
                </button>
                <button className="action-btn-sm" onClick={() => alert('[Mock] Test payload sent!')}>Test</button>
                <button className="action-btn-sm action-btn-sm--danger" onClick={() => { if (confirm('Delete webhook?')) onDelete(wh.id); }}>Delete</button>
              </div>
            </div>
          ))}
        </div>

        {selectedId && logs.length > 0 && (
          <div className="int-section" style={{ marginTop: 16 }}>
            <div className="int-section__header"><h4>Webhook Logs</h4></div>
            <div className="int-table-wrap">
              <table className="int-table">
                <thead><tr><th>Timestamp</th><th>Event</th><th>Status</th><th>Code</th><th>Size</th></tr></thead>
                <tbody>
                  {logs.map(log => (
                    <tr key={log.id}>
                      <td className="int-table__dim">{new Date(log.timestamp).toLocaleString('de-DE')}</td>
                      <td><code className="int-code">{log.event}</code></td>
                      <td><span className={`int-badge int-badge--${log.status === 'success' ? 'ok' : log.status === 'retrying' ? 'warn' : 'err'}`}>{log.status}</span></td>
                      <td className="int-table__mono">{log.responseCode}</td>
                      <td className="int-table__dim">{log.payloadSize}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
