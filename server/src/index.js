import 'dotenv/config';
import express from 'express';
import cors from 'cors';
import helmet from 'helmet';
import rateLimit from 'express-rate-limit';
import path from 'path';
import { fileURLToPath } from 'url';

import authRoutes from './routes/auth.js';
import clientRoutes from './routes/clients.js';
import noticeRoutes from './routes/notices.js';
import deadlineRoutes from './routes/deadlines.js';
import contractRoutes from './routes/contracts.js';
import docRoutes from './routes/generatedDocs.js';
import dashboardRoutes from './routes/dashboard.js';
import { errorHandler } from './middleware/errors.js';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const app = express();

app.use(helmet());
app.use(cors({ origin: ['http://localhost:5173', 'http://localhost:4173'], credentials: true }));
app.use(express.json({ limit: '2mb' }));

// Global rate limit; auth endpoints get a stricter one in their router
app.use(rateLimit({ windowMs: 15 * 60 * 1000, max: 500, standardHeaders: true, legacyHeaders: false }));

app.get('/api/health', (_req, res) => res.json({ ok: true, service: 'themis-api' }));

app.use('/api/auth', authRoutes);
app.use('/api/clients', clientRoutes);
app.use('/api/notices', noticeRoutes);
app.use('/api/deadlines', deadlineRoutes);
app.use('/api/contracts', contractRoutes);
app.use('/api/docs', docRoutes);
app.use('/api/dashboard', dashboardRoutes);

app.use(errorHandler);

const port = process.env.PORT || 4000;
app.listen(port, () => {
  console.log(`THEMIS API running on http://localhost:${port}`);
  if (!process.env.ANTHROPIC_API_KEY) {
    console.warn('WARNING: ANTHROPIC_API_KEY not set — AI features (notice extraction/drafting, contract analysis) will return a clear error until you add it to server/.env');
  }
});
