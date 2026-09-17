// ============================================================
// Migration Agent — API Server
// ============================================================

import express from 'express';
import cors from 'cors';
import { json } from 'express';
import { queryRouter } from './routes/query';
import { policyRouter } from './routes/policy';
import { pathwayRouter } from './routes/pathway';
import { checklistRouter } from './routes/checklist';

const app = express();
const PORT = process.env.PORT ?? 3001;

// ── Middleware ────────────────────────────────────────────────
app.use(cors({ origin: process.env.CORS_ORIGIN ?? 'http://localhost:3000' }));
app.use(json());

// Request logger
app.use((req, _res, next) => {
  console.log(`[${new Date().toISOString()}] ${req.method} ${req.path}`);
  next();
});

// ── Routes ────────────────────────────────────────────────────
app.use('/api/query', queryRouter);
app.use('/api/policy', policyRouter);
app.use('/api/pathway', pathwayRouter);
app.use('/api/checklist', checklistRouter);

app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    agents: ['supervisor', 'policy-monitor', 'pathway-compare', 'evidence-checklist', 'risk-escalate', 'citation-validate'],
  });
});

// ── Error Handler ─────────────────────────────────────────────
app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  console.error('[Error]', err.message);
  res.status(500).json({ error: 'Internal server error', message: err.message });
});

// ── Start ─────────────────────────────────────────────────────
app.listen(PORT, () => {
  console.log(`✅ Migration Agent API running on http://localhost:${PORT}`);
  console.log(`   Health: http://localhost:${PORT}/api/health`);
});

export default app;
