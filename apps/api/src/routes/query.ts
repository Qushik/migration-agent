import { Router } from 'express';
import { z } from 'zod';
import { Supervisor } from '@migration-agent/agents';

const router = Router();
const supervisor = new Supervisor();

const querySchema = z.object({
  query: z.string().min(1).max(2000),
  visaSubclass: z.string().optional(),
  userProfile: z.object({
    age: z.number().optional(),
    occupation: z.string().optional(),
    anzscoCode: z.string().optional(),
    englishLevel: z.enum(['functional', 'vocational', 'competent', 'proficient', 'superior']).optional(),
    salaryAUD: z.number().optional(),
    yearsExperience: z.number().optional(),
    hasEmployer: z.boolean().optional(),
    statePreference: z.string().optional(),
    familyMembers: z.number().optional(),
  }).optional(),
  sessionId: z.string().optional(),
});

router.post('/', async (req, res) => {
  try {
    const parsed = querySchema.safeParse(req.body);
    if (!parsed.success) {
      return res.status(400).json({ error: 'Invalid request', details: parsed.error.errors });
    }

    const response = await supervisor.run(parsed.data);
    return res.json(response);
  } catch (err) {
    console.error('Supervisor error:', err);
    return res.status(500).json({
      error: 'Internal server error',
      message: err instanceof Error ? err.message : 'Unknown error',
    });
  }
});

export { router as queryRouter };
