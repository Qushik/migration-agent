// ============================================================
// EVIDENCE CHECKLIST SUBAGENT
// Generates document requirements per visa subclass and profile
// ============================================================

import type { AgentResult, SupervisorRequest, EvidenceChecklist, EvidenceItem } from '../shared/types';

const CHECKLISTS: Record<string, EvidenceItem[]> = {
  '189': [
    { category: 'Identity', item: 'Current passport (all pages)', mandatory: true },
    { category: 'Identity', item: 'Birth certificate', mandatory: true },
    { category: 'Skills', item: 'Positive skills assessment from relevant assessing body (ACS, Engineers Australia, VETASSESS, etc.)', mandatory: true },
    { category: 'Skills', item: 'Employment references covering assessed occupation', mandatory: true },
    { category: 'Skills', item: 'Qualifications transcripts and award certificates', mandatory: true },
    { category: 'Language', item: 'English test results (IELTS, PTE, TOEFL, OET, Cambridge)', mandatory: true, notes: 'Minimum Competent English = IELTS 6.0 all bands' },
    { category: 'Points', item: 'Evidence of claimed points (salary, spouse skills, state nomination, study, etc.)', mandatory: true },
    { category: 'Health', item: 'Overseas health examination by panel physician', mandatory: true },
    { category: 'Character', item: 'Police clearances from all countries lived in for 12+ months since age 16', mandatory: true },
    { category: 'Optional', item: 'Spouse/partner skills assessment (5 points)', mandatory: false },
    { category: 'Optional', item: 'Community language evidence (5 points)', mandatory: false, notes: 'NAATI credential required' },
  ],
  '482': [
    { category: 'Identity', item: 'Current passport', mandatory: true },
    { category: 'Sponsorship', item: 'Approved Standard Business Sponsor approval letter', mandatory: true },
    { category: 'Sponsorship', item: 'Employer nomination approval (separate application)', mandatory: true },
    { category: 'Skills', item: 'Qualifications relevant to nominated occupation', mandatory: true },
    { category: 'Skills', item: 'Employment references demonstrating required experience', mandatory: true },
    { category: 'Language', item: 'English proficiency (unless exempt)', mandatory: true, notes: 'Vocational English minimum = IELTS 5.0 all bands' },
    { category: 'Salary', item: 'Signed employment contract showing salary ≥ $79,423 (TSMIT)', mandatory: true },
    { category: 'Health', item: 'Health examination', mandatory: true },
    { category: 'Character', item: 'Police clearances', mandatory: true },
    { category: 'LMT', item: 'Labour market testing evidence (job ads, responses) — 4 weeks within 4 months of nomination', mandatory: true, notes: 'Exemptions apply for some occupations and countries' },
  ],
  '500': [
    { category: 'Identity', item: 'Current passport', mandatory: true },
    { category: 'Enrolment', item: 'Confirmation of Enrolment (CoE) from CRICOS-registered provider', mandatory: true },
    { category: 'Finance', item: 'Proof of funds: tuition + living costs ($21,041/year for main applicant)', mandatory: true },
    { category: 'Language', item: 'English test (IELTS 5.5 overall, no band below 5.0 typically)', mandatory: true },
    { category: 'Health', item: 'OSHC (Overseas Student Health Cover) for full course duration', mandatory: true },
    { category: 'GTE', item: 'Genuine Temporary Entrant statement', mandatory: true, notes: 'Critical — refusal risk if GTE not convincing' },
    { category: 'Character', item: 'Police clearances (if aged 16+)', mandatory: false, notes: 'May be requested' },
    { category: 'Dependants', item: 'Note: dependant rights significantly restricted in 2026 for VET and Masters by coursework students', mandatory: false, notes: 'Check current policy before including dependants' },
  ],
  '820': [
    { category: 'Identity', item: 'Passport for both applicant and sponsor', mandatory: true },
    { category: 'Relationship', item: 'Proof of relationship — 4 categories: financial, household, social, commitment', mandatory: true },
    { category: 'Relationship', item: 'Joint bank account statements or joint lease/mortgage', mandatory: true },
    { category: 'Relationship', item: 'Photos together over time (dated)', mandatory: true },
    { category: 'Relationship', item: 'Statements from friends/family attesting to the relationship', mandatory: true },
    { category: 'Sponsor', item: 'Sponsor citizenship or PR evidence', mandatory: true },
    { category: 'Health', item: 'Health examination for applicant', mandatory: true },
    { category: 'Character', item: 'Police clearances', mandatory: true },
  ],
  '600': [
    { category: 'Identity', item: 'Valid passport', mandatory: true },
    { category: 'Purpose', item: 'Purpose of visit (tourism, family visit, business)', mandatory: true },
    { category: 'Finance', item: 'Evidence of funds to cover stay', mandatory: true },
    { category: 'Ties', item: 'Evidence of strong ties to home country (employment, property, family)', mandatory: true, notes: 'Critical for genuine temporary entrant assessment' },
    { category: 'Accommodation', item: 'Accommodation bookings or host invitation', mandatory: false },
    { category: 'Return', item: 'Return air ticket or ability to purchase', mandatory: false },
  ],
};

export async function runEvidenceChecklist(
  request: SupervisorRequest,
): Promise<AgentResult> {
  const q = request.question.toLowerCase();

  const subclasses = Object.keys(CHECKLISTS).filter((s) => q.includes(s));
  const targetSubclass = subclasses[0];

  if (!targetSubclass) {
    return {
      summary:
        'Please specify a visa subclass (e.g. 189, 482, 500, 820, 600) to get an evidence checklist.',
      details: '',
      citations: [],
      riskLevel: 'low',
      requiresHumanReview: false,
    };
  }

  const items = CHECKLISTS[targetSubclass];
  const mandatory = items.filter((i) => i.mandatory);
  const optional = items.filter((i) => !i.mandatory);
  const warnings = items.filter((i) => i.notes).map((i) => `${i.item}: ${i.notes}`);

  const checklistText =
    `**Mandatory Documents — Subclass ${targetSubclass}**\n` +
    mandatory.map((i) => `  ✅ [${i.category}] ${i.item}`).join('\n') +
    (optional.length > 0
      ? `\n\n**Optional / Conditional Documents**\n` +
        optional.map((i) => `  ⬜ [${i.category}] ${i.item}`).join('\n')
      : '') +
    (warnings.length > 0
      ? `\n\n**Important Notes**\n` + warnings.map((w) => `  ⚠️ ${w}`).join('\n')
      : '');

  return {
    summary: checklistText,
    details: JSON.stringify({ subclass: targetSubclass, items, warnings } as EvidenceChecklist, null, 2),
    citations: [
      {
        title: `Subclass ${targetSubclass} — Document Requirements`,
        source: 'Department of Home Affairs',
        url: `https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing`,
        dateAccessed: new Date().toISOString().split('T')[0],
        relevance: `Official document requirements for visa subclass ${targetSubclass}`,
      },
    ],
    riskLevel: 'low',
    requiresHumanReview: false,
  };
}
