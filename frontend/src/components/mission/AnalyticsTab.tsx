import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale, LinearScale, PointElement, LineElement, BarElement,
  ArcElement, Filler, Tooltip, Legend,
} from 'chart.js';
import { Line, Bar, Doughnut } from 'react-chartjs-2';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, BarElement, ArcElement, Filler, Tooltip, Legend);

interface Props {
  analytics: { totalUsers: number; activeUsers: number; totalMrr: number; churnRate: number };
}

const ORANGE = '#F5970A';
const ORANGE_FADE = 'rgba(245,151,10,0.18)';
const SURFACE = '#2d2d2d';

// ─── Mock Chart Data ──────────────────────────────────────────────────────────

function generateDays(n: number) {
  return Array.from({ length: n }, (_, i) => {
    const d = new Date('2025-12-01');
    d.setDate(d.getDate() + i);
    return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
  });
}

const signupLabels = generateDays(90);
const signupData = signupLabels.map(() => Math.floor(Math.random() * 60 + 10));

const retentionData = {
  labels: ['Week 1', 'Week 2', 'Week 3', 'Week 4', 'Week 5', 'Week 6'],
  datasets: [
    { label: 'Cohort Jan', data: [100, 92, 87, 82, 78, 74], backgroundColor: ORANGE, borderRadius: 4 },
    { label: 'Cohort Feb', data: [100, 89, 83, 78, 73, 70], backgroundColor: '#3b82f6', borderRadius: 4 },
    { label: 'Cohort Mar', data: [100, 94, 89, 85, 81, 77], backgroundColor: '#22c55e', borderRadius: 4 },
  ],
};

const mrrLabels = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const mrrActual = [5000, 8500, 12000, 16800, 21000, 28456, null, null, null, null, null, null];
const mrrProjected = [5000, 8500, 12000, 16800, 21000, 28456, 34000, 40000, 47000, 55000, 63000, 72000];

const industryData = {
  labels: ['Veterinary', 'Equine', 'Dog Training', 'Wildlife', 'Farm', 'Breeding', 'Other'],
  datasets: [{
    data: [345, 278, 201, 156, 134, 89, 31],
    backgroundColor: [ORANGE, '#3b82f6', '#22c55e', '#a855f7', '#ec4899', '#14b8a6', '#6b7280'],
    borderWidth: 0,
  }],
};

const CHART_OPTS = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: { legend: { labels: { color: '#b0b0b0', font: { family: 'Poppins', size: 11 } } } },
  scales: {
    x: { ticks: { color: '#666', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
    y: { ticks: { color: '#666', font: { size: 10 } }, grid: { color: 'rgba(255,255,255,0.04)' } },
  },
};

export default function AnalyticsTab({ analytics }: Props) {
  const kpis = [
    { label: 'Total Users', value: analytics.totalUsers.toLocaleString(), delta: '+8% diese Woche', up: true },
    { label: 'Active Users (30d)', value: analytics.activeUsers.toLocaleString(), delta: `${Math.round(analytics.activeUsers / analytics.totalUsers * 100)}% Aktivitätsrate`, up: true },
    { label: 'Total MRR', value: `€${analytics.totalMrr.toLocaleString()}`, delta: '+12% diesen Monat', up: true },
    { label: 'Churn Rate', value: `${analytics.churnRate}%`, delta: '↓ improving', up: true },
  ];

  return (
    <div className="analytics-tab">
      {/* KPI Cards */}
      <div className="kpi-grid">
        {kpis.map(kpi => (
          <div key={kpi.label} className="kpi-card">
            <div className="kpi-card__label">{kpi.label}</div>
            <div className="kpi-card__value">{kpi.value}</div>
            <div className={`kpi-card__delta ${kpi.up ? 'up' : 'down'}`}>{kpi.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts Grid */}
      <div className="charts-grid">
        <div className="chart-card chart-card--wide">
          <h3 className="chart-card__title">Signup Trend (90 days)</h3>
          <div className="chart-card__canvas">
            <Line
              data={{
                labels: signupLabels,
                datasets: [{
                  label: 'Signups',
                  data: signupData,
                  borderColor: ORANGE,
                  backgroundColor: ORANGE_FADE,
                  fill: true,
                  tension: 0.4,
                  pointRadius: 0,
                  pointHoverRadius: 4,
                }],
              }}
              options={{ ...CHART_OPTS, plugins: { ...CHART_OPTS.plugins, legend: { display: false } } } as object}
            />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card__title">Retention Cohorts</h3>
          <div className="chart-card__canvas">
            <Bar data={retentionData} options={CHART_OPTS as object} />
          </div>
        </div>

        <div className="chart-card">
          <h3 className="chart-card__title">MRR Progression (12 months)</h3>
          <div className="chart-card__canvas">
            <Line
              data={{
                labels: mrrLabels,
                datasets: [
                  { label: 'Actual MRR', data: mrrActual, borderColor: ORANGE, backgroundColor: ORANGE_FADE, fill: true, tension: 0.4, pointRadius: 3 },
                  { label: 'Projected', data: mrrProjected, borderColor: '#3b82f6', borderDash: [5, 5], fill: false, tension: 0.4, pointRadius: 2 },
                ],
              }}
              options={CHART_OPTS as object}
            />
          </div>
        </div>

        <div className="chart-card chart-card--doughnut">
          <h3 className="chart-card__title">Users per Industry</h3>
          <div className="chart-card__canvas">
            <Doughnut
              data={industryData}
              options={{
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                  legend: { position: 'right', labels: { color: '#b0b0b0', font: { family: 'Poppins', size: 11 }, padding: 12 } },
                },
                cutout: '65%',
              } as object}
            />
          </div>
        </div>
      </div>

      {/* Export row */}
      <div className="analytics-exports">
        <button className="btn btn--secondary" onClick={() => alert('CSV export coming soon')}>⬇ Download CSV</button>
        <button className="btn btn--secondary" onClick={() => window.print()}>🖨 Download PDF</button>
      </div>
    </div>
  );
}
