import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const execAsync = promisify(exec);

async function gitCommit(msg: string) {
  try { await execAsync(`git add . && git commit -m "${msg.replace(/"/g, '\\"')}"`, { cwd: process.cwd() }); } catch { /* no-op */ }
}
function audit(action: string, detail: string) {
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), action, detail }) + '\n';
  const p = path.join(process.cwd(), 'data', 'audit.log');
  fs.mkdirSync(path.dirname(p), { recursive: true });
  fs.appendFileSync(p, entry);
}

// ─── Subscriptions ───────────────────────────────────────────────────────────

router.get('/subscription/:customerId', (req, res) => {
  res.json({ note: 'Connect Stripe API', customerId: req.params.customerId });
});

router.post('/upgrade', async (req, res) => {
  const { planId } = req.body;
  if (!planId) return res.status(400).json({ error: 'planId required' });
  audit('SUBSCRIPTION_UPGRADE', `Upgraded to ${planId}`);
  await gitCommit(`Billing: upgraded to ${planId}`);
  res.json({ success: true, planId, effectiveAt: new Date().toISOString() });
});

router.post('/downgrade', async (req, res) => {
  const { planId } = req.body;
  audit('SUBSCRIPTION_DOWNGRADE', `Downgraded to ${planId}`);
  await gitCommit(`Billing: downgraded to ${planId}`);
  res.json({ success: true, planId, effectiveAt: 'next_billing_cycle' });
});

router.post('/cancel', async (req, res) => {
  const { reason, feedback } = req.body;
  audit('SUBSCRIPTION_CANCEL', `Reason: ${reason}. Feedback: ${feedback}`);
  await gitCommit('Billing: subscription cancelled');
  res.json({ success: true, cancelledAt: new Date().toISOString() });
});

router.post('/pause',  async (req, res) => { audit('SUBSCRIPTION_PAUSE', 'Paused'); await gitCommit('Billing: subscription paused'); res.json({ success: true }); });
router.post('/resume', async (req, res) => { audit('SUBSCRIPTION_RESUME', 'Resumed'); res.json({ success: true }); });

// ─── Invoices ─────────────────────────────────────────────────────────────────

router.get('/invoices/:customerId', (req, res) => {
  const limit = parseInt(req.query.limit as string) || 20;
  res.json({ invoices: [], total: 0, limit, note: 'Connect Stripe for real invoices' });
});

router.get('/invoices/:invoiceId/pdf', (req, res) => {
  const content = `MOCK INVOICE\nID: ${req.params.invoiceId}\nGenerated: ${new Date().toISOString()}`;
  res.setHeader('Content-Type', 'application/pdf');
  res.setHeader('Content-Disposition', `attachment; filename="invoice-${req.params.invoiceId}.pdf"`);
  res.send(Buffer.from(content));
});

// ─── Payment Methods ──────────────────────────────────────────────────────────

router.post('/payment-methods', async (req, res) => {
  const { token } = req.body;
  if (!token) return res.status(400).json({ error: 'token required' });
  audit('PAYMENT_METHOD_ADD', `Token: ${token.substring(0, 8)}...`);
  res.json({ success: true, methodId: `pm_${Date.now()}`, note: 'Connect Stripe for real card processing' });
});

router.post('/payment-methods/:id/default', (req, res) => {
  audit('PAYMENT_METHOD_DEFAULT', `Set ${req.params.id} as default`);
  res.json({ success: true });
});

router.delete('/payment-methods/:id', (req, res) => {
  audit('PAYMENT_METHOD_DELETE', `Deleted ${req.params.id}`);
  res.json({ success: true });
});

// ─── Billing Address ──────────────────────────────────────────────────────────

router.put('/address', async (req, res) => {
  const address = req.body;
  audit('BILLING_ADDRESS_UPDATE', JSON.stringify(address));
  await gitCommit('Billing: billing address updated');
  res.json({ success: true });
});

// ─── Revenue Metrics ──────────────────────────────────────────────────────────

router.get('/metrics/:period', (req, res) => {
  res.json({
    period: req.params.period,
    mrr: 32456, arr: 389472, cac: 45.23, ltv: 1456.78,
    churnRate: 2.3, nrr: 115,
    activeCustomers: 1234, newCustomers: 89, churnedCustomers: 28,
    note: 'Connect database for real metrics',
  });
});

router.get('/mrr-trend', (req, res) => {
  const months = parseInt(req.query.months as string) || 12;
  const data = Array.from({ length: months }, (_, i) => ({ month: i + 1, mrr: 25000 + i * 700 }));
  res.json({ data });
});

router.get('/churn-analysis', (req, res) => {
  res.json({ churnRate: 2.3, reasons: { 'Too expensive': 35, 'Not using': 28, 'Alternative': 22, 'Missing features': 10, Other: 5 } });
});

// ─── Cohort + Forecasts ───────────────────────────────────────────────────────

router.get('/cohorts', (req, res) => { res.json({ cohorts: [], note: 'Connect analytics DB' }); });
router.get('/forecasts', (req, res) => {
  const scenario = req.query.scenario || 'base';
  const multiplier = scenario === 'conservative' ? 0.85 : scenario === 'optimistic' ? 1.18 : 1;
  const data = Array.from({ length: 12 }, (_, i) => ({ month: i + 1, mrr: Math.round((32456 + i * 1200) * (multiplier as number)) }));
  res.json({ scenario, data });
});
router.get('/churn-risk', (req, res) => { res.json({ highRisk: [], note: 'Connect ML pipeline for real scores' }); });

// ─── Stripe Webhook ───────────────────────────────────────────────────────────

router.post('/webhook/stripe', express.raw({ type: 'application/json' }), async (req, res) => {
  let event: Record<string, unknown>;
  try { event = JSON.parse(req.body.toString()); } catch { return res.status(400).send('Invalid JSON'); }

  audit('STRIPE_WEBHOOK', `Event: ${event.type}`);

  switch (event.type) {
    case 'charge.succeeded':           audit('STRIPE_CHARGE', 'Charge succeeded'); break;
    case 'charge.failed':              audit('STRIPE_CHARGE', 'Charge failed'); break;
    case 'customer.subscription.updated':
      await gitCommit(`Webhook: Stripe subscription.updated`); break;
    case 'customer.subscription.deleted':
      await gitCommit(`Webhook: Stripe subscription.deleted`); break;
  }
  res.json({ received: true });
});

export default router;
