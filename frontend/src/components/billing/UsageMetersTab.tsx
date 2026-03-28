import React from 'react';
import { Line } from 'react-chartjs-2';
import type { UsageMeter } from '../../hooks/useBilling';

interface Props { meters: UsageMeter[] }

function generateUsageTrend(current: number, days = 30) {
  return Array.from({ length: days }, (_, i) => Math.round(current * (0.3 + (i / days) * 0.7) + Math.random() * current * 0.05));
}

const DAYS30 = Array.from({ length: 30 }, (_, i) => {
  const d = new Date('2026-02-27'); d.setDate(d.getDate() + i);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

const HISTORY = [
  { date: '2026-03-28', meter: 'API Calls',    usage: '12,345', overage: '€0.00', total: '€0.00' },
  { date: '2026-03-28', meter: 'Webhooks',     usage: '234',    overage: '€0.00', total: '€0.00' },
  { date: '2026-03-28', meter: 'Data Storage', usage: '2.3 GB', overage: '€0.00', total: '€0.00' },
  { date: '2026-02-28', meter: 'API Calls',    usage: '10,234', overage: '€0.00', total: '€0.00' },
  { date: '2026-02-28', meter: 'Webhooks',     usage: '189',    overage: '€0.00', total: '€0.00' },
];

export default function UsageMetersTab({ meters }: Props) {
  return (
    <div className="usage-tab">
      {/* Active Meters */}
      <div className="bl-section">
        <div className="bl-section__header"><h3>Active Usage Meters</h3></div>
        <div className="usage-meters-full-grid">
          {meters.map(m => {
            const pct = Math.min(100, (m.currentUsage / m.includedAmount) * 100);
            const trendData = generateUsageTrend(m.currentUsage);
            const color = pct > 90 ? '#ef4444' : pct > 75 ? '#f59e0b' : '#22c55e';

            return (
              <div key={m.id} className="usage-meter-full">
                <div className="usage-meter-full__header">
                  <div>
                    <h4 className="usage-meter-full__name">{m.name}</h4>
                    <span className="usage-meter-full__price">€{m.unitPrice} per {m.unit}</span>
                  </div>
                  <div className="usage-meter-full__right">
                    <span className="usage-meter-full__usage">{typeof m.currentUsage === 'number' && m.currentUsage < 10 ? `${m.currentUsage} GB` : m.currentUsage.toLocaleString()}</span>
                    <span className="usage-meter-full__limit">/ {m.includedAmount.toLocaleString()} {m.unit}</span>
                  </div>
                </div>
                <div className="usage-bar usage-bar--lg">
                  <div className="usage-bar__fill" style={{ width: `${pct}%`, background: color }} />
                </div>
                <div className="usage-meter-full__meta">
                  <span>{pct.toFixed(1)}% used</span>
                  <span>Resets: {new Date(m.resetDate).toLocaleDateString('de-DE')}</span>
                  <span style={{ color: m.overageCharges > 0 ? '#ef4444' : '#22c55e' }}>
                    {m.overageCharges > 0 ? `Overage: €${m.overageCharges.toFixed(2)}` : 'No overage'}
                  </span>
                </div>
                <div style={{ height: 80, marginTop: 12 }}>
                  <Line
                    data={{
                      labels: DAYS30,
                      datasets: [{ label: m.name, data: trendData, borderColor: color, backgroundColor: `${color}18`, fill: true, tension: 0.4, pointRadius: 0 }],
                    }}
                    options={{
                      responsive: true, maintainAspectRatio: false,
                      plugins: { legend: { display: false } },
                      scales: {
                        x: { display: false },
                        y: { display: false },
                      },
                    } as object}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>

      {/* Meter Config */}
      <div className="bl-section">
        <div className="bl-section__header"><h3>Meter Configuration (Admin)</h3></div>
        <div className="meter-config-grid">
          {meters.map(m => (
            <div key={m.id} className="meter-config-card">
              <h4>{m.name}</h4>
              <div className="form-row"><label>Unit of Measurement</label><input className="bl-input" defaultValue={m.unit} /></div>
              <div className="form-row"><label>Included Amount (free tier)</label><input className="bl-input" type="number" defaultValue={m.includedAmount} /></div>
              <div className="form-row"><label>Price per unit (€)</label><input className="bl-input" type="number" step="0.001" defaultValue={m.unitPrice} /></div>
              <div className="form-row form-row--inline">
                <label>Overage billing enabled</label>
                <button className="toggle-btn on"><span className="toggle-btn__knob" /></button>
              </div>
              <button className="btn btn--secondary btn--sm" onClick={() => alert('[Mock] Meter config saved')}>Save Config</button>
            </div>
          ))}
        </div>
      </div>

      {/* Usage History */}
      <div className="bl-section">
        <div className="bl-section__header"><h3>Historical Usage</h3></div>
        <div className="bl-table-wrap">
          <table className="bl-table">
            <thead><tr><th>Date</th><th>Meter</th><th>Usage</th><th>Overage Cost</th><th>Total Cost</th></tr></thead>
            <tbody>
              {HISTORY.map((row, i) => (
                <tr key={i}>
                  <td className="bl-table__dim">{row.date}</td>
                  <td>{row.meter}</td>
                  <td className="bl-table__dim">{row.usage}</td>
                  <td className="bl-table__dim">{row.overage}</td>
                  <td className="bl-table__bold">{row.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
