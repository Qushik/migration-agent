import { Router } from 'express';
import { PolicyMonitorAgent } from '@migration-agent/agents';

const router = Router();
const policyAgent = new PolicyMonitorAgent();

// GET /api/policy/changes
router.get('/changes', async (_req, res) => {
  try {
    const result = await policyAgent.run({ query: { query: 'recent changes', sessionId: 'api' }, previousResults: [] });
    res.json(result.data);
  } catch (err) {
    res.status(500).json({ error: 'Failed to fetch policy changes' });
  }
});

export { router as policyRouter };
