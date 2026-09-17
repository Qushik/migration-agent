import type { ISubagent, SubagentContext, SubagentResult, RiskFlag } from '../types.js';
import { AGENT_CONFIG, TSMIT_2026 } from '@migration-agent/shared';

/**
 * Risk Agent Subagent
 * -------------------
 * Assesses risk factors from the user's profile and query.
 * Flags high-risk cases for human migration agent escalation.
 */
export class RiskAgent implements ISubagent {
  name = 'RiskAgent';
  description = 'Assesses migration case risks and flags for human review.';

  async run(ctx: SubagentContext): Promise<SubagentResult> {
    const { query } = ctx;
    const flags: RiskFlag[] = [];
    const q = query.query.toLowerCase();

    // Profile-based risk checks
    if (query.userProfile) {
      const profile = query.userProfile;

      if (profile.age !== undefined && profile.age >= 45) {
        flags.push({
          type: 'high_refusal_risk',
          message: `Age ${profile.age} — applicants aged 45+ are ineligible for points-tested skilled visas (189/190/491). Consider employer-sponsored pathways.`,
          severity: 'high',
        });
      }

      if (profile.salaryAUD !== undefined && profile.salaryAUD < TSMIT_2026 && profile.hasEmployer) {
        flags.push({
          type: 'high_refusal_risk',
          message: `Salary $${profile.salaryAUD.toLocaleString()} is below the TSMIT of $${TSMIT_2026.toLocaleString()}. TSS (482) sponsorship will not be approved at this salary.`,
          severity: 'critical',
        });
      }

      if (profile.yearsExperience !== undefined && profile.yearsExperience < 2 && profile.hasEmployer) {
        flags.push({
          type: 'missing_evidence',
          message: 'Fewer than 2 years of relevant experience may not satisfy TSS (482) requirements.',
          severity: 'medium',
        });
      }
    }

    // Query-based risk detection
    if (q.includes('overstay') || q.includes('over stay')) {
      flags.push({
        type: 'requires_human',
        message: 'Overstay history is a significant risk factor. Strengthened enforcement from September 2026 means this case requires assessment by a registered migration agent.',
        severity: 'critical',
      });
    }

    if (q.includes('no further stay') || q.includes('condition 8503')) {
      flags.push({
        type: 'high_refusal_risk',
        message: 'Condition 8503 (no further stay) prevents onshore visa applications in most circumstances. A waiver is required and approval is not guaranteed.',
        severity: 'critical',
      });
    }

    if (q.includes('character') || q.includes('criminal') || q.includes('conviction')) {
      flags.push({
        type: 'requires_human',
        message: 'Character issues must be assessed individually under s501 of the Migration Act. This case requires a registered migration agent or migration lawyer.',
        severity: 'critical',
      });
    }

    if (q.includes('student') && (q.includes('dependant') || q.includes('dependent') || q.includes('family'))) {
      flags.push({
        type: 'policy_changed',
        message: 'Student dependant visa settings were tightened in September 2026. The current rules limit who can bring family members on a student visa. Verify current policy before applying.',
        severity: 'high',
      });
    }

    const requiresHuman = flags.some(f => f.severity === 'critical' || f.type === 'requires_human');
    const riskScore = flags.length === 0 ? 0.1 : Math.min(flags.filter(f => f.severity === 'critical').length * 0.4 + flags.filter(f => f.severity === 'high').length * 0.25 + flags.length * 0.1, 1);

    const answer = flags.length === 0
      ? '## Risk Assessment\n\nNo significant risk flags identified based on the information provided. This assessment is indicative only — a registered migration agent should review the full application.'
      : [
          '## Risk Assessment',
          '',
          `**Risk Score:** ${(riskScore * 100).toFixed(0)}%`,
          requiresHuman ? '\n⚠️ **This case should be reviewed by a registered migration agent.**\n' : '',
          '',
          '### Risk Flags',
          ...flags.map(f => `\n**[${f.severity.toUpperCase()}]** ${f.message}`),
        ].join('\n');

    return {
      agentName: this.name,
      success: true,
      data: {
        answer,
        flags,
        riskScore,
        requiresHumanReview: requiresHuman,
        citations: [],
        riskFlags: flags,
      },
    };
  }
}
