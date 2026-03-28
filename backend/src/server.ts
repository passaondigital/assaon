import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import path from 'path';
import { config } from './config';
import { initDb } from './database';
import authRoutes from './routes/auth';
import projectRoutes from './routes/projects';
import chatRoutes from './routes/chat';

initDb();

const app = express();

app.use(helmet({ contentSecurityPolicy: false }));
app.use(cors({
  origin: config.nodeEnv === 'production' ? 'https://assaon.com' : config.frontendUrl,
  credentials: true,
}));
app.use(express.json({ limit: '10mb' }));

// API routes
app.use('/api/auth', authRoutes);
app.use('/api/projects', projectRoutes);
app.use('/api/chat', chatRoutes);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({ status: 'ok', version: '1.0.0', env: config.nodeEnv });
});

// Serve frontend in production
if (config.nodeEnv === 'production') {
  app.use(express.static(path.join(__dirname, '../public')));
  app.get('*', (_req, res) => {
    res.sendFile(path.join(__dirname, '../public/index.html'));
  });
}

app.listen(config.port, () => {
  console.log(`assaon backend running on port ${config.port} [${config.nodeEnv}]`);
});

export default app;
