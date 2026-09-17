import express from 'express';
import cors from 'cors';
import 'dotenv/config';
import { queryRouter } from './routes/query.js';
import { visaRouter } from './routes/visas.js';
import { policyRouter } from './routes/policy.js';

const app = express();
const PORT = process.env.PORT ?? 3001;

// Middleware
app.use(cors({
  origin: (process.env.CORS_ORIGINS ?? 'http://localhost:5173').split(','),
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/api/query', queryRouter);
app.use('/api/visas', visaRouter);
app.use('/api/policy', policyRouter);

// Health check
app.get('/api/health', (_req, res) => {
  res.json({
    status: 'ok',
    version: '1.0.0',
    timestamp: new Date().toISOString(),
    agents: ['Supervisor', 'PolicyMonitor', 'PathwayCompare', 'EvidenceChecker', 'RiskAgent', 'CitationValidator'],
  });
});

app.listen(PORT, () => {
  console.log(`🚀 Migration Agent API running on http://localhost:${PORT}`);
  console.log(`📋 Health: http://localhost:${PORT}/api/health`);
});

export default app;
