import React, { useState } from 'react';
import type { PaymentMethod } from '../../hooks/useBilling';

interface Props {
  methods: PaymentMethod[];
  onSetDefault: (id: string) => void;
  onRemove: (id: string) => void;
}

const BRAND_ICONS: Record<string, string> = { Visa: '💳', Mastercard: '💳', Amex: '💳' };

export default function PaymentMethodCard({ methods, onSetDefault, onRemove }: Props) {
  const [showAdd, setShowAdd] = useState(false);
  const [form, setForm] = useState({ number: '', expiry: '', cvc: '', name: '', isDefault: false });

  function handleAdd() {
    if (!form.number || !form.expiry || !form.cvc) { alert('All card fields required'); return; }
    alert('[Mock] Card tokenized. Connect Stripe.js for real card processing.');
    setShowAdd(false);
    setForm({ number: '', expiry: '', cvc: '', name: '', isDefault: false });
  }

  return (
    <div className="bl-section">
      <div className="bl-section__header">
        <h3>Payment Methods</h3>
        <button className="btn btn--secondary btn--sm" onClick={() => setShowAdd(v => !v)}>+ Add Card</button>
      </div>

      <div className="pm-list">
        {methods.map(m => (
          <div key={m.id} className={`pm-card ${m.isDefault ? 'default' : ''}`}>
            <span className="pm-card__icon">{BRAND_ICONS[m.brand] || '💳'}</span>
            <div className="pm-card__info">
              <span className="pm-card__brand">{m.brand}</span>
              <span className="pm-card__num">•••• {m.last4}</span>
              <span className="pm-card__expiry">Exp: {String(m.expiryMonth).padStart(2, '0')}/{m.expiryYear}</span>
            </div>
            {m.isDefault && <span className="pm-card__default-badge">✓ Default</span>}
            <div className="pm-card__actions">
              {!m.isDefault && <button className="action-btn-sm" onClick={() => onSetDefault(m.id)}>Set Default</button>}
              <button className="action-btn-sm action-btn-sm--danger" onClick={() => { if (confirm('Remove this card?')) onRemove(m.id); }}>Remove</button>
            </div>
          </div>
        ))}
      </div>

      {showAdd && (
        <div className="pm-add-form">
          <h4>Add Payment Method</h4>
          <div className="form-row">
            <label>Card Number</label>
            <input className="bl-input" placeholder="1234 5678 9012 3456" value={form.number} onChange={e => setForm(f => ({ ...f, number: e.target.value }))} maxLength={19} />
          </div>
          <div className="form-row-2">
            <div className="form-row">
              <label>Expiry</label>
              <input className="bl-input" placeholder="MM/YY" value={form.expiry} onChange={e => setForm(f => ({ ...f, expiry: e.target.value }))} maxLength={5} />
            </div>
            <div className="form-row">
              <label>CVC</label>
              <input className="bl-input" placeholder="123" value={form.cvc} onChange={e => setForm(f => ({ ...f, cvc: e.target.value }))} maxLength={4} />
            </div>
          </div>
          <div className="form-row">
            <label>Cardholder Name</label>
            <input className="bl-input" placeholder="Full name on card" value={form.name} onChange={e => setForm(f => ({ ...f, name: e.target.value }))} />
          </div>
          <div className="form-row form-row--inline">
            <label>Save as default</label>
            <button className={`toggle-btn ${form.isDefault ? 'on' : ''}`} onClick={() => setForm(f => ({ ...f, isDefault: !f.isDefault }))}>
              <span className="toggle-btn__knob" />
            </button>
          </div>
          <div className="form-actions">
            <button className="btn btn--secondary btn--sm" onClick={() => setShowAdd(false)}>Cancel</button>
            <button className="btn btn--primary btn--sm" onClick={handleAdd}>Add Payment Method</button>
          </div>
        </div>
      )}
    </div>
  );
}
