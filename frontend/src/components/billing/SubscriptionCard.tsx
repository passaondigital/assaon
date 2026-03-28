import React, { useState } from 'react';
import type { Subscription } from '../../hooks/useBilling';

interface Props {
  subscription: Subscription;
  plans: Record<string, { name: string; mrr: number; features: string[] }>;
  onUpgrade: (planId: 'starter' | 'professional' | 'enterprise' | 'custom') => void;
  onCancel: () => void;
  onPause: () => void;
}

const CANCEL_REASONS = ['Too expensive', 'Not using it enough', 'Found a better alternative', 'Missing features', 'Other'];

export default function SubscriptionCard({ subscription, plans, onUpgrade, onCancel, onPause }: Props) {
  const [showUpgrade, setShowUpgrade] = useState(false);
  const [showCancel, setShowCancel] = useState(false);
  const [cancelReason, setCancelReason] = useState('');
  const [cancelFeedback, setCancelFeedback] = useState('');

  const currentPlan = plans[subscription.planName];
  const periodEnd = new Date(subscription.currentPeriodEnd).toLocaleDateString('de-DE');

  const planOrder = ['starter', 'professional', 'enterprise', 'custom'];
  const currentIdx = planOrder.indexOf(subscription.planName);

  return (
    <div className="bl-section">
      <div className="bl-section__header"><h3>Current Subscription</h3></div>

      <div className="sub-card">
        <div className="sub-card__header">
          <div>
            <h2 className="sub-card__plan">{currentPlan.name}</h2>
            <p className="sub-card__price">€{currentPlan.mrr}<span>/month</span></p>
          </div>
          <span className={`bl-badge bl-badge--${subscription.status === 'active' ? 'ok' : subscription.status === 'paused' ? 'warn' : 'err'}`}>
            {subscription.status === 'active' ? '● Active' : subscription.status === 'paused' ? '⏸ Paused' : '✕ Cancelled'}
          </span>
        </div>

        <p className="sub-card__period">
          {subscription.status === 'active' ? `Renews on ${periodEnd}` : `Cancelled — access until ${periodEnd}`}
        </p>

        <ul className="sub-card__features">
          {currentPlan.features.map(f => <li key={f}><span className="check">✓</span>{f}</li>)}
        </ul>

        <div className="sub-card__actions">
          {subscription.status === 'active' && <>
            <button className="btn btn--primary btn--sm" onClick={() => setShowUpgrade(true)}>⬆️ Change Plan</button>
            <button className="btn btn--secondary btn--sm" onClick={onPause}>⏸ Pause</button>
            <button className="btn btn--danger btn--sm" onClick={() => setShowCancel(true)}>✕ Cancel</button>
          </>}
          {subscription.status === 'paused' && (
            <button className="btn btn--primary btn--sm" onClick={onPause}>▶ Resume</button>
          )}
        </div>
      </div>

      {/* Upgrade Modal */}
      {showUpgrade && (
        <div className="bl-modal-overlay" onClick={() => setShowUpgrade(false)}>
          <div className="bl-modal" onClick={e => e.stopPropagation()}>
            <div className="bl-modal__header">
              <h3>Change Plan</h3>
              <button className="bl-modal__close" onClick={() => setShowUpgrade(false)}>✕</button>
            </div>
            <div className="bl-modal__body">
              <div className="plans-grid">
                {Object.entries(plans).map(([key, plan], idx) => (
                  <div key={key} className={`plan-option ${subscription.planName === key ? 'current' : ''}`}>
                    <div className="plan-option__header">
                      <span className="plan-option__name">{plan.name}</span>
                      <span className="plan-option__price">€{plan.mrr}/mo</span>
                    </div>
                    <ul className="plan-option__features">
                      {plan.features.slice(0, 3).map(f => <li key={f}>✓ {f}</li>)}
                    </ul>
                    {subscription.planName === key
                      ? <span className="plan-option__current">Current Plan</span>
                      : <button className="btn btn--primary btn--sm" onClick={() => { onUpgrade(key as 'starter' | 'professional' | 'enterprise' | 'custom'); setShowUpgrade(false); }}>
                          {idx > currentIdx ? 'Upgrade' : 'Downgrade'} to {plan.name}
                        </button>
                    }
                  </div>
                ))}
              </div>
              <p className="bl-modal__note">⚡ Changes take effect immediately. Proration will be applied to your next invoice.</p>
            </div>
          </div>
        </div>
      )}

      {/* Cancel Modal */}
      {showCancel && (
        <div className="bl-modal-overlay" onClick={() => setShowCancel(false)}>
          <div className="bl-modal" onClick={e => e.stopPropagation()}>
            <div className="bl-modal__header">
              <h3>Cancel Subscription</h3>
              <button className="bl-modal__close" onClick={() => setShowCancel(false)}>✕</button>
            </div>
            <div className="bl-modal__body">
              <p className="cancel-warning">We're sorry to see you go! You'll lose access to:</p>
              <ul className="cancel-loss">
                {currentPlan.features.map(f => <li key={f}>✗ {f}</li>)}
              </ul>
              <div className="form-row">
                <label>Why are you leaving?</label>
                <select className="bl-select" value={cancelReason} onChange={e => setCancelReason(e.target.value)}>
                  <option value="">Select a reason...</option>
                  {CANCEL_REASONS.map(r => <option key={r} value={r}>{r}</option>)}
                </select>
              </div>
              <div className="form-row">
                <label>Any additional feedback?</label>
                <textarea className="bl-textarea" placeholder="Help us improve..." value={cancelFeedback} onChange={e => setCancelFeedback(e.target.value)} rows={3} />
              </div>
              <div className="cancel-pause-offer">
                <span>💡 Instead of cancelling, you can <strong>pause</strong> your subscription for up to 3 months.</span>
                <button className="btn btn--secondary btn--sm" onClick={() => { onPause(); setShowCancel(false); }}>Pause Instead</button>
              </div>
              <div className="form-actions">
                <button className="btn btn--secondary btn--sm" onClick={() => setShowCancel(false)}>Keep Subscription</button>
                <button className="btn btn--danger btn--sm" onClick={() => { onCancel(); setShowCancel(false); }}>Confirm Cancel</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
