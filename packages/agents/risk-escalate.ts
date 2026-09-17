// ============================================================
// RISK & ESCALATION SUBAGENT
// Flags refusal risks, red flags, and escalates to human review
// ============================================================

import type { AgentResult, RiskLevel, SupervisorRequest } from '../shared/types';

interface RiskFactor {
  factor: string;
  level: RiskLevel;
  explanation: string;
  recommendation: string;
}

const RISK_PATTERNS: Array<{
  pattern: RegExp;
  factor: string;
  level: RiskLevel;
  explanation: string;
  recommendation: string;
}> = [
  {
    pattern: /overstay|overstayed|stayed longer|beyond visa/,
    factor: 'Visa Overstay',
    level: 'critical',
    explanation:
      'Overstaying a visa is a serious breach of Australian immigration law. ' +
      'As at September 2026, enforcement has significantly increased. ' +
      'Penalties include a 3-year re-entry ban (under 28 days overstay) or permanent ban (over 12 months).',
    recommendation:
      'Seek urgent advice from a MARA-registered migration agent immediately. ' +
      'Do NOT depart Australia without professional advice as this may trigger exclusion periods.',
  },
  {
    pattern: /criminal|crime|conviction|offence|offense|police|charged|arrested/,
    factor: 'Character Issues',
    level: 'high',
    explanation:
      'Character requirements under s501 of the Migration Act are strictly applied. ' +
      'Convictions, charges, or associations may result in visa refusal or cancellation.',
    recommendation:
      'Disclose all matters fully. Do not attempt to conceal. Consult a migration agent specialising in character cases.',
  },
  {
    pattern: /refused|rejected|previous refusal|prior refusal/,
    factor: 'Previous Visa Refusal',
    level: 'high',
    explanation:
      'A prior visa refusal must generally be disclosed. Failure to disclose is a ground for cancellation. ' +
      'Refusals affect future applications and in some cases trigger exclusion periods.',
    recommendation:
      'Always disclose prior refusals. Address the reasons for the previous refusal in the new application.',
  },
  {
    pattern: /health condition|medical|disease|mental health|disability|tuberculosis|hiv/,
    factor: 'Health Requirements',
    level: 'medium',
    explanation:
      'All visa applicants must meet health requirements. Certain conditions may require additional assessment or waiver.',
    recommendation:
      'Complete the required health examination through an approved panel physician. Waivers are available in some circumstances.',
  },
  {
    pattern: /salary.*below|under.*tsmit|below.*tsmit|low salary|underpaid/,
    factor: 'Salary Below TSMIT',
    level: 'high',
    explanation:
      'The TSMIT is $79,423 from July 2026. Applications for 482/186 with salary below this threshold will be refused.',
    recommendation:
      'Ensure salary is at or above $79,423 and is in the employment contract. Market salary testing also applies.',
  },
  {
    pattern: /student.*family|dependant.*student|bring.*family.*student/,
    factor: 'Student Dependant Restrictions (2026)',
    level: 'high',
    explanation:
      'From 2026, dependants are generally not permitted for students in VET courses or Masters by coursework. ' +
      'Only PhD and Masters by research students typically retain full dependant rights.',
    recommendation:
      'Verify current policy before including dependants on a student visa application. Incorrect applications waste significant fees.',
  },
  {
    pattern: /age.*45|45.*year|over 45|aged 45/,
    factor: 'Age 45+ Restriction',
    level: 'medium',
    explanation:
      'Most skilled migration visas (189, 190, 186 Direct Entry) require applicants to be under 45 at time of invitation/application. ' +
      'This is a hard cut-off — points or other factors do not override it.',
    recommendation:
      'Explore alternative pathways: 482 short-term (no age limit), regional pathways (491/494 — under 45 still), ' +
      'partner visas, or the Business Innovation and Investment stream.',
  },
  {
    pattern: /visitor.*work|work on visitor|work.*tourist|work.*holiday/,
    factor: 'Working Without Work Rights',
    level: 'critical',
    explanation:
      'Working in Australia without valid work rights is a breach of visa conditions. ' +
      'This can result in visa cancellation, removal, and a ban on future visa applications.',
    recommendation: 'Do not work on a visitor visa. Apply for an appropriate work visa before commencing employment.',
  },
];

export async function runRiskEscalate(
  request: SupervisorRequest,
): Promise<AgentResult> {
  const q = request.question.toLowerCase();
  const ctx = request.context ?? {};

  const triggeredRisks: RiskFactor[] = [];

  for (const pattern of RISK_PATTERNS) {
    if (pattern.pattern.test(q)) {
      triggeredRisks.push({
        factor: pattern.factor,
        level: pattern.level,
        explanation: pattern.explanation,
        recommendation: pattern.recommendation,
      });
    }
  }

  // Context-based risk checks
  if (ctx.annualSalary && ctx.annualSalary < 79423) {
    triggeredRisks.push({
      factor: 'Salary Below TSMIT',
      level: 'high',
      explanation: `Indicated salary ($${ctx.annualSalary.toLocaleString()}) is below TSMIT of $79,423 (July 2026).`,
      recommendation: 'Increase salary to at least $79,423 before applying for 482/186.',
    });
  }
  if (ctx.ageYears && ctx.ageYears >= 45) {
    triggeredRisks.push({
      factor: 'Age Restriction',
      level: 'medium',
      explanation: `Age ${ctx.ageYears} may affect eligibility for skilled migration visas with an under-45 requirement.`,
      recommendation: 'Review all available pathways. Some have no age restriction.',
    });
  }

  const overallRisk = triggeredRisks.reduce<RiskLevel>((acc, r) => {
    if (r.level === 'critical') return 'critical';
    if (r.level === 'high' && acc !== 'critical') return 'high';
    if (r.level === 'medium' && acc === 'low') return 'medium';
    return acc;
  }, 'low');

  const requiresHumanReview = overallRisk === 'high' || overallRisk === 'critical';

  const riskText =
    triggeredRisks.length === 0
      ? 'No specific risk factors identified for this query. Always verify your situation with a registered migration agent.'
      : triggeredRisks
          .map(
            (r) =>
              `**[${r.level.toUpperCase()} RISK] ${r.factor}**\n` +
              `${r.explanation}\n` +
              `📌 Recommendation: ${r.recommendation}`,
          )
          .join('\n\n');

  const humanNote = requiresHumanReview
    ? '\n\n🔴 **HUMAN REVIEW REQUIRED** — One or more high/critical risk factors have been identified. ' +
      'Do not proceed without consulting a MARA-registered migration agent: [www.mara.gov.au](https://www.mara.gov.au)'
    : '';

  return {
    summary: riskText + humanNote,
    details: JSON.stringify(triggeredRisks, null, 2),
    citations: [
      {
        title: 'Character Requirements — Migration Act s501',
        source: 'Department of Home Affairs',
        url: 'https://immi.homeaffairs.gov.au/visas/already-have-a-visa/check-visa-details-and-conditions/visa-cancellation',
        dateAccessed: new Date().toISOString().split('T')[0],
        relevance: 'Character and compliance risk factors',
      },
      {
        title: 'Find a Registered Migration Agent',
        source: 'Office of the MARA',
        url: 'https://www.mara.gov.au/using-an-agent/find-a-registered-migration-agent/',
        dateAccessed: new Date().toISOString().split('T')[0],
        relevance: 'Escalation — locating a registered migration agent',
      },
    ],
    riskLevel: overallRisk,
    requiresHumanReview,
  };
}
