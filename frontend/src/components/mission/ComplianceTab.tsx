import React from 'react';
import type { ComplianceItem } from '../../hooks/useMissionControl';
import ComplianceChecklist from './ComplianceChecklist';

interface Props {
  gdprItems: ComplianceItem[];
  euAiItems: ComplianceItem[];
  onToggle: (id: string) => void;
}

export default function ComplianceTab({ gdprItems, euAiItems, onToggle }: Props) {
  function handleAction(item: ComplianceItem) {
    const actions: Record<string, () => void> = {
      'gdpr-2': () => {
        const id = prompt('Enter User ID to test GDPR delete:');
        if (id) alert(`[Mock] GDPR soft-delete triggered for user: ${id}\nWill purge in 30 days.`);
      },
      'gdpr-3': () => {
        const id = prompt('Enter User ID to test GDPR export:');
        if (id) {
          const data = JSON.stringify({ userId: id, exportedAt: new Date().toISOString(), note: 'Mock export' }, null, 2);
          const blob = new Blob([data], { type: 'application/json' });
          const url = URL.createObjectURL(blob);
          const a = document.createElement('a');
          a.href = url;
          a.download = `user_${id}_export.json`;
          a.click();
        }
      },
      'gdpr-5': () => alert('[Mock] Audit log viewer — connect backend to show real logs.'),
      'ai-2': () => alert('[Mock] PDF upload — connect file storage to enable.'),
      'ai-6': () => alert('[Mock] Incident tracker — no incidents logged.'),
    };
    (actions[item.id] || (() => alert(`[Mock] Action for: ${item.title}`)))();
  }

  const totalItems = gdprItems.length + euAiItems.length;
  const completedItems = [...gdprItems, ...euAiItems].filter(i => i.completed).length;
  const pct = Math.round((completedItems / totalItems) * 100);

  return (
    <div className="compliance-tab">
      {/* Overview Banner */}
      <div className="compliance-overview">
        <div className="compliance-overview__score">
          <span className="compliance-overview__pct">{pct}%</span>
          <span className="compliance-overview__label">Compliance Score</span>
        </div>
        <div className="compliance-overview__bar">
          <div className="compliance-overview__bar-fill" style={{ width: `${pct}%` }} />
        </div>
        <p className="compliance-overview__note">
          {completedItems} of {totalItems} compliance requirements met.
          {pct < 80 && ' ⚠ Action required before launch.'}
          {pct >= 80 && pct < 100 && ' Almost there — complete remaining items.'}
          {pct === 100 && ' ✓ Fully compliant.'}
        </p>
      </div>

      <div className="compliance-sections">
        <ComplianceChecklist
          title="GDPR Compliance"
          items={gdprItems}
          onToggle={onToggle}
          onAction={handleAction}
        />
        <ComplianceChecklist
          title="EU AI Act Compliance"
          items={euAiItems}
          onToggle={onToggle}
          onAction={handleAction}
        />
      </div>

      {/* GDPR Endpoints Reference */}
      <div className="compliance-endpoints">
        <h4>GDPR API Endpoints</h4>
        <div className="endpoint-list">
          <div className="endpoint">
            <span className="endpoint__method post">POST</span>
            <code>/api/mission/gdpr/delete/:userId</code>
            <span className="endpoint__desc">Soft-delete user (30d undo window)</span>
          </div>
          <div className="endpoint">
            <span className="endpoint__method get">GET</span>
            <code>/api/mission/gdpr/export/:userId</code>
            <span className="endpoint__desc">Export user data as JSON</span>
          </div>
          <div className="endpoint">
            <span className="endpoint__method post">POST</span>
            <code>/api/mission/gdpr/retention-check</code>
            <span className="endpoint__desc">Purge users past 30-day retention</span>
          </div>
        </div>
      </div>
    </div>
  );
}
