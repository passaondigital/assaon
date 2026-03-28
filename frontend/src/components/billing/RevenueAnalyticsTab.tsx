import React from 'react';
import { Line, Bar, Doughnut } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement,
  BarElement, ArcElement, Filler, Tooltip, Legend,
} from 'chart.js';
import type { RevenueMetrics } from '../../hooks/useBilling';
import { MRR_MONTHS, MRR_ACTUAL, MRR_PROJECTED, MRR_STARTER, MRR_PRO, MRR_ENT } from '../../hooks/useBilling';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

const ORANGE = '#F5970A', BLUE = '#3b82f6', GREEN = '#22c55e', RED = '#ef4444', PURPLE = '#a855f7';
const CHART_BASE = {
  responsive: true, maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#888', font: { family: 'Poppins', size: 11 } } } },
  scales: {
    x: { ticks: { color: '#555', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#555', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

interface Props { metrics: RevenueMetrics }

export default function RevenueAnalyticsTab({ metrics }: Props) {
  const kpis = [
    { label: 'MRR',    value: `€${metrics.mrr.toLocaleString()}`,   delta: '+12% vs last month', up: true,  sub: 'Monthly Recurring Revenue' },
    { label: 'ARR',    value: `€${metrics.arr.toLocaleString()}`,   delta: '+18% vs last year',  up: true,  sub: 'Annual Recurring Revenue' },
    { label: 'CAC',    value: `€${metrics.cac}`,                    delta: '↓ -8% (improving)',  up: true,  sub: 'Payback: 3.2 months' },
    { label: 'LTV',    value: `€${metrics.ltv.toLocaleString()}`,   delta: '+5% vs last month',  up: true,  sub: `LTV/CAC: ${(metrics.ltv / metrics.cac).toFixed(1)}x` },
    { label: 'Churn',  value: `${metrics.churnRate}%`,              delta: '↓ Improving',        up: true,  sub: 'Monthly churn rate' },
    { label: 'NRR',    value: `${metrics.nrr}%`,                    delta: '+3% expansion',      up: true,  sub: 'Net Revenue Retention' },
  ];

  // Churn vs Signups (90 days)
  const days90 = Array.from({ length: 90 }, (_, i) => {
    const d = new Date('2025-12-29'); d.setDate(d.getDate() + i);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
  const signups90 = days90.map(() => Math.floor(Math.random() * 8 + 2));
  const churn90   = days90.map(() => -(Math.floor(Math.random() * 3)));

  return (
    <div className="rev-tab">
      {/* KPIs */}
      <div className="rev-kpi-grid">
        {kpis.map(k => (
          <div key={k.label} className="rev-kpi">
            <div className="rev-kpi__label">{k.label}</div>
            <div className="rev-kpi__value">{k.value}</div>
            <div className={`rev-kpi__delta ${k.up ? 'up' : 'down'}`}>{k.delta}</div>
            <div className="rev-kpi__sub">{k.sub}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="rev-charts-grid">
        <div className="rev-chart-card rev-chart-card--wide">
          <h4>MRR Trend (12 months)</h4>
          <div style={{ height: 200 }}>
            <Line data={{
              labels: MRR_MONTHS,
              datasets: [
                { label: 'Actual MRR', data: MRR_ACTUAL, borderColor: ORANGE, backgroundColor: 'rgba(245,151,10,0.12)', fill: true, tension: 0.4, pointRadius: 3 },
                { label: 'Projected',  data: MRR_PROJECTED, borderColor: BLUE, borderDash: [5,5], fill: false, tension: 0.4, pointRadius: 2 },
              ],
            }} options={CHART_BASE as object} />
          </div>
        </div>

        <div className="rev-chart-card">
          <h4>Revenue by Plan (Stacked)</h4>
          <div style={{ height: 220 }}>
            <Bar data={{
              labels: MRR_MONTHS,
              datasets: [
                { label: 'Starter',      data: MRR_STARTER, backgroundColor: BLUE,   borderRadius: 2 },
                { label: 'Professional', data: MRR_PRO,     backgroundColor: ORANGE, borderRadius: 2 },
                { label: 'Enterprise',   data: MRR_ENT,     backgroundColor: GREEN,  borderRadius: 2 },
              ],
            }} options={{ ...CHART_BASE, scales: { ...CHART_BASE.scales, x: { ...CHART_BASE.scales.x, stacked: true }, y: { ...CHART_BASE.scales.y, stacked: true } } } as object} />
          </div>
        </div>

        <div className="rev-chart-card">
          <h4>Churn vs New Signups (90d)</h4>
          <div style={{ height: 220 }}>
            <Line data={{
              labels: days90,
              datasets: [
                { label: 'New',    data: signups90, borderColor: GREEN, backgroundColor: 'rgba(34,197,94,0.15)', fill: true, tension: 0.4, pointRadius: 0 },
                { label: 'Churn', data: churn90,   borderColor: RED,   backgroundColor: 'rgba(239,68,68,0.12)', fill: true, tension: 0.4, pointRadius: 0 },
              ],
            }} options={{ ...CHART_BASE, plugins: { ...CHART_BASE.plugins, legend: { labels: { color: '#888', font: { family: 'Poppins', size: 11 } } } } } as object} />
          </div>
        </div>

        <div className="rev-chart-card rev-chart-card--doughnut">
          <h4>Customer Segmentation</h4>
          <div style={{ height: 220 }}>
            <Doughnut data={{
              labels: ['Starter (28%)', 'Professional (68%)', 'Enterprise (4%)'],
              datasets: [{ data: [234, 567, 123], backgroundColor: [BLUE, ORANGE, GREEN], borderWidth: 0 }],
            }} options={{ responsive: true, maintainAspectRatio: false, cutout: '65%', plugins: { legend: { position: 'bottom', labels: { color: '#888', font: { family: 'Poppins', size: 11 } } } } } as object} />
          </div>
        </div>

        <div className="rev-chart-card">
          <h4>LTV / CAC Ratio (12 months)</h4>
          <div style={{ height: 220 }}>
            <Bar data={{
              labels: MRR_MONTHS,
              datasets: [{
                label: 'LTV/CAC',
                data: [28, 29, 30, 31, 30.5, 32.2, 33, 34, 35, 36, 37, 38],
                backgroundColor: MRR_MONTHS.map((_, i) => i < 6 ? ORANGE : 'rgba(245,151,10,0.35)'),
                borderRadius: 4,
              }],
            }} options={{ ...CHART_BASE, plugins: { ...CHART_BASE.plugins, legend: { display: false } } } as object} />
          </div>
        </div>
      </div>

      <div className="rev-exports">
        <button className="btn btn--secondary" onClick={() => alert('CSV export coming soon')}>⬇ Download CSV</button>
        <button className="btn btn--secondary" onClick={() => window.print()}>🖨 Download PDF</button>
      </div>
    </div>
  );
}
