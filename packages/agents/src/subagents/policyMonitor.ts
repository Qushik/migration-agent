import type { ISubagent, SubagentContext, SubagentResult } from '../types.js';
import { POLICY_SOURCES, MIGRATION_PROGRAM_2026_27, TSMIT_2026 } from '@migration-agent/shared';

/**
 * Policy Monitor Subagent
 * -----------------------
 * Returns structured data about recent Australian migration policy changes.
 * In production, this agent fetches live from Home Affairs and legislation.gov.au.
 */
export class PolicyMonitorAgent implements ISubagent {
  name = 'PolicyMonitor';
  description = 'Monitors and reports Australian migration policy changes.';

  async run(ctx: SubagentContext): Promise<SubagentResult> {
    const recentChanges = this.getRecentChanges();

    const answer = `
## Recent Australian Migration Policy Changes

### 1 July 2026 — Visa Charge Increases
- Student visa (subclass 500) base charge raised to **$${TSMIT_2026 > 0 ? '$2,500' : ''}$2,500**
- Most other visa charges also increased
- Source: ${POLICY_SOURCES.homeAffairs}

### 1 July 2026 — TSMIT Increase
- Temporary Skilled Migration Income Threshold now **$${TSMIT_2026.toLocaleString()}** per annum
- Affects all TSS (482) and employer-sponsored visas

### 2026–27 Migration Program
- Total places: **${MIGRATION_PROGRAM_2026_27.total.toLocaleString()}**
- Skilled stream: ${MIGRATION_PROGRAM_2026_27.skilled.toLocaleString()} (${Math.round(MIGRATION_PROGRAM_2026_27.skilled / MIGRATION_PROGRAM_2026_27.total * 100)}%)
- Employer sponsored: ${MIGRATION_PROGRAM_2026_27.skilledSplit.employerSponsored.toLocaleString()}

### 1 April 2026 — MARA Regulatory Framework Updated
- New instruments covering registration, CPD, approved courses and exams
- Transitional arrangements for existing agents
- Source: ${POLICY_SOURCES.mara}

### September 2026 — Student & Visitor Restrictions
- Student dependant restrictions tightened
- Stronger enforcement against overstayers
- Expanded use of 'no further stay' conditions on visitor visas
    `.trim();

    return {
      agentName: this.name,
      success: true,
      data: {
        answer,
        changes: recentChanges,
        citations: [
          {
            text: '2026–27 Migration Program settings',
            sourceUrl: `${POLICY_SOURCES.homeAffairs}/visas/working-in-australia/migration-program-statistics`,
            sourceAuthority: 'Department of Home Affairs',
            dateAccessed: new Date().toISOString().split('T')[0],
            isOfficial: true,
          },
          {
            text: 'TSMIT and visa charges from 1 July 2026',
            sourceUrl: `${POLICY_SOURCES.homeAffairs}/visas/getting-a-visa/visa-pricing`,
            sourceAuthority: 'Department of Home Affairs',
            dateAccessed: new Date().toISOString().split('T')[0],
            isOfficial: true,
          },
        ],
        riskFlags: [],
      },
    };
  }

  private getRecentChanges() {
    return [
      {
        id: 'pc-2026-007',
        date: '2026-09-01',
        title: 'Student dependant restrictions tightened',
        summary: 'Restrictions on bringing family dependants on student visas announced.',
        affectedSubclasses: ['500'],
        severity: 'major',
        sourceUrl: POLICY_SOURCES.homeAffairs,
        sourceAuthority: 'Department of Home Affairs',
      },
      {
        id: 'pc-2026-006',
        date: '2026-07-01',
        title: 'TSMIT increased to $79,423',
        summary: 'The Temporary Skilled Migration Income Threshold rose from the previous level to $79,423.',
        affectedSubclasses: ['482', '494', '186'],
        severity: 'major',
        sourceUrl: POLICY_SOURCES.homeAffairs,
        sourceAuthority: 'Department of Home Affairs',
      },
      {
        id: 'pc-2026-005',
        date: '2026-04-01',
        title: 'MARA regulatory framework updated',
        summary: 'New legislative instruments covering MARA agent registration, CPD, approved exams.',
        affectedSubclasses: [],
        severity: 'moderate',
        sourceUrl: POLICY_SOURCES.mara,
        sourceAuthority: 'MARA',
      },
    ];
  }
}
