import React, { useState } from 'react';
import type { ApiKey } from '../../hooks/useIntegrations';
import { ALL_PERMISSIONS } from '../../hooks/useIntegrations';

interface Props {
  apiKeys: ApiKey[];
  onAdd: (cfg: { name: string; permissions: string[]; environment: 'production' | 'staging'; expiresAt?: string }) => void;
  onRevoke: (id: string) => void;
}

export default function ApiKeysTab({ apiKeys, onAdd, onRevoke }: Props) {
  const [showCreate, setShowCreate] = useState(false);
  const [form, setForm] = useState({ name: '', permissions: [] as string[], environment: 'production' as 'production' | 'staging', expiry: 'never' });

  function togglePermission(p: string) {
    setForm(f => ({ ...f, permissions: f.permissions.includes(p) ? f.permissions.filter(x => x !== p) : [...f.permissions, p] }));
  }

  function handleCreate() {
    if (!form.name.trim()) { alert('Name required'); return; }
    if (!form.permissions.length) { alert('Select at least one permission'); return; }
    const expiresAt = form.expiry === 'never' ? undefined : form.expiry === '30d'
      ? new Date(Date.now() + 30 * 86400000).toISOString()
      : new Date(Date.now() + 90 * 86400000).toISOString();
    onAdd({ name: form.name, permissions: form.permissions, environment: form.environment, expiresAt });
    setShowCreate(false);
    setForm({ name: '', permissions: [], environment: 'production', expiry: 'never' });
  }

  function isStale(lastUsed: string) {
    if (lastUsed === '-') return false;
    return new Date(lastUsed) < new Date(Date.now() - 7 * 86400000);
  }

  return (
    <div className="int-tab-content">
      <div className="int-section">
        <div className="int-section__header">
          <h3>API Keys <span className="int-count">{apiKeys.length} active</span></h3>
          <button className="btn btn--primary btn--sm" onClick={() => setShowCreate(v => !v)}>+ Create API Key</button>
        </div>

        {showCreate && (
          <div className="wh-create-form">
            <h4>New API Key</h4>
            <div className="form-row">
              <label>Name</label>
              <input className="int-input" placeholder="e.g. production-key" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
            </div>
            <div className="form-row">
              <label>Permissions</label>
              <div className="perm-grid">
                {ALL_PERMISSIONS.map(p => (
                  <label key={p} className="perm-item">
                    <input type="checkbox" checked={form.permissions.includes(p)} onChange={() => togglePermission(p)} />
                    <span>{p}</span>
                  </label>
                ))}
              </div>
            </div>
            <div className="form-row">
              <label>Environment</label>
              <select className="int-select" value={form.environment} onChange={e => setForm(f => ({ ...f, environment: e.target.value as 'production' | 'staging' }))}>
                <option value="production">Production</option>
                <option value="staging">Staging</option>
              </select>
            </div>
            <div className="form-row">
              <label>Expiration</label>
              <select className="int-select" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))}>
                <option value="never">Never</option>
                <option value="30d">30 days</option>
                <option value="90d">90 days</option>
              </select>
            </div>
            <div className="form-actions">
              <button className="btn btn--secondary btn--sm" onClick={() => setShowCreate(false)}>Cancel</button>
              <button className="btn btn--primary btn--sm" onClick={handleCreate}>Generate Key</button>
            </div>
          </div>
        )}

        <div className="int-table-wrap">
          <table className="int-table">
            <thead>
              <tr><th>Name</th><th>Key</th><th>Environment</th><th>Created</th><th>Last Used</th><th>Permissions</th><th>Expires</th><th>Actions</th></tr>
            </thead>
            <tbody>
              {apiKeys.map(key => (
                <tr key={key.id} className={isStale(key.lastUsed) ? 'int-table__row--stale' : ''}>
                  <td className="int-table__bold">{key.name}</td>
                  <td>
                    <div className="apikey-cell">
                      <code className="int-code apikey-hash">{key.keyHash}</code>
                      <button className="action-btn-sm" onClick={() => navigator.clipboard.writeText(key.keyHash).then(() => alert('Copied!'))}>Copy</button>
                    </div>
                  </td>
                  <td>
                    <span className={`int-badge ${key.environment === 'production' ? 'int-badge--prod' : 'int-badge--staging'}`}>
                      {key.environment}
                    </span>
                  </td>
                  <td className="int-table__dim">{new Date(key.createdAt).toLocaleDateString('de-DE')}</td>
                  <td className={`int-table__dim ${isStale(key.lastUsed) ? 'warn-text' : ''}`}>
                    {key.lastUsed === '-' ? '—' : new Date(key.lastUsed).toLocaleDateString('de-DE')}
                    {isStale(key.lastUsed) && <span className="stale-tag"> stale</span>}
                  </td>
                  <td>
                    <div className="perm-tags">
                      {key.permissions.map(p => <span key={p} className="perm-tag">{p}</span>)}
                    </div>
                  </td>
                  <td className="int-table__dim">{key.expiresAt ? new Date(key.expiresAt).toLocaleDateString('de-DE') : '—'}</td>
                  <td>
                    <div className="int-table__actions">
                      <button className="action-btn-sm" onClick={() => alert('[Mock] Key rotated. New key generated.')}>Rotate</button>
                      <button className="action-btn-sm action-btn-sm--danger" onClick={() => { if (confirm(`Revoke "${key.name}"?`)) onRevoke(key.id); }}>Revoke</button>
                    </div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
