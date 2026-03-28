const BASE = '/api/billing';
const USAGE_BASE = '/api/usage';

// ─── Subscriptions ───────────────────────────────────────────────────────────

export async function getSubscription(customerId: string) {
  const res = await fetch(`${BASE}/subscription/${customerId}`);
  if (!res.ok) throw new Error('Failed to fetch subscription');
  return res.json();
}

export async function upgradeSubscription(planId: string) {
  const res = await fetch(`${BASE}/upgrade`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId }) });
  if (!res.ok) throw new Error('Upgrade failed');
  return res.json();
}

export async function downgradeSubscription(planId: string) {
  const res = await fetch(`${BASE}/downgrade`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ planId }) });
  if (!res.ok) throw new Error('Downgrade failed');
  return res.json();
}

export async function cancelSubscription(reason: string, feedback: string) {
  const res = await fetch(`${BASE}/cancel`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ reason, feedback }) });
  if (!res.ok) throw new Error('Cancel failed');
  return res.json();
}

export async function pauseSubscription() {
  const res = await fetch(`${BASE}/pause`, { method: 'POST' });
  if (!res.ok) throw new Error('Pause failed');
  return res.json();
}

export async function resumeSubscription() {
  const res = await fetch(`${BASE}/resume`, { method: 'POST' });
  if (!res.ok) throw new Error('Resume failed');
  return res.json();
}

// ─── Invoices ─────────────────────────────────────────────────────────────────

export async function getInvoices(customerId: string, limit = 20) {
  const res = await fetch(`${BASE}/invoices/${customerId}?limit=${limit}`);
  if (!res.ok) throw new Error('Failed to fetch invoices');
  return res.json();
}

export async function downloadInvoice(invoiceId: string) {
  const res = await fetch(`${BASE}/invoices/${invoiceId}/pdf`);
  if (!res.ok) throw new Error('Download failed');
  const blob = await res.blob();
  const url = URL.createObjectURL(blob);
  const a = document.createElement('a');
  a.href = url;
  a.download = `invoice-${invoiceId}.pdf`;
  a.click();
  URL.revokeObjectURL(url);
}

// ─── Payment Methods ──────────────────────────────────────────────────────────

export async function addPaymentMethod(cardToken: string) {
  const res = await fetch(`${BASE}/payment-methods`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ token: cardToken }) });
  if (!res.ok) throw new Error('Add payment method failed');
  return res.json();
}

export async function setDefaultPaymentMethod(methodId: string) {
  const res = await fetch(`${BASE}/payment-methods/${methodId}/default`, { method: 'POST' });
  if (!res.ok) throw new Error('Set default failed');
  return res.json();
}

export async function deletePaymentMethod(methodId: string) {
  const res = await fetch(`${BASE}/payment-methods/${methodId}`, { method: 'DELETE' });
  if (!res.ok) throw new Error('Delete payment method failed');
  return res.json();
}

// ─── Billing Address ──────────────────────────────────────────────────────────

export async function updateBillingAddress(address: Record<string, string>) {
  const res = await fetch(`${BASE}/address`, { method: 'PUT', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(address) });
  if (!res.ok) throw new Error('Update address failed');
  return res.json();
}

// ─── Revenue Analytics ────────────────────────────────────────────────────────

export async function getRevenueMetrics(period: '30d' | '90d' | '12m') {
  const res = await fetch(`${BASE}/metrics/${period}`);
  if (!res.ok) throw new Error('Failed to fetch metrics');
  return res.json();
}

export async function getMrrTrend(months: number) {
  const res = await fetch(`${BASE}/mrr-trend?months=${months}`);
  if (!res.ok) throw new Error('Failed to fetch MRR trend');
  return res.json();
}

export async function getChurnAnalysis() {
  const res = await fetch(`${BASE}/churn-analysis`);
  if (!res.ok) throw new Error('Failed to fetch churn analysis');
  return res.json();
}

// ─── Cohort Analysis ──────────────────────────────────────────────────────────

export async function getCohortData(startMonth: string, endMonth: string) {
  const res = await fetch(`${BASE}/cohorts?start=${startMonth}&end=${endMonth}`);
  if (!res.ok) throw new Error('Failed to fetch cohort data');
  return res.json();
}

// ─── Predictive Analytics ─────────────────────────────────────────────────────

export async function getRevenueForecasts(scenario: 'conservative' | 'base' | 'optimistic') {
  const res = await fetch(`${BASE}/forecasts?scenario=${scenario}`);
  if (!res.ok) throw new Error('Failed to fetch forecasts');
  return res.json();
}

export async function getChurnRiskSegments() {
  const res = await fetch(`${BASE}/churn-risk`);
  if (!res.ok) throw new Error('Failed to fetch churn risk');
  return res.json();
}

// ─── Usage Meters ─────────────────────────────────────────────────────────────

export async function getUsageMeters(customerId: string) {
  const res = await fetch(`${USAGE_BASE}/current/${customerId}`);
  if (!res.ok) throw new Error('Failed to fetch usage');
  return res.json();
}

export async function trackUsage(meterId: string, amount: number) {
  const res = await fetch(`${USAGE_BASE}/track`, { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify({ meterId, amount }) });
  if (!res.ok) throw new Error('Track usage failed');
  return res.json();
}

export async function getUsageHistory(meterId: string) {
  const res = await fetch(`${USAGE_BASE}/history/${meterId}`);
  if (!res.ok) throw new Error('Failed to fetch usage history');
  return res.json();
}
