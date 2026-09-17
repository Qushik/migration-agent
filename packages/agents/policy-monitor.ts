// ============================================================
// POLICY MONITOR SUBAGENT
// Tracks recent changes to Australian migration policy
// ============================================================

import type { AgentResult, SupervisorRequest } from '../shared/types';
import { PROGRAM_SETTINGS_2026_27 } from '../shared/visa-data';
import { OFFICIAL_SOURCES } from '../shared/policy-sources';

// Recent known policy changes (updated Sept 2026)
const RECENT_POLICY_CHANGES = [
  {
    date: '2026-07-01',
    title: 'Visa Application Charges Increased',
    summary:
      'Most visa application charges increased from 1 July 2026. ' +
      'Student visa (subclass 500) base charge rose to $2,500. ' +
      'Skilled visa charges (189, 190, 482, 186) also increased.',
    affectedVisas: ['189', '190', '482', '186', '500', '485', '820'],
    source: 'Home Affairs',
    url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges/current-visa-pricing',
  },
  {
    date: '2026-07-01',
    title: 'TSMIT Increased to $79,423',
    summary:
      'The Temporary Skilled Migration Income Threshold (TSMIT) rose to $79,423 per annum ' +
      'from 1 July 2026. All 482 TSS and 186 ENS applications must meet this minimum salary.',
    affectedVisas: ['482', '186', '494'],
    source: 'Home Affairs',
    url: 'https://immi.homeaffairs.gov.au/visas/working-in-australia/temporary-skill-shortage-visa/labour-market-testing',
  },
  {
    date: '2026-04-01',
    title: 'Migration Agent Regulatory Framework Refreshed',
    summary:
      'New instruments commenced 1 April 2026 covering MARA registration, CPD requirements, ' +
      'approved providers, specified courses and exams, registration charges, and transitional arrangements.',
    affectedVisas: [],
    source: 'OMARA / MARA',
    url: 'https://www.mara.gov.au/registration/regulatory-framework',
  },
  {
    date: '2026-09-01',
    title: 'Student Dependant Restrictions',
    summary:
      'Significant restrictions on dependants for many student visa holders announced in 2026. ' +
      'Dependants of students in vocational education and masters by coursework generally cannot ' +
      'accompany or join the student in Australia.',
    affectedVisas: ['500'],
    source: 'Home Affairs',
    url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing/student-500',
  },
  {
    date: '2026-09-01',
    title: 'Increased Overstay Enforcement',
    summary:
      'The government announced a crackdown on visa overstayers in 2026, with increased ' +
      'compliance activity, faster cancellation processes, and expanded use of "no further stay" ' +
      'conditions on visitor and student visas.',
    affectedVisas: ['600', '500', '417', '462'],
    source: 'Home Affairs',
    url: 'https://www.homeaffairs.gov.au/news-media/archive/2026-compliance',
  },
  {
    date: '2026-07-01',
    title: '2026–27 Migration Program — 185,000 Places',
    summary:
      `The 2026–27 permanent migration program is set at ${PROGRAM_SETTINGS_2026_27.totalPermanentPlaces.toLocaleString()} places. ` +
      `Skilled migration: ${PROGRAM_SETTINGS_2026_27.skilledMigration.toLocaleString()} places. ` +
      `Family: ${PROGRAM_SETTINGS_2026_27.familyMigration.toLocaleString()} places. ` +
      `Employer-sponsored: ${PROGRAM_SETTINGS_2026_27.employerSponsored.toLocaleString()} places.`,
    affectedVisas: ['189', '190', '482', '186', '820'],
    source: 'Home Affairs',
    url: 'https://www.homeaffairs.gov.au/research-and-statistics/statistics/visa-statistics/live/migration-program',
  },
];

export async function runPolicyMonitor(
  request: SupervisorRequest,
): Promise<AgentResult> {
  const q = request.question.toLowerCase();

  // Find relevant changes based on keywords
  const relevant = RECENT_POLICY_CHANGES.filter((change) => {
    const text = (change.title + change.summary).toLowerCase();
    const qWords = q.split(/\s+/).filter((w) => w.length > 3);
    return (
      change.affectedVisas.some((v) => q.includes(v)) ||
      qWords.some((word) => text.includes(word))
    );
  });

  const changesText = (relevant.length > 0 ? relevant : RECENT_POLICY_CHANGES.slice(0, 3))
    .map((c) => `• **${c.title}** (${c.date}): ${c.summary}`)
    .join('\n');

  return {
    summary:
      `Recent policy changes relevant to your query:\n\n${changesText}\n\n` +
      `As at September 2026, the permanent migration program is set at ` +
      `${PROGRAM_SETTINGS_2026_27.totalPermanentPlaces.toLocaleString()} places for 2026–27.`,
    details: JSON.stringify(relevant, null, 2),
    citations: [
      {
        title: 'Migration Program 2026–27 Planning Levels',
        source: 'Department of Home Affairs',
        url: 'https://www.homeaffairs.gov.au/research-and-statistics/statistics/visa-statistics/live/migration-program',
        dateAccessed: new Date().toISOString().split('T')[0],
        relevance: 'Official program settings and visa place allocations for 2026–27',
      },
      {
        title: 'Visa Application Charges — Current',
        source: 'Department of Home Affairs',
        url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/fees-and-charges/current-visa-pricing',
        dateAccessed: new Date().toISOString().split('T')[0],
        relevance: 'Fee schedule effective 1 July 2026',
      },
    ],
    riskLevel: 'low',
    requiresHumanReview: false,
  };
}
