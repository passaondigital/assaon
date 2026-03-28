import { useEffect, useRef } from 'react';
import { Chart, registerables } from 'chart.js';

Chart.register(...registerables);

// Dummy data
const signupData = [
  10, 15, 12, 18, 22, 19, 25, 30, 28, 35,
  32, 40, 38, 45, 42, 50, 48, 55, 52, 60,
  58, 62, 65, 70, 68, 72, 75, 80, 78, 85,
];
const DAYS = Array.from({ length: 30 }, (_, i) => `${i + 1} Mar`);

const modelUsage = { Claude: 35, Mistral: 25, Groq: 30, Ollama: 10 };
const industryData = {
  Veterinary: 245, Equine: 178, 'Dog Training': 156,
  Wildlife: 89, Farm: 67, Breeding: 45,
};

const ORANGE = '#F5970A';
const CHART_COLORS = ['#F5970A', '#6366f1', '#22c55e', '#e84393'];
const INDUSTRY_COLORS = ['#F5970A', '#6366f1', '#22c55e', '#e84393', '#f59e0b', '#06b6d4'];

interface KpiCard {
  icon: string;
  label: string;
  value: string;
  delta: string;
  neutral?: boolean;
}

const KPI_CARDS: KpiCard[] = [
  { icon: '👥', label: 'Total Users',       value: '1,234', delta: '+12% diese Woche'  },
  { icon: '🚀', label: 'Active Projects',   value: '567',   delta: '+8% diese Woche'   },
  { icon: '💶', label: 'MRR',               value: '€2,340',delta: '+15% diesen Monat' },
  { icon: '✅', label: 'Uptime',            value: '99.9%', delta: '✓ Reliable', neutral: true },
];

function useChart(
  ref: React.RefObject<HTMLCanvasElement | null>,
  factory: (ctx: CanvasRenderingContext2D) => Chart,
) {
  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    const ctx = canvas.getContext('2d');
    if (!ctx) return;
    const chart = factory(ctx);
    return () => chart.destroy();
  }, []);
}

export default function AdminDashboard() {
  const signupRef = useRef<HTMLCanvasElement>(null);
  const modelRef  = useRef<HTMLCanvasElement>(null);
  const industryRef = useRef<HTMLCanvasElement>(null);

  const gridOpts = {
    color: 'rgba(255,255,255,0.06)',
  };
  const textOpts = { color: '#b0b0b0', font: { family: 'Poppins', size: 11 } };

  useChart(signupRef, (ctx) =>
    new Chart(ctx, {
      type: 'line',
      data: {
        labels: DAYS,
        datasets: [{
          label: 'New Users',
          data: signupData,
          borderColor: ORANGE,
          backgroundColor: 'rgba(245,151,10,0.08)',
          borderWidth: 2,
          pointRadius: 0,
          tension: 0.4,
          fill: true,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: { ...textOpts, maxTicksLimit: 6 }, grid: gridOpts },
          y: { ticks: textOpts, grid: gridOpts },
        },
      },
    }),
  );

  useChart(modelRef, (ctx) =>
    new Chart(ctx, {
      type: 'doughnut',
      data: {
        labels: Object.keys(modelUsage),
        datasets: [{
          data: Object.values(modelUsage),
          backgroundColor: CHART_COLORS,
          borderColor: '#2d2d2d',
          borderWidth: 2,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: {
          legend: {
            position: 'bottom',
            labels: { color: '#b0b0b0', font: { family: 'Poppins', size: 11 }, padding: 12 },
          },
        },
      },
    }),
  );

  useChart(industryRef, (ctx) =>
    new Chart(ctx, {
      type: 'bar',
      data: {
        labels: Object.keys(industryData),
        datasets: [{
          label: 'Projects',
          data: Object.values(industryData),
          backgroundColor: INDUSTRY_COLORS,
          borderRadius: 5,
        }],
      },
      options: {
        responsive: true,
        maintainAspectRatio: true,
        plugins: { legend: { display: false } },
        scales: {
          x: { ticks: textOpts, grid: { display: false } },
          y: { ticks: textOpts, grid: gridOpts },
        },
      },
    }),
  );

  return (
    <div>
      <h2 className="admin-section-title">
        <span>Dashboard</span> — Overview
      </h2>

      {/* KPI Cards */}
      <div className="kpi-grid">
        {KPI_CARDS.map((card) => (
          <div className="kpi-card" key={card.label}>
            <div className="kpi-card__icon">{card.icon}</div>
            <div className="kpi-card__label">{card.label}</div>
            <div className="kpi-card__value">{card.value}</div>
            <div className={`kpi-card__delta${card.neutral ? ' neutral' : ''}`}>{card.delta}</div>
          </div>
        ))}
      </div>

      {/* Charts */}
      <div className="charts-grid">
        <div className="chart-card">
          <div className="chart-card__title">📈 Signups (Last 30 Days)</div>
          <canvas ref={signupRef} className="chart-card__canvas" />
        </div>

        <div className="chart-card">
          <div className="chart-card__title">🤖 AI Model Usage</div>
          <canvas ref={modelRef} className="chart-card__canvas" />
        </div>

        <div className="chart-card">
          <div className="chart-card__title">🏭 Projects per Industry</div>
          <canvas ref={industryRef} className="chart-card__canvas" />
        </div>

        <div className="chart-card">
          <div className="chart-card__title">📊 Churn vs. Retention</div>
          <div style={{ padding: '0.5rem 0' }}>
            <div className="retention-bar">
              <div className="retention-bar__header">
                <span className="label">Retention Rate</span>
                <span className="value">94%</span>
              </div>
              <div className="retention-bar__track">
                <div className="retention-bar__fill" style={{ width: '94%' }} />
              </div>
              <div className="retention-bar__sub">94 of 100 users retained</div>
            </div>

            <div className="retention-bar" style={{ marginTop: '1.5rem' }}>
              <div className="retention-bar__header">
                <span className="label">Churn Rate</span>
                <span className="value" style={{ color: '#f87171' }}>6%</span>
              </div>
              <div className="retention-bar__track">
                <div
                  className="retention-bar__fill"
                  style={{ width: '6%', background: 'linear-gradient(90deg, #f87171, #ef4444)' }}
                />
              </div>
              <div className="retention-bar__sub">6 churned users this month</div>
            </div>

            <div
              style={{
                marginTop: '1.5rem',
                display: 'grid',
                gridTemplateColumns: '1fr 1fr',
                gap: '1rem',
              }}
            >
              {[
                { label: 'Avg. Session', value: '18 min' },
                { label: 'NPS Score',    value: '72' },
                { label: 'DAU',          value: '342' },
                { label: 'MAU',          value: '1,234' },
              ].map((s) => (
                <div key={s.label} style={{ textAlign: 'center' }}>
                  <div style={{ fontSize: '1.2rem', fontWeight: 700, color: '#fff' }}>{s.value}</div>
                  <div style={{ fontSize: '0.7rem', color: '#b0b0b0', marginTop: 2 }}>{s.label}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
