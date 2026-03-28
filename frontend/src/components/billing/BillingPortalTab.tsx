import React, { useState } from 'react';
import type { Subscription, Invoice, PaymentMethod, UsageMeter } from '../../hooks/useBilling';
import SubscriptionCard from './SubscriptionCard';
import PaymentMethodCard from './PaymentMethodCard';
import InvoiceHistory from './InvoiceHistory';

interface Props {
  subscription: Subscription;
  plans: Record<string, { name: string; mrr: number; features: string[] }>;
  invoices: Invoice[];
  allInvoices: Invoice[];
  invoicePage: number;
  totalInvoicePages: number;
  pageSize: number;
  onPageChange: (p: number) => void;
  paymentMethods: PaymentMethod[];
  usageMeters: UsageMeter[];
  onUpgrade: (planId: 'starter' | 'professional' | 'enterprise' | 'custom') => void;
  onCancel: () => void;
  onPause: () => void;
  onSetDefault: (id: string) => void;
  onRemovePayment: (id: string) => void;
}

export default function BillingPortalTab(props: Props) {
  const [showAddress, setShowAddress] = useState(false);
  const [address, setAddress] = useState({ name: 'Max Mustermann', company: 'Assaon GmbH', line1: 'Musterstraße 1', city: 'Berlin', zip: '10115', country: 'DE', taxId: 'DE123456789' });

  const projectedBill = props.subscription.mrr + props.usageMeters.reduce((s, m) => s + m.overageCharges, 0);

  return (
    <div className="billing-portal">
      <SubscriptionCard
        subscription={props.subscription}
        plans={props.plans}
        onUpgrade={props.onUpgrade}
        onCancel={props.onCancel}
        onPause={props.onPause}
      />

      {/* Usage Summary */}
      <div className="bl-section">
        <div className="bl-section__header"><h3>Current Usage</h3><span className="bl-count">Resets {new Date(props.subscription.currentPeriodEnd).toLocaleDateString('de-DE')}</span></div>
        <div className="usage-meters-grid">
          {props.usageMeters.map(m => {
            const pct = Math.min(100, (m.currentUsage / m.includedAmount) * 100);
            return (
              <div key={m.id} className="usage-meter-card">
                <div className="usage-meter-card__header">
                  <span className="usage-meter-card__name">{m.name}</span>
                  <span className="usage-meter-card__overage">{m.overageCharges > 0 ? `+€${m.overageCharges.toFixed(2)} overage` : 'No overage'}</span>
                </div>
                <div className="usage-meter-card__values">
                  <span>{typeof m.currentUsage === 'number' && m.currentUsage < 10 ? `${m.currentUsage} GB` : m.currentUsage.toLocaleString()}</span>
                  <span className="usage-meter-card__limit">/ {m.includedAmount.toLocaleString()} {m.unit}</span>
                </div>
                <div className="usage-bar">
                  <div className="usage-bar__fill" style={{ width: `${pct}%`, background: pct > 90 ? '#ef4444' : pct > 75 ? '#f59e0b' : '#22c55e' }} />
                </div>
                <div className="usage-meter-card__meta">€{m.unitPrice} per {m.unit} · {pct.toFixed(1)}% used</div>
              </div>
            );
          })}
        </div>
        <div className="usage-projected">
          <span>Projected Bill: <strong>€{projectedBill.toFixed(2)}</strong></span>
          <span className="bl-count">+ €0.00 overages = €{projectedBill.toFixed(2)} total</span>
        </div>
      </div>

      <PaymentMethodCard methods={props.paymentMethods} onSetDefault={props.onSetDefault} onRemove={props.onRemovePayment} />

      {/* Billing Address */}
      <div className="bl-section">
        <div className="bl-section__header">
          <h3>Billing Address</h3>
          <button className="btn btn--secondary btn--sm" onClick={() => setShowAddress(v => !v)}>Edit</button>
        </div>
        {!showAddress ? (
          <div className="bl-address-display">
            <p>{address.name}</p>
            {address.company && <p>{address.company}</p>}
            <p>{address.line1}</p>
            <p>{address.zip} {address.city}</p>
            <p>{address.country}</p>
            {address.taxId && <p className="bl-table__dim">Tax ID: {address.taxId}</p>}
          </div>
        ) : (
          <div className="bl-address-form">
            {(['name','company','line1','city','zip','country','taxId'] as const).map(field => (
              <div key={field} className="form-row">
                <label>{field === 'line1' ? 'Address' : field === 'taxId' ? 'Tax ID (optional)' : field.charAt(0).toUpperCase() + field.slice(1)}</label>
                <input className="bl-input" value={address[field]} onChange={e => setAddress(a => ({ ...a, [field]: e.target.value }))} />
              </div>
            ))}
            <div className="form-actions">
              <button className="btn btn--secondary btn--sm" onClick={() => setShowAddress(false)}>Cancel</button>
              <button className="btn btn--primary btn--sm" onClick={() => { setShowAddress(false); alert('Address saved.'); }}>Save Address</button>
            </div>
          </div>
        )}
      </div>

      <InvoiceHistory
        invoices={props.invoices}
        allInvoices={props.allInvoices}
        page={props.invoicePage}
        totalPages={props.totalInvoicePages}
        pageSize={props.pageSize}
        onPageChange={props.onPageChange}
      />
    </div>
  );
}
