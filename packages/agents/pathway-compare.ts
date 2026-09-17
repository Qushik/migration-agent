// ============================================================
// PATHWAY COMPARE SUBAGENT
// Analyses and compares visa pathways based on applicant context
// ============================================================

import type { AgentResult, SupervisorRequest, VisaPathway } from '../shared/types';
import { VISA_PATHWAYS, VISA_BY_SUBCLASS } from '../shared/visa-data';

export async function runPathwayCompare(
  request: SupervisorRequest,
): Promise<AgentResult> {
  const q = request.question.toLowerCase();
  const ctx = request.context ?? {};

  // Find mentioned visa subclasses
  const mentionedSubclasses = ['189', '190', '482', '186', '500', '600', '820', '485', '494', '491']
    .filter((s) => q.includes(s));

  // Determine relevant pathways
  let relevant: VisaPathway[];
  if (mentionedSubclasses.length > 0) {
    relevant = mentionedSubclasses
      .map((s) => VISA_BY_SUBCLASS[s])
      .filter(Boolean);
  } else {
    // Infer from context
    relevant = inferPathways(q, ctx);
  }

  if (relevant.length === 0) {
    relevant = VISA_PATHWAYS.slice(0, 3); // Default to top 3
  }

  const pathwayText = relevant
    .map((v) => formatPathway(v))
    .join('\n\n---\n\n');

  // Personalise if context available
  let personalisation = '';
  if (ctx.annualSalary && ctx.annualSalary < 79423) {
    personalisation +=
      '\n\n⚠️ **Salary Note**: Your indicated salary ($' +
      ctx.annualSalary.toLocaleString() +
      ') is below the current TSMIT of $79,423. ' +
      'This may affect eligibility for 482/186 employer-sponsored pathways.';
  }
  if (ctx.ageYears && ctx.ageYears >= 45) {
    personalisation +=
      '\n\n⚠️ **Age Note**: Age 45+ affects eligibility for most skilled migration pathways (189, 190, 186 Direct Entry). ' +
      'Consider pathways without age restrictions or seek urgent advice.';
  }

  return {
    summary: pathwayText + personalisation,
    details: JSON.stringify(relevant, null, 2),
    citations: [
      {
        title: 'Skilled Visa Listing',
        source: 'Department of Home Affairs',
        url: 'https://immi.homeaffairs.gov.au/visas/getting-a-visa/visa-listing',
        dateAccessed: new Date().toISOString().split('T')[0],
        relevance: 'Official visa subclass information and eligibility criteria',
      },
    ],
    riskLevel: 'low',
    requiresHumanReview: false,
  };
}

function formatPathway(v: VisaPathway): string {
  return (
    `**Subclass ${v.subclass} — ${v.name}**\n` +
    `- Processing: ${v.processingTime}\n` +
    `- Cost: ~$${v.cost.toLocaleString()}\n` +
    `- Leads to PR: ${v.leadsToPR ? 'Yes ✅' : 'No ❌'}\n` +
    `- Current Demand: ${v.currentDemand}\n\n` +
    `**Pros:**\n${v.pros.map((p) => `  ✓ ${p}`).join('\n')}\n\n` +
    `**Cons:**\n${v.cons.map((c) => `  ✗ ${c}`).join('\n')}\n\n` +
    `**Eligibility Requirements:**\n${v.eligibilityRequirements.map((r) => `  • ${r}`).join('\n')}`
  );
}

function inferPathways(
  q: string,
  ctx: NonNullable<SupervisorRequest['context']>,
): VisaPathway[] {
  const results: VisaPathway[] = [];

  if (/employer|sponsor|work|job|employ/.test(q)) {
    results.push(...VISA_PATHWAYS.filter((v) => v.category === 'employer-sponsored'));
  }
  if (/student|study|university|college|cricos/.test(q)) {
    results.push(...VISA_PATHWAYS.filter((v) => v.category === 'student'));
  }
  if (/partner|spouse|de facto|family|husband|wife/.test(q)) {
    results.push(...VISA_PATHWAYS.filter((v) => v.category === 'family'));
  }
  if (/permanent|pr|independent|skilled|points/.test(q)) {
    results.push(...VISA_PATHWAYS.filter((v) => v.category === 'skilled-independent'));
  }
  if (/visit|tourist|holiday|tourism/.test(q)) {
    results.push(...VISA_PATHWAYS.filter((v) => v.category === 'visitor'));
  }

  return [...new Map(results.map((v) => [v.subclass, v])).values()];
}
