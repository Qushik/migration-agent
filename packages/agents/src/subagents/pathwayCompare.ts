import type { ISubagent, SubagentContext, SubagentResult } from '../types.js';
import { VISA_SUBCLASSES, POLICY_SOURCES } from '@migration-agent/shared';

/**
 * Pathway Compare Subagent
 * ------------------------
 * Compares visa pathways based on user query and optional profile.
 */
export class PathwayCompareAgent implements ISubagent {
  name = 'PathwayCompare';
  description = 'Compares Australian visa pathways with pros/cons analysis.';

  async run(ctx: SubagentContext): Promise<SubagentResult> {
    const { query } = ctx;
    const requestedSubclass = query.visaSubclass;

    if (requestedSubclass && VISA_SUBCLASSES[requestedSubclass]) {
      const visa = VISA_SUBCLASSES[requestedSubclass];
      const answer = this.formatSingleVisa(visa);
      return {
        agentName: this.name,
        success: true,
        data: {
          answer,
          visa,
          citations: [
            {
              text: `Subclass ${visa.subclass} — ${visa.name}`,
              sourceUrl: visa.officialUrl,
              sourceAuthority: 'Department of Home Affairs',
              dateAccessed: new Date().toISOString().split('T')[0],
              isOfficial: true,
            },
          ],
          riskFlags: [],
        },
      };
    }

    // Default: return overview of all tracked pathways
    const answer = this.formatAllVisas();
    return {
      agentName: this.name,
      success: true,
      data: {
        answer,
        visas: Object.values(VISA_SUBCLASSES),
        citations: Object.values(VISA_SUBCLASSES).map(v => ({
          text: `Subclass ${v.subclass} — ${v.name}`,
          sourceUrl: v.officialUrl,
          sourceAuthority: 'Department of Home Affairs',
          dateAccessed: new Date().toISOString().split('T')[0],
          isOfficial: true,
        })),
        riskFlags: [],
      },
    };
  }

  private formatSingleVisa(visa: (typeof VISA_SUBCLASSES)[string]): string {
    return [
      `## Subclass ${visa.subclass} — ${visa.name}`,
      `**Type:** ${visa.type === 'permanent' ? '🟢 Permanent' : '🔵 Temporary'} | **Stream:** ${visa.stream}`,
      '',
      visa.description,
      '',
      '### ✅ Pros',
      ...visa.pros.map(p => `- ${p}`),
      '',
      '### ❌ Cons',
      ...visa.cons.map(c => `- ${c}`),
      '',
      '### Key Requirements',
      ...visa.keyRequirements.map(r => `- ${r}`),
      '',
      `[Official Home Affairs page](${visa.officialUrl})`,
    ].join('\n');
  }

  private formatAllVisas(): string {
    const lines = ['## Australian Visa Pathway Overview\n'];
    for (const visa of Object.values(VISA_SUBCLASSES)) {
      lines.push(`### ${visa.subclass} — ${visa.name} (${visa.type})`);
      lines.push(visa.description);
      lines.push(`**Top pros:** ${visa.pros[0]}`);
      lines.push(`**Top cons:** ${visa.cons[0]}`);
      lines.push('');
    }
    return lines.join('\n');
  }
}
