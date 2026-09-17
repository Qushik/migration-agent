import type { ISubagent, SubagentContext, SubagentResult } from '../types.js';
import { VISA_SUBCLASSES, POLICY_SOURCES } from '@migration-agent/shared';

const EVIDENCE_CHECKLISTS: Record<string, string[]> = {
  '189': [
    'Valid passport',
    'Skills assessment result (from relevant assessing authority)',
    'SkillSelect Expression of Interest (EOI) and invitation letter',
    'English proficiency test results (IELTS/PTE/TOEFL — Competent level min)',
    'Employment references confirming relevant work experience',
    'Academic transcripts and qualifications',
    'Health examination (HAP ID required)',
    'Police clearances from all countries lived in 12+ months since age 16',
    'Passport-size photographs',
    'Birth certificates for all family members included in application',
    'Marriage or de-facto relationship evidence (if applicable)',
  ],
  '190': [
    'All documents from 189 list above',
    'State/territory nomination approval letter',
    'Evidence of skills/experience relevant to nominated state',
  ],
  '482': [
    'Valid passport',
    'Employer nomination approval (form 1066)',
    'Labour market testing evidence (unless exempt under trade agreement)',
    'Skills assessment (where required for occupation)',
    'Employment contract showing salary at or above TSMIT ($79,423)',
    'Evidence of 2 years relevant work experience',
    'Qualifications relevant to nominated occupation',
    'English test results (Functional English minimum)',
    'Health examination',
    'Police clearances',
  ],
  '500': [
    'Valid passport',
    'Confirmation of Enrolment (CoE) from CRICOS registered provider',
    'Genuine Temporary Entrant (GTE) statement',
    'Evidence of financial capacity (tuition + living costs)',
    'Overseas Student Health Cover (OSHC) policy',
    'English proficiency test results',
    'Academic transcripts and qualifications',
    'Health examination',
    'Police clearances (if required)',
    'Note: dependant restrictions apply from September 2026',
  ],
  '820': [
    'Valid passport',
    'Sponsor Australian citizenship/PR evidence',
    'Relationship evidence — 4 categories:',
    '  1. Financial: joint accounts, shared mortgage, combined utilities',
    '  2. Social: joint social media, photos together over time, statutory declarations from family/friends',
    '  3. Household: shared address over time, lease/ownership documents',
    '  4. Commitment: communication records, future plans, length of relationship',
    'Health examination',
    'Police clearances',
    'Birth certificates',
  ],
};

/**
 * Evidence Checker Subagent
 * -------------------------
 * Generates tailored document checklists for visa applications.
 */
export class EvidenceCheckerAgent implements ISubagent {
  name = 'EvidenceChecker';
  description = 'Generates evidence and document checklists for visa subclasses.';

  async run(ctx: SubagentContext): Promise<SubagentResult> {
    const subclass = ctx.query.visaSubclass;

    if (subclass && EVIDENCE_CHECKLISTS[subclass]) {
      const checklist = EVIDENCE_CHECKLISTS[subclass];
      const visa = VISA_SUBCLASSES[subclass];
      const answer = [
        `## Document Checklist — Subclass ${subclass}${visa ? ` (${visa.name})` : ''}`,
        '',
        ...checklist.map(item => `- [ ] ${item}`),
        '',
        '> **Note:** This list is a guide only. Requirements can vary by individual circumstances and change with policy updates. Always verify with the official Home Affairs website and consult a registered migration agent for complex cases.',
      ].join('\n');

      return {
        agentName: this.name,
        success: true,
        data: {
          answer,
          checklist,
          citations: [{
            text: `Evidence requirements for subclass ${subclass}`,
            sourceUrl: visa?.officialUrl ?? POLICY_SOURCES.homeAffairs,
            sourceAuthority: 'Department of Home Affairs',
            dateAccessed: new Date().toISOString().split('T')[0],
            isOfficial: true,
          }],
          riskFlags: [],
        },
      };
    }

    // No subclass specified — return generic guidance
    return {
      agentName: this.name,
      success: true,
      data: {
        answer: 'Please specify a visa subclass to receive a tailored evidence checklist.',
        citations: [],
        riskFlags: [],
      },
    };
  }
}
