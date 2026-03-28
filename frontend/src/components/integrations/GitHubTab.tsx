import React, { useState } from 'react';
import IntegrationCard from './IntegrationCard';
import type { IntegrationConnection } from '../../hooks/useIntegrations';
import { triggerDeploy } from '../../utils/integrationsApi';

interface Props {
  connection: IntegrationConnection;
  onSync: () => void;
  syncing: boolean;
}

const DEPLOYMENTS = [
  { time: '2026-03-28 14:50', branch: 'main',    status: 'success', duration: '2m 34s', commit: 'a26f015' },
  { time: '2026-03-28 10:12', branch: 'develop', status: 'success', duration: '3m 01s', commit: '16e937b' },
  { time: '2026-03-27 16:30', branch: 'main',    status: 'failed',  duration: '1m 12s', commit: '9f43a40' },
  { time: '2026-03-26 11:00', branch: 'main',    status: 'success', duration: '2m 55s', commit: 'b7ef224' },
];

export default function GitHubTab({ connection, onSync, syncing }: Props) {
  const cfg = connection.config as { branch: string; autoDeploy: boolean; lastCommit: string };
  const [autoDeploy, setAutoDeploy] = useState(cfg.autoDeploy);
  const [deployEnv, setDeployEnv] = useState<'production' | 'staging'>('production');
  const [deploying, setDeploying] = useState(false);

  async function handleDeploy() {
    setDeploying(true);
    try {
      await triggerDeploy(cfg.branch);
      alert(`Deploy triggered on branch: ${cfg.branch}`);
    } catch {
      alert('[Mock] Deploy triggered. Connect GitHub API token for real deploys.');
    }
    setDeploying(false);
  }

  const webhookUrl = `https://assaon.com/api/integrations/github/webhook`;

  return (
    <div className="int-tab-content">
      <IntegrationCard connection={connection} onSync={onSync} syncing={syncing}>
        <div className="gh-info">
          <div className="gh-info__row">
            <span className="gh-info__label">Repository</span>
            <a href={`https://github.com/${connection.accountId}`} target="_blank" rel="noreferrer" className="gh-info__link">
              🐙 {connection.accountId} ↗
            </a>
          </div>
          <div className="gh-info__row">
            <span className="gh-info__label">Branch</span>
            <code className="int-code">{cfg.branch}</code>
          </div>
          <div className="gh-info__row">
            <span className="gh-info__label">Last Commit</span>
            <span className="gh-info__value">{cfg.lastCommit}</span>
          </div>
        </div>

        <div className="gh-deploy-config">
          <div className="gh-toggle-row">
            <span>Auto-Deploy on Push</span>
            <button
              className={`toggle-btn ${autoDeploy ? 'on' : ''}`}
              onClick={() => setAutoDeploy(v => !v)}
            >
              <span className="toggle-btn__knob" />
            </button>
          </div>
          <div className="gh-toggle-row">
            <span>Deploy Environment</span>
            <select className="int-select" value={deployEnv} onChange={e => setDeployEnv(e.target.value as 'production' | 'staging')}>
              <option value="production">Production</option>
              <option value="staging">Staging</option>
            </select>
          </div>
          <div className="gh-webhook-url">
            <span className="gh-info__label">Deployment Webhook</span>
            <div className="gh-webhook-row">
              <code className="gh-webhook-code">{webhookUrl}</code>
              <button className="action-btn-sm" onClick={() => navigator.clipboard.writeText(webhookUrl)}>Copy</button>
            </div>
          </div>
        </div>

        <div className="int-card__actions">
          <button className="btn btn--primary btn--sm" onClick={handleDeploy} disabled={deploying}>
            {deploying ? '⟳ Deploying…' : '🚀 Trigger Deploy'}
          </button>
          <a href={`https://github.com/${connection.accountId}/actions`} target="_blank" rel="noreferrer" className="btn btn--secondary btn--sm">📝 Workflows ↗</a>
        </div>
      </IntegrationCard>

      <div className="int-section">
        <div className="int-section__header"><h3>Recent Deployments</h3></div>
        <div className="int-table-wrap">
          <table className="int-table">
            <thead><tr><th>Timestamp</th><th>Branch</th><th>Commit</th><th>Status</th><th>Duration</th></tr></thead>
            <tbody>
              {DEPLOYMENTS.map((d, i) => (
                <tr key={i}>
                  <td className="int-table__dim">{d.time}</td>
                  <td><code className="int-code">{d.branch}</code></td>
                  <td><code className="int-code">{d.commit}</code></td>
                  <td><span className={`int-badge int-badge--${d.status === 'success' ? 'ok' : 'err'}`}>{d.status === 'success' ? '✓ Success' : '✗ Failed'}</span></td>
                  <td className="int-table__dim">{d.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
