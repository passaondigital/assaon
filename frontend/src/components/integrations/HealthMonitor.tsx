import React from 'react';
import { Line } from 'react-chartjs-2';
import {
  Chart as ChartJS, CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend,
} from 'chart.js';
import type { IntegrationConnection } from '../../hooks/useIntegrations';

ChartJS.register(CategoryScale, LinearScale, PointElement, LineElement, Filler, Tooltip, Legend);

interface Props {
  connections: IntegrationConnection[];
  lastCheck: string;
}

const SERVICE_META: Record<string, { icon: string; label: string; color: string }> = {
  stripe:   { icon: '💳', label: 'Stripe',          color: '#635bff' },
  supabase: { icon: '⚡', label: 'Supabase',         color: '#3ecf8e' },
  github:   { icon: '🐙', label: 'GitHub',           color: '#e6edf3' },
  email:    { icon: '📧', label: 'Email Service',    color: '#F5970A' },
};

const EXTRA_SERVICES = [
  { id: 'webhooks', icon: '🪝', label: 'Webhook System',  uptime: 98.5, responseTime: 340, requests: 0, detail: '98.5% delivery', color: '#a855f7' },
  { id: 'api',      icon: '⚡', label: 'API Service',     uptime: 99.7, responseTime: 45,  requests: 45234, detail: '0.3% error rate', color: '#22d3ee' },
];

function generateUptimeSeries(base: number, days = 30) {
  return Array.from({ length: days }, () => Math.min(100, Math.max(base - 2, base - 0.5 + Math.random() * 1.2)));
}

const DAYS = Array.from({ length: 30 }, (_, i) => {
  const d = new Date('2026-03-01');
  d.setDate(d.getDate() + i);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
});

export default function HealthMonitor({ connections, lastCheck }: Props) {
  const allServices = [
    ...connections.map(c => {
      const meta = SERVICE_META[c.service];
      return { id: c.service, icon: meta.icon, label: meta.label, uptime: c.health.uptime, responseTime: c.health.avgResponseTime, errorCount: c.health.errorCount, color: meta.color, status: c.status };
    }),
    ...EXTRA_SERVICES.map(s => ({ ...s, errorCount: 0, status: 'connected' as const })),
  ];

  const chartData = {
    labels: DAYS,
    datasets: allServices.map(s => ({
      label: s.label,
      data: generateUptimeSeries(s.uptime),
      borderColor: s.color,
      backgroundColor: 'transparent',
      tension: 0.4,
      pointRadius: 0,
      borderWidth: 2,
    })),
  };

  const chartOpts = {
    responsive: true,
    maintainAspectRatio: false,
    plugins: { legend: { labels: { color: '#888', font: { family: 'Poppins', size: 11 }, padding: 16 } } },
    scales: {
      x: { ticks: { color: '#444', font: { size: 10 }, maxTicksLimit: 8 }, grid: { color: 'rgba(255,255,255,0.04)' } },
      y: { min: 95, max: 100, ticks: { color: '#444', font: { size: 10 }, callback: (v: unknown) => `${v}%` }, grid: { color: 'rgba(255,255,255,0.04)' } },
    },
  };

  return (
    <div className="health-tab">
      {/* Summary Banner */}
      <div className="health-banner">
        <div className="health-banner__dot" />
        <span className="health-banner__text">All Systems Operational</span>
        <span className="health-banner__check">Last check: {new Date(lastCheck).toLocaleTimeString('de-DE')}</span>
      </div>

      {/* Service Cards */}
      <div className="health-grid">
        {allServices.map(svc => (
          <div key={svc.id} className="health-card">
            <div className="health-card__header">
              <span className="health-card__icon">{svc.icon}</span>
              <div>
                <div className="health-card__title">{svc.label}</div>
                <div className="health-card__status">
                  <span className={`health-dot ${svc.status === 'connected' ? 'ok' : 'err'}`} />
                  {svc.status === 'connected' ? 'Operational' : 'Degraded'}
                </div>
              </div>
              <span className="health-card__uptime">{svc.uptime}%</span>
            </div>

            <div className="health-card__metrics">
              <div className="health-metric">
                <span className="health-metric__label">Avg Response</span>
                <span className="health-metric__val">{svc.responseTime}ms</span>
              </div>
              <div className="health-metric">
                <span className="health-metric__label">Errors</span>
                <span className={`health-metric__val ${svc.errorCount > 0 ? 'err-text' : 'ok-text'}`}>{svc.errorCount}</span>
              </div>
              <div className="health-metric">
                <span className="health-metric__label">Uptime bar</span>
                <div className="health-uptime-bar">
                  <div className="health-uptime-fill" style={{ width: `${svc.uptime}%`, background: svc.color }} />
                </div>
              </div>
            </div>

            <div className="health-card__meta">Last check: {new Date(lastCheck).toLocaleTimeString('de-DE')}</div>
          </div>
        ))}
      </div>

      {/* Uptime Chart */}
      <div className="health-chart-card">
        <h3 className="health-chart-title">30-Day Uptime Trend</h3>
        <div style={{ height: 240 }}>
          <Line data={chartData} options={chartOpts as object} />
        </div>
      </div>
    </div>
  );
}
