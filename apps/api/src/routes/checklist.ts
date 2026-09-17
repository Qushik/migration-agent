import { Router } from 'express';
import { runEvidenceChecklist } from '../../../../packages/agents/evidence-checklist';
import type { SupervisorRequest } from '../../../../packages/shared/types';

export const checklistRouter = Router();

/**
 * POST /api/checklist
 * Body: { question: string, context?: ApplicantContext }
 */
checklistRouter.post('/', async (req, res, next) => {
  try {
    const body = req.body as SupervisorRequest;
    if (!body.question) {
      return res.status(400).json({ error: 'question is required' });
    }
    const result = await runEvidenceChecklist(body);
    return res.json(result);
  } catch (err) {
    next(err);
  }
});
