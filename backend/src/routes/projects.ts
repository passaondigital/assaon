import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import { db } from '../database';
import { requireAuth, AuthRequest } from '../middleware/auth';

const router = Router();
router.use(requireAuth);

router.get('/', (req: AuthRequest, res: Response) => {
  const projects = db.prepare(
    'SELECT * FROM projects WHERE user_id = ? ORDER BY updated_at DESC'
  ).all(req.userId);
  res.json({ projects });
});

router.post('/', (req: AuthRequest, res: Response) => {
  const { name, description, type = 'website' } = req.body;
  if (!name) return res.status(400).json({ error: 'Name is required' });

  const id = uuidv4();
  const subdomain = name.toLowerCase().replace(/[^a-z0-9]/g, '-').replace(/-+/g, '-').slice(0, 30);
  const uniqueSubdomain = `${subdomain}-${id.slice(0, 6)}`;

  db.prepare(
    'INSERT INTO projects (id, user_id, name, description, subdomain, type) VALUES (?, ?, ?, ?, ?, ?)'
  ).run(id, req.userId, name, description || null, uniqueSubdomain, type);

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(id);
  res.status(201).json({ project });
});

router.get('/:id', (req: AuthRequest, res: Response) => {
  const project = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!project) return res.status(404).json({ error: 'Project not found' });
  res.json({ project });
});

router.patch('/:id', (req: AuthRequest, res: Response) => {
  const { name, description, status } = req.body;
  const existing = db.prepare('SELECT * FROM projects WHERE id = ? AND user_id = ?').get(req.params.id, req.userId) as any;
  if (!existing) return res.status(404).json({ error: 'Project not found' });

  db.prepare(
    'UPDATE projects SET name = ?, description = ?, status = ?, updated_at = datetime("now") WHERE id = ?'
  ).run(
    name ?? existing.name,
    description ?? existing.description,
    status ?? existing.status,
    req.params.id
  );

  const project = db.prepare('SELECT * FROM projects WHERE id = ?').get(req.params.id);
  res.json({ project });
});

router.delete('/:id', (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM projects WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (result.changes === 0) return res.status(404).json({ error: 'Project not found' });
  res.json({ success: true });
});

export default router;
