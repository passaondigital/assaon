import React from 'react';
import { Line } from 'react-chartjs-2';
import type { RevenueMetrics } from '../../hooks/useBilling';
import { MRR_MONTHS } from '../../hooks/useBilling';

interface Props {
  metrics: RevenueMetrics;
  scenario: 'conservative' | 'base' | 'optimistic';
  onScenarioChange: (s: 'conservative' | 'base' | 'optimistic') => void;
  getForecastData: () => (number | null)[];
}

const CHURN_RISK = [
  { name: 'Acme Veterinary',    industry: 'Veterinary', mrr: 145, risk: 89, reason: 'Low usage (3 logins last 30d)' },
  { name: 'Equine Partner GmbH',industry: 'Equine',     mrr: 99,  risk: 76, reason: 'No projects created this month' },
  { name: 'PetCare Solutions',  industry: 'Dog Training',mrr: 29,  risk: 71, reason: 'Support ticket unresolved 14d' },
];

const UPSELL_OPP = [
  { name: 'WildLife GmbH',     mrr: 29,  plan: 'Starter',       score: 94, reason: 'Near project limit (4/5 used)' },
  { name: 'FarmTech AG',       mrr: 29,  plan: 'Starter',       score: 88, reason: 'High API usage (89k/100k calls)' },
  { name: 'BreedPro Systems',  mrr: 29,  plan: 'Professional',  score: 82, reason: 'Custom domain needed' },
];

const CHART_OPTS = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#888', font: { family: 'Poppins', size: 11 } } } },
  scales: {
    x: { ticks: { color: '#555', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#555', font: { size: 10 }, callback: (v: unknown) => `€${(v as number).toLocaleString()}` }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

export default function PredictiveAnalyticsTab({ metrics, scenario, onScenarioChange, getForecastData }: Props) {
  const forecastData = getForecastData();
  const actualData = [25000, 27500, 29000, 30200, 31450, 32456, null, null, null, null, null, null];
  const upper = forecastData.map(v => v === null ? null : Math.round(v * 1.1));
  const lower = forecastData.map(v => v === null ? null : Math.round(v * 0.9));

  const projectedFinal = forecastData[11] ?? 0;
  const growth = Math.round(((projectedFinal - metrics.mrr) / metrics.mrr) * 100);

  return (
    <div className="pred-tab">
      {/* Scenario Toggle */}
      <div className="bl-section">
        <div className="bl-section__header">
          <h3>Revenue Forecast (12 months)</h3>
          <div className="scenario-toggle">
            {(['conservative', 'base', 'optimistic'] as const).map(s => (
              <button key={s} className={`scenario-btn ${scenario === s ? 'active' : ''}`} onClick={() => onScenarioChange(s)}>
                {s === 'conservative' ? '↙ Conservative' : s === 'base' ? '→ Base Case' : '↗ Optimistic'}
              </button>
            ))}
          </div>
        </div>

        <div style={{ height: 250, marginBottom: 16 }}>
          <Line data={{
            labels: MRR_MONTHS,
            datasets: [
              { label: 'Actual MRR',     data: actualData,   borderColor: '#F5970A', backgroundColor: 'rgba(245,151,10,0.1)', fill: true, tension: 0.4, pointRadius: 3 },
              { label: 'Forecast',       data: forecastData, borderColor: '#3b82f6', borderDash: [6,3], fill: false, tension: 0.4, pointRadius: 2 },
              { label: 'Upper (±10%)',   data: upper, borderColor: 'rgba(59,130,246,0.2)', backgroundColor: 'rgba(59,130,246,0.07)', fill: '+1', tension: 0.4, pointRadius: 0, borderDash: [3,3] },
              { label: 'Lower (±10%)',   data: lower, borderColor: 'rgba(59,130,246,0.2)', fill: false, tension: 0.4, pointRadius: 0, borderDash: [3,3] },
            ],
          }} options={CHART_OPTS as object} />
        </div>

        <div className="forecast-summary">
          <div className="forecast-stat">
            <span className="forecast-stat__label">Current MRR</span>
            <span className="forecast-stat__value">€{metrics.mrr.toLocaleString()}</span>
          </div>
          <div className="forecast-stat">
            <span className="forecast-stat__label">Projected MRR (12m)</span>
            <span className="forecast-stat__value up">€{projectedFinal.toLocaleString()} <small>+{growth}%</small></span>
          </div>
          <div className="forecast-stat">
            <span className="forecast-stat__label">Churn Assumption</span>
            <span className="forecast-stat__value">{scenario === 'conservative' ? '3.2%' : scenario === 'base' ? '2.3%' : '1.8%'}</span>
          </div>
          <div className="forecast-stat">
            <span className="forecast-stat__label">CAC Trend</span>
            <span className="forecast-stat__value">{scenario === 'conservative' ? 'Stable' : scenario === 'base' ? '-1%/mo' : '-2%/mo'}</span>
          </div>
          <div className="forecast-stat">
            <span className="forecast-stat__label">Expansion Rate</span>
            <span className="forecast-stat__value">{scenario === 'conservative' ? '5%' : scenario === 'base' ? '8%' : '12%'}/mo</span>
          </div>
        </div>
      </div>

      {/* Churn Risk */}
      <div className="bl-section">
        <div className="bl-section__header">
          <h3>🔴 Churn Risk Customers</h3>
          <span className="bl-count">{CHURN_RISK.length} high-risk accounts</span>
        </div>
        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead><tr><th>Customer</th><th>Industry</th><th>MRR</th><th>Risk Score</th><th>Reason</th><th>Action</th></tr></thead>
            <tbody>
              {CHURN_RISK.map((c, i) => (
                <tr key={i}>
                  <td className="bl-table__bold">{c.name}</td>
                  <td className="bl-table__dim">{c.industry}</td>
                  <td className="bl-table__dim">€{c.mrr}</td>
                  <td>
                    <div className="risk-score">
                      <div className="risk-bar"><div style={{ width: `${c.risk}%`, background: c.risk > 80 ? '#ef4444' : '#f59e0b' }} /></div>
                      <span style={{ color: c.risk > 80 ? '#ef4444' : '#f59e0b' }}>{c.risk}%</span>
                    </div>
                  </td>
                  <td className="bl-table__dim">{c.reason}</td>
                  <td><button className="action-btn-sm" onClick={() => alert(`[Mock] Reach out to ${c.name}`)}>Reach Out</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Upsell */}
      <div className="bl-section">
        <div className="bl-section__header">
          <h3>💡 Upsell Opportunities</h3>
          <span className="bl-count">{UPSELL_OPP.length} high-potential accounts</span>
        </div>
        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead><tr><th>Customer</th><th>Current Plan</th><th>MRR</th><th>Upsell Score</th><th>Trigger</th><th>Action</th></tr></thead>
            <tbody>
              {UPSELL_OPP.map((u, i) => (
                <tr key={i}>
                  <td className="bl-table__bold">{u.name}</td>
                  <td><span className="bl-badge bl-badge--ok">{u.plan}</span></td>
                  <td className="bl-table__dim">€{u.mrr}</td>
                  <td>
                    <div className="risk-score">
                      <div className="risk-bar"><div style={{ width: `${u.score}%`, background: '#22c55e' }} /></div>
                      <span style={{ color: '#22c55e' }}>{u.score}%</span>
                    </div>
                  </td>
                  <td className="bl-table__dim">{u.reason}</td>
                  <td><button className="action-btn-sm" onClick={() => alert(`[Mock] Send upgrade offer to ${u.name}`)}>Send Offer</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
