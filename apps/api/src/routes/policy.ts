import { Router } from 'express';
import { PROGRAM_SETTINGS_2026_27 } from '../../../../packages/shared/visa-data';

export const policyRouter = Router();

/**
 * GET /api/policy/updates
 * Returns recent policy changes summary.
 */
policyRouter.get('/updates', (_req, res) => {
  res.json({
    programYear: PROGRAM_SETTINGS_2026_27.programYear,
    totalPlaces: PROGRAM_SETTINGS_2026_27.totalPermanentPlaces,
    tsmit: PROGRAM_SETTINGS_2026_27.tsmit,
    studentVisaCharge: PROGRAM_SETTINGS_2026_27.studentVisaCharge,
    lastUpdated: PROGRAM_SETTINGS_2026_27.lastUpdated,
    source: PROGRAM_SETTINGS_2026_27.source,
    keyChanges: [
      { date: '2026-07-01', change: 'TSMIT increased to $79,423' },
      { date: '2026-07-01', change: 'Student visa charge increased to $2,500' },
      { date: '2026-07-01', change: 'Visa application charges broadly increased' },
      { date: '2026-04-01', change: 'Migration agent regulatory framework refreshed' },
      { date: '2026-09-01', change: 'Student dependant restrictions expanded' },
      { date: '2026-09-01', change: 'Increased overstay enforcement' },
    ],
  });
});
