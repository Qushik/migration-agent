// ============================================================
// Official Policy Source Registry
// Used by citation-validate agent to verify claims
// ============================================================

export interface PolicySource {
  id: string;
  name: string;
  url: string;
  category: 'legislation' | 'regulation' | 'policy' | 'fee' | 'program' | 'regulator';
  authority: 'primary' | 'secondary' | 'guidance';
  updateFrequency: 'daily' | 'weekly' | 'monthly' | 'as-needed';
}

export const OFFICIAL_SOURCES: PolicySource[] = [
  {
    id: 'migration-act',
    name: 'Migration Act 1958 (Cth)',
    url: 'https://www.legislation.gov.au/Details/C2022C00377',
    category: 'legislation',
    authority: 'primary',
    updateFrequency: 'as-needed',
  },
  {
    id: 'migration-regulations',
    name: 'Migration Regulations 1994 (Cth)',
    url: 'https://www.legislation.gov.au/Series/F1996B00386',
    category: 'regulation',
    authority: 'primary',
    updateFrequency: 'as-needed',
  },
  {
    id: 'home-affairs-visas',
    name: 'Department of Home Affairs — Visas',
    url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing',
    category: 'policy',
    authority: 'primary',
    updateFrequency: 'weekly',
  },
  {
    id: 'home-affairs-fees',
    name: 'Home Affairs — Visa Application Charges',
    url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges/current-visa-pricing',
    category: 'fee',
    authority: 'primary',
    updateFrequency: 'monthly',
  },
  {
    id: 'mara-register',
    name: 'Office of the Migration Agents Registration Authority (OMARA)',
    url: 'https://www.mara.gov.au',
    category: 'regulator',
    authority: 'primary',
    updateFrequency: 'weekly',
  },
  {
    id: 'mara-regulatory-2026',
    name: 'MARA — 2026 Regulatory Framework Update (April 2026)',
    url: 'https://www.mara.gov.au/registration/regulatory-framework',
    category: 'regulator',
    authority: 'primary',
    updateFrequency: 'as-needed',
  },
  {
    id: 'aat-migration',
    name: 'Administrative Appeals Tribunal — Migration & Refugee Division',
    url: 'https://www.aat.gov.au/applying-for-a-review/migration-and-refugee',
    category: 'policy',
    authority: 'primary',
    updateFrequency: 'weekly',
  },
  {
    id: 'tsmit-2026',
    name: 'Temporary Skilled Migration Income Threshold (TSMIT) — July 2026',
    url: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/temporary-skill-shortage-visa/labour-market-testing',
    category: 'fee',
    authority: 'primary',
    updateFrequency: 'as-needed',
  },
  {
    id: 'program-settings-2026-27',
    name: 'Migration Program — 2026–27 Planning Levels',
    url: 'https://www.homeaffairs.gov.au/research-and-statistics/statistics/visa-statistics/live/migration-program',
    category: 'program',
    authority: 'primary',
    updateFrequency: 'monthly',
  },
];

export const SOURCE_BY_ID = Object.fromEntries(
  OFFICIAL_SOURCES.map((s) => [s.id, s]),
);
