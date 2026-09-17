// Australian Migration Constants — updated September 2026

export const MIGRATION_PROGRAM_2026_27 = {
  total: 185_000,
  skilled: 132_200,
  family: 52_500,
  special: 300,
  skilledSplit: {
    employerSponsored: 58_040,
    pointsTested: 38_310,
    stateTerritory: 29_750,
    global_talent: 5_000,
    regional: 1_100,
  },
} as const;

export const TSMIT_2026 = 79_423; // Temporary Skilled Migration Income Threshold

export const STUDENT_VISA_CHARGE_2026 = 2_500; // AUD, from 1 July 2026

export const POLICY_SOURCES = {
  homeAffairs: 'https://immi.homeaffairs.gov.au',
  legislation: 'https://www.legislation.gov.au',
  mara: 'https://www.mara.gov.au',
  abf: 'https://www.abf.gov.au',
} as const;

export const AGENT_CONFIG = {
  maxRetries: 3,
  citationMaxAgeDays: 90,
  riskEscalationThreshold: 0.7,
  modelDefault: 'gpt-4o',
} as const;
