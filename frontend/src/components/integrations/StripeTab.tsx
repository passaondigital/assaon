import React from 'react';
import IntegrationCard from './IntegrationCard';
import type { IntegrationConnection } from '../../hooks/useIntegrations';

interface Props {
  connection: IntegrationConnection;
  onSync: () => void;
  syncing: boolean;
}

const MOCK_INVOICES = [
  { date: '2026-03-28', amount: '€234.00', status: 'paid', customer: 'emma.schmidt@example.com' },
  { date: '2026-03-27', amount: '€89.00',  status: 'paid', customer: 'luca.bauer@example.com' },
  { date: '2026-03-26', amount: '€450.00', status: 'pending', customer: 'sophie.mueller@example.com' },
  { date: '2026-03-25', amount: '€120.00', status: 'paid', customer: 'noah.wagner@example.com' },
  { date: '2026-03-24', amount: '€67.00',  status: 'overdue', customer: 'mia.fischer@example.com' },
];

const MOCK_DEPLOYMENTS = [
  { date: '2026-03-28 14:50', branch: 'main', status: 'success', duration: '2m 34s' },
  { date: '2026-03-28 10:12', branch: 'develop', status: 'success', duration: '3m 01s' },
  { date: '2026-03-27 16:30', branch: 'main', status: 'failed', duration: '1m 12s' },
];

export default function StripeTab({ connection, onSync, syncing }: Props) {
  return (
    <div className="int-tab-content">
      <IntegrationCard connection={connection} onSync={onSync} syncing={syncing}>
        <div className="stripe-metrics">
          <div className="stripe-metric">
            <span className="stripe-metric__label">Active Subscriptions</span>
            <span className="stripe-metric__value">1,234</span>
            <span className="stripe-metric__delta up">+12% growth</span>
          </div>
          <div className="stripe-metric">
            <span className="stripe-metric__label">MRR from Stripe</span>
            <span className="stripe-metric__value green">€32,456</span>
            <span className="stripe-metric__delta up">+8% this month</span>
          </div>
          <div className="stripe-metric">
            <span className="stripe-metric__label">Last Payout</span>
            <span className="stripe-metric__value">€5,234</span>
            <span className="stripe-metric__delta">2026-03-28</span>
          </div>
        </div>
      </IntegrationCard>

      <div className="int-section">
        <div className="int-section__header">
          <h3>Recent Invoices</h3>
          <div className="int-section__actions">
            <a href="https://dashboard.stripe.com" target="_blank" rel="noreferrer" className="btn btn--secondary btn--sm">Open Stripe Dashboard ↗</a>
          </div>
        </div>
        <div className="int-table-wrap">
          <table className="int-table">
            <thead><tr><th>Date</th><th>Amount</th><th>Status</th><th>Customer</th><th>Action</th></tr></thead>
            <tbody>
              {MOCK_INVOICES.map((inv, i) => (
                <tr key={i}>
                  <td>{inv.date}</td>
                  <td className="int-table__mono">{inv.amount}</td>
                  <td><span className={`int-badge int-badge--${inv.status === 'paid' ? 'ok' : inv.status === 'pending' ? 'warn' : 'err'}`}>{inv.status}</span></td>
                  <td className="int-table__dim">{inv.customer}</td>
                  <td><button className="action-btn-sm">View PDF</button></td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      <div className="int-section">
        <div className="int-section__header"><h3>Recent Deployments</h3></div>
        <div className="int-table-wrap">
          <table className="int-table">
            <thead><tr><th>Timestamp</th><th>Branch</th><th>Status</th><th>Duration</th></tr></thead>
            <tbody>
              {MOCK_DEPLOYMENTS.map((d, i) => (
                <tr key={i}>
                  <td className="int-table__dim">{d.date}</td>
                  <td><code className="int-code">{d.branch}</code></td>
                  <td><span className={`int-badge int-badge--${d.status === 'success' ? 'ok' : 'err'}`}>{d.status === 'success' ? '✓ Success' : '✗ Failed'}</span></td>
                  <td className="int-table__dim">{d.duration}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
