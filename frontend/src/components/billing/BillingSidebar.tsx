import React from 'react';

type Tab = 'portal' | 'revenue' | 'cohorts' | 'predictive' | 'usage';

interface Props { activeTab: Tab; onTabChange: (t: Tab) => void; }

const TABS = [
  { id: 'portal'     as Tab, icon: '💳', label: 'Billing Portal',      desc: 'Subscription · Invoices' },
  { id: 'revenue'    as Tab, icon: '📈', label: 'Revenue Analytics',   desc: 'MRR · ARR · Churn · LTV' },
  { id: 'cohorts'    as Tab, icon: '🔬', label: 'Cohort Analysis',     desc: 'Retention · Expansion' },
  { id: 'predictive' as Tab, icon: '🔮', label: 'Predictive Analytics',desc: 'Forecasts · Churn Risk' },
  { id: 'usage'      as Tab, icon: '⚡', label: 'Usage Meters',        desc: 'Metered Billing' },
];

export default function BillingSidebar({ activeTab, onTabChange }: Props) {
  return (
    <aside className="bl-sidebar">
      <div className="bl-sidebar__logo">
        <span style={{ fontSize: 26 }}>💳</span>
        <div>
          <div className="bl-sidebar__title">Billing & Revenue</div>
          <div className="bl-sidebar__sub">assaon.com · Phase 5</div>
        </div>
      </div>
      <nav className="bl-sidebar__nav">
        {TABS.map(t => (
          <button key={t.id} className={`bl-sidebar__item ${activeTab === t.id ? 'active' : ''}`} onClick={() => onTabChange(t.id)}>
            <span className="bl-sidebar__icon">{t.icon}</span>
            <div>
              <span className="bl-sidebar__label">{t.label}</span>
              <span className="bl-sidebar__desc">{t.desc}</span>
            </div>
          </button>
        ))}
      </nav>
      <div className="bl-sidebar__footer">
        <a href="/integrations" className="bl-sidebar__back">← Integrations</a>
        <a href="/mission-control" className="bl-sidebar__back">← Mission Control</a>
        <div className="bl-sidebar__version">Phase 5 · v5.0</div>
      </div>
    </aside>
  );
}
