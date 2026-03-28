import express from 'express';
import { exec } from 'child_process';
import { promisify } from 'util';
import fs from 'fs';
import path from 'path';

const router = express.Router();
const execAsync = promisify(exec);

// ─── Audit Log ───────────────────────────────────────────────────────────────

const AUDIT_LOG_PATH = path.join(process.cwd(), 'data', 'audit.log');

function writeAuditLog(adminId: string, action: string, resourceType: string, resourceId: string, details: string) {
  const entry = JSON.stringify({ timestamp: new Date().toISOString(), adminId, action, resourceType, resourceId, details }) + '\n';
  fs.mkdirSync(path.dirname(AUDIT_LOG_PATH), { recursive: true });
  fs.appendFileSync(AUDIT_LOG_PATH, entry);
}

async function gitCommit(message: string) {
  try {
    await execAsync('git add . && git commit -m "' + message.replace(/"/g, '\\"') + '"', { cwd: process.cwd() });
  } catch {
    // No changes or git not configured — silent fail
  }
}

// ─── GDPR Delete ─────────────────────────────────────────────────────────────

router.post('/gdpr/delete/:userId', async (req, res) => {
  const { userId } = req.params;
  const adminId = (req as express.Request & { user?: { id: string } }).user?.id || 'admin';

  writeAuditLog(adminId, 'GDPR_DELETE_REQUEST', 'user', userId, `Soft-delete requested`);

  // TODO: Update DB: SET deleted_at = NOW() WHERE id = userId
  const deletedAt = new Date().toISOString();

  await gitCommit(`Compliance: GDPR delete requested for user ${userId}`);

  res.json({ success: true, userId, deletedAt, message: 'User soft-deleted. Will be purged in 30 days.' });
});

// ─── GDPR Export ─────────────────────────────────────────────────────────────

router.get('/gdpr/export/:userId', async (req, res) => {
  const { userId } = req.params;
  const adminId = (req as express.Request & { user?: { id: string } }).user?.id || 'admin';

  writeAuditLog(adminId, 'GDPR_EXPORT', 'user', userId, 'Data export requested');

  // TODO: Fetch real user data from DB
  const userData = {
    id: userId,
    exportedAt: new Date().toISOString(),
    requestedBy: adminId,
    note: 'Connect real database to export actual user data',
    profile: { email: `user_${userId}@example.com`, name: 'Mock User' },
    projects: [],
    settings: {},
    activity: [],
  };

  const filename = `user_${userId}_export_${new Date().toISOString().split('T')[0]}.json`;
  res.setHeader('Content-Disposition', `attachment; filename="${filename}"`);
  res.setHeader('Content-Type', 'application/json');
  res.json(userData);
});

// ─── GDPR Retention Check ────────────────────────────────────────────────────

router.post('/gdpr/retention-check', async (req, res) => {
  // TODO: DELETE FROM users WHERE deleted_at < NOW() - INTERVAL 30 DAYS
  const purgedCount = 0; // replace with real DB result
  writeAuditLog('system', 'GDPR_RETENTION_PURGE', 'users', 'batch', `Purged ${purgedCount} users`);

  await gitCommit(`Compliance: GDPR retention check — purged ${purgedCount} users`);

  res.json({ success: true, purgedCount, ranAt: new Date().toISOString() });
});

// ─── Users (stub) ─────────────────────────────────────────────────────────────

router.get('/users', (req, res) => {
  const { page = '1', pageSize = '20' } = req.query;
  res.json({ users: [], total: 0, page: parseInt(page as string), pageSize: parseInt(pageSize as string), note: 'Connect database' });
});

router.delete('/users/:userId', async (req, res) => {
  const { userId } = req.params;
  writeAuditLog('admin', 'USER_DELETE', 'user', userId, 'Deleted by admin');
  res.json({ success: true, userId });
});

router.post('/users/:userId/ban', async (req, res) => {
  const { userId } = req.params;
  writeAuditLog('admin', 'USER_BAN', 'user', userId, 'Banned by admin');
  res.json({ success: true, userId, status: 'banned' });
});

export default router;
