import { Router, Response } from 'express';
import { v4 as uuidv4 } from 'uuid';
import Anthropic from '@anthropic-ai/sdk';
import { db } from '../database';
import { requireAuth, AuthRequest } from '../middleware/auth';
import { config } from '../config';

const router = Router();
router.use(requireAuth);

const anthropic = new Anthropic({ apiKey: config.anthropicApiKey });

const SYSTEM_PROMPT = `You are assaon AI — a no-code platform builder specialized in the animal care industry.
You help users build websites, booking systems, apps, shops, communities, and more for their animal businesses.
You speak the same language as the user. Be warm, encouraging, and practical.
When the user describes what they want to build, help them refine their idea and generate concrete next steps or code.`;

// List sessions
router.get('/sessions', (req: AuthRequest, res: Response) => {
  const sessions = db.prepare(
    'SELECT * FROM chat_sessions WHERE user_id = ? ORDER BY updated_at DESC LIMIT 50'
  ).all(req.userId);
  res.json({ sessions });
});

// Create session
router.post('/sessions', (req: AuthRequest, res: Response) => {
  const { projectId, title } = req.body;
  const id = uuidv4();
  db.prepare('INSERT INTO chat_sessions (id, user_id, project_id, title) VALUES (?, ?, ?, ?)')
    .run(id, req.userId, projectId || null, title || 'Neue Unterhaltung');
  const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ?').get(id);
  res.status(201).json({ session });
});

// Get session messages
router.get('/sessions/:id/messages', (req: AuthRequest, res: Response) => {
  const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId);
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const messages = db.prepare('SELECT * FROM chat_messages WHERE session_id = ? ORDER BY created_at ASC').all(req.params.id);
  res.json({ messages });
});

// Send message (streaming)
router.post('/sessions/:id/messages', async (req: AuthRequest, res: Response) => {
  const session = db.prepare('SELECT * FROM chat_sessions WHERE id = ? AND user_id = ?').get(req.params.id, req.userId) as any;
  if (!session) return res.status(404).json({ error: 'Session not found' });

  const { content } = req.body;
  if (!content?.trim()) return res.status(400).json({ error: 'Content is required' });

  // Save user message
  const userMsgId = uuidv4();
  db.prepare('INSERT INTO chat_messages (id, session_id, role, content) VALUES (?, ?, ?, ?)')
    .run(userMsgId, session.id, 'user', content);

  // Get conversation history (last 20 messages)
  const history = db.prepare(
    'SELECT role, content FROM chat_messages WHERE session_id = ? ORDER BY created_at DESC LIMIT 20'
  ).all(session.id) as { role: string; content: string }[];

  const messages = history.reverse().map(m => ({
    role: m.role as 'user' | 'assistant',
    content: m.content,
  }));

  // Setup SSE
  res.setHeader('Content-Type', 'text/event-stream');
  res.setHeader('Cache-Control', 'no-cache');
  res.setHeader('Connection', 'keep-alive');

  let assistantContent = '';

  try {
    const stream = await anthropic.messages.stream({
      model: 'claude-sonnet-4-6',
      max_tokens: 4096,
      system: SYSTEM_PROMPT,
      messages,
    });

    for await (const chunk of stream) {
      if (chunk.type === 'content_block_delta' && chunk.delta.type === 'text_delta') {
        assistantContent += chunk.delta.text;
        res.write(`data: ${JSON.stringify({ text: chunk.delta.text })}\n\n`);
      }
    }

    // Save assistant message
    const assistantMsgId = uuidv4();
    db.prepare('INSERT INTO chat_messages (id, session_id, role, content) VALUES (?, ?, ?, ?)')
      .run(assistantMsgId, session.id, 'assistant', assistantContent);

    // Update session title if first message
    if (!session.title || session.title === 'Neue Unterhaltung') {
      const shortTitle = content.slice(0, 60);
      db.prepare('UPDATE chat_sessions SET title = ?, updated_at = datetime("now") WHERE id = ?')
        .run(shortTitle, session.id);
    } else {
      db.prepare('UPDATE chat_sessions SET updated_at = datetime("now") WHERE id = ?').run(session.id);
    }

    res.write(`data: ${JSON.stringify({ done: true, messageId: assistantMsgId })}\n\n`);
    res.end();
  } catch (err: any) {
    res.write(`data: ${JSON.stringify({ error: err.message || 'AI error' })}\n\n`);
    res.end();
  }
});

// Delete session
router.delete('/sessions/:id', (req: AuthRequest, res: Response) => {
  const result = db.prepare('DELETE FROM chat_sessions WHERE id = ? AND user_id = ?').run(req.params.id, req.userId);
  if (result.changes === 0) return res.status(404).json({ error: 'Session not found' });
  res.json({ success: true });
});

export default router;
