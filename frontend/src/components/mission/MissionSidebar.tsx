import React from 'react';

interface Props {
  activeTab: 'users' | 'analytics' | 'compliance';
  onTabChange: (tab: 'users' | 'analytics' | 'compliance') => void;
}

const TABS = [
  { id: 'users' as const, label: 'Users', icon: '👥', desc: 'User Management' },
  { id: 'analytics' as const, label: 'Analytics', icon: '📊', desc: 'Charts & Metrics' },
  { id: 'compliance' as const, label: 'Compliance', icon: '🛡️', desc: 'GDPR & EU AI Act' },
];

export default function MissionSidebar({ activeTab, onTabChange }: Props) {
  return (
    <aside className="mission-sidebar">
      <div className="mission-sidebar__logo">
        <span className="mission-sidebar__logo-icon">🚀</span>
        <div>
          <div className="mission-sidebar__logo-title">Mission Control</div>
          <div className="mission-sidebar__logo-sub">assaon.com</div>
        </div>
      </div>

      <nav className="mission-sidebar__nav">
        {TABS.map(tab => (
          <button
            key={tab.id}
            className={`mission-sidebar__item ${activeTab === tab.id ? 'active' : ''}`}
            onClick={() => onTabChange(tab.id)}
          >
            <span className="mission-sidebar__item-icon">{tab.icon}</span>
            <div className="mission-sidebar__item-text">
              <span className="mission-sidebar__item-label">{tab.label}</span>
              <span className="mission-sidebar__item-desc">{tab.desc}</span>
            </div>
          </button>
        ))}
      </nav>

      <div className="mission-sidebar__footer">
        <a href="/admin" className="mission-sidebar__back">← Admin Panel</a>
        <div className="mission-sidebar__version">Phase 3 · v3.0</div>
      </div>
    </aside>
  );
}
