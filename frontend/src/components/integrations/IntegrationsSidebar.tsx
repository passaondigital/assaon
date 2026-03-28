import React from 'react';

type Tab = 'integrations' | 'api-dashboard' | 'health';

interface Props {
  activeTab: Tab;
  onTabChange: (tab: Tab) => void;
}

const TABS = [
  { id: 'integrations' as Tab, label: 'Integrations', icon: '🔌', desc: 'Stripe · Supabase · GitHub' },
  { id: 'api-dashboard' as Tab, label: 'API Dashboard', icon: '⚡', desc: 'Webhooks · API Keys' },
  { id: 'health' as Tab, label: 'Health Monitor', icon: '💚', desc: 'Status · Uptime · Metrics' },
];

export default function IntegrationsSidebar({ activeTab, onTabChange }: Props) {
  return (
    <aside className="int-sidebar">
      <div className="int-sidebar__logo">
        <span className="int-sidebar__logo-icon">🔌</span>
        <div>
          <div className="int-sidebar__logo-title">Integrations</div>
          <div className="int-sidebar__logo-sub">assaon.com · Phase 4</div>
        </div>
      </div>

      <nav className="int-sidebar__nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`int-sidebar__item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="int-sidebar__item-icon">{tab.icon}</span>
            <div>
              <span className="int-sidebar__item-label">{tab.label}</span>
              <span className="int-sidebar__item-desc">{tab.desc}</span>
            </div>
          </button>
        ))}
      </nav>

      <div className="int-sidebar__footer">
        <a href="/mission-control" className="int-sidebar__back">← Mission Control</a>
        <a href="/admin" className="int-sidebar__back">← Admin Panel</a>
        <div className="int-sidebar__version">Phase 4 · v4.0</div>
      </div>
    </aside>
  );
}
