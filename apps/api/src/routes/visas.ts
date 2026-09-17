import { Router } from 'express';
import { VISA_SUBCLASSES } from '@migration-agent/shared';

const router = Router();

// GET /api/visas — list all
router.get('/', (_req, res) => {
  const visas = Object.values(VISA_SUBCLASSES).map(v => ({
    subclass: v.subclass,
    name: v.name,
    stream: v.stream,
    type: v.type,
    description: v.description,
  }));
  res.json({ count: visas.length, visas });
});

// GET /api/visas/:subclass — details
router.get('/:subclass', (req, res) => {
  const visa = VISA_SUBCLASSES[req.params.subclass];
  if (!visa) {
    return res.status(404).json({ error: `Visa subclass ${req.params.subclass} not found` });
  }
  return res.json(visa);
});

export { router as visaRouter };
