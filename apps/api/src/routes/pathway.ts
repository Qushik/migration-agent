import { Router } from 'express';
import { VISA_PATHWAYS, VISA_BY_SUBCLASS } from '../../../../packages/shared/visa-data';

export const pathwayRouter = Router();

/**
 * GET /api/pathway/list
 * Returns all visa pathways.
 */
pathwayRouter.get('/list', (_req, res) => {
  res.json({ pathways: VISA_PATHWAYS });
});

/**
 * GET /api/pathway/:subclass
 * Returns details for a specific visa subclass.
 */
pathwayRouter.get('/:subclass', (req, res) => {
  const visa = VISA_BY_SUBCLASS[req.params.subclass];
  if (!visa) {
    return res.status(404).json({ error: `Visa subclass ${req.params.subclass} not found` });
  }
  return res.json(visa);
});

/**
 * POST /api/pathway/compare
 * Body: { subclasses: string[] }
 */
pathwayRouter.post('/compare', (req, res) => {
  const { subclasses } = req.body as { subclasses: string[] };
  if (!Array.isArray(subclasses) || subclasses.length === 0) {
    return res.status(400).json({ error: 'subclasses array is required' });
  }
  const results = subclasses.map((s) => VISA_BY_SUBCLASS[s]).filter(Boolean);
  return res.json({ comparison: results });
});
