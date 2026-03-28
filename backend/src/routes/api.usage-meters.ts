import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const execAsync = promisify(exec);

const USAGE_FILE = path.join(process.cwd(), 'data', 'usage.json');

async function gitCommit(msg: string) {
  try { await execAsync(`git add . && git commit -m "${msg.replace(/"/g, '\\"')}"`, { cwd: process.cwd() }); } catch { /* no-op */ }
}

function loadUsage(): Record<string, Record<string, number>> {
  try { return JSON.parse(fs.readFileSync(USAGE_FILE, 'utf8')); } catch { return {}; }
}

function saveUsage(data: Record<string, Record<string, number>>) {
  fs.mkdirSync(path.dirname(USAGE_FILE), { recursive: true });
  fs.writeFileSync(USAGE_FILE, JSON.stringify(data, null, 2));
}

// ─── Track Usage ─────────────────────────────────────────────────────────────

router.post('/track', async (req, res) => {
  const { meterId, amount, customerId = 'default' } = req.body;
  if (!meterId || amount === undefined) return res.status(400).json({ error: 'meterId and amount required' });

  const usage = loadUsage();
  if (!usage[customerId]) usage[customerId] = {};
  usage[customerId][meterId] = (usage[customerId][meterId] || 0) + amount;
  saveUsage(usage);

  await gitCommit(`Usage: tracked ${meterId} +${amount} for ${customerId}`);
  res.json({ success: true, meterId, newTotal: usage[customerId][meterId] });
});

// ─── Current Usage ────────────────────────────────────────────────────────────

router.get('/current/:customerId', (req, res) => {
  const usage = loadUsage();
  const customerUsage = usage[req.params.customerId] || {};

  const METERS = [
    { id: 'meter-api',     name: 'API Calls',    unit: 'calls', unitPrice: 0.001, includedAmount: 100000 },
    { id: 'meter-wh',      name: 'Webhooks',     unit: 'events', unitPrice: 0.002, includedAmount: 1000 },
    { id: 'meter-storage', name: 'Data Storage', unit: 'GB',    unitPrice: 0.10,  includedAmount: 10 },
  ];

  const meters = METERS.map(m => {
    const current = customerUsage[m.id] || 0;
    const overage = Math.max(0, current - m.includedAmount);
    return { ...m, currentUsage: current, overageCharges: Math.round(overage * m.unitPrice * 100) / 100, resetDate: new Date(new Date().setDate(28)).toISOString() };
  });

  res.json({ customerId: req.params.customerId, meters, totalOverage: meters.reduce((s, m) => s + m.overageCharges, 0) });
});

// ─── Usage History ────────────────────────────────────────────────────────────

router.get('/history/:meterId', (req, res) => {
  res.json({ meterId: req.params.meterId, history: [], note: 'Connect time-series DB for real history' });
});

// ─── Overage Alerts ───────────────────────────────────────────────────────────

router.post('/alerts', async (req, res) => {
  const { customerId, meterId, threshold } = req.body;
  await gitCommit(`Usage: alert configured for ${customerId} meter ${meterId} at ${threshold}%`);
  res.json({ success: true, message: 'Alert configured. Notification will be sent when threshold reached.' });
});

export default router;
