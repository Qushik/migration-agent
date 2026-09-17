import { Router } from 'express';
import { runSupervisor } from '../../../../packages/agents/supervisor';
import type { SupervisorRequest } from '../../../../packages/shared/types';

export const queryRouter = Router();

/**
 * POST /api/query
 * Main endpoint — send a migration question and receive a full supervisor response.
 *
 * Body: { question: string, context?: ApplicantContext, sessionId?: string }
 */
queryRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body as SupervisorRequest;

    if (!body.question || typeof body.question !== 'string') {
      return res.status(400).json({ error: 'question is required and must be a string' });
    }
    if (body.question.length > 2000) {
      return res.status(400).json({ error: 'question must be under 2000 characters' });
    }

    const response = await runSupervisor(body);
    return res.json(response);
  } catch (err) {
    next(err);
  }
});
