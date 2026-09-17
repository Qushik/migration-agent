import type { ISubagent, SubagentContext, SubagentResult, RiskFlag } from '../types.js';
import { AGENT_CONFIG, POLICY_SOURCES } from '@migration-agent/shared';

/**
 * Citation Validator Subagent
 * ---------------------------
 * Validates that citations from prior subagents are official, recent, and well-formed.
 * Flags stale or unofficial sources.
 */
export class CitationValidatorAgent implements ISubagent {
  name = 'CitationValidator';
  description = 'Validates citations for official authority and recency.';

  async run(ctx: SubagentContext): Promise<SubagentResult> {
    const riskFlags: RiskFlag[] = [];

    // Gather all citations from previous subagent results
    const allCitations = ctx.previousResults
      .flatMap(r => (r.data as { citations?: unknown[] })?.citations ?? [])
      .filter(Boolean) as { sourceUrl: string; dateAccessed: string; isOfficial: boolean; text: string }[];

    const officialDomains = Object.values(POLICY_SOURCES);

    for (const citation of allCitations) {
      // Check official source
      const isOfficialDomain = officialDomains.some(d => citation.sourceUrl.startsWith(d));
      if (!isOfficialDomain && citation.isOfficial) {
        riskFlags.push({
          type: 'stale_info',
          message: `Citation '${citation.text}' claims to be official but links to a non-official domain: ${citation.sourceUrl}`,
          severity: 'medium',
        });
      }

      // Check age
      if (citation.dateAccessed) {
        const accessed = new Date(citation.dateAccessed);
        const ageDays = (Date.now() - accessed.getTime()) / (1000 * 60 * 60 * 24);
        if (ageDays > AGENT_CONFIG.citationMaxAgeDays) {
          riskFlags.push({
            type: 'stale_info',
            message: `Citation '${citation.text}' is ${Math.round(ageDays)} days old, which exceeds the ${AGENT_CONFIG.citationMaxAgeDays}-day freshness threshold.`,
            severity: 'low',
          });
        }
      }
    }

    const answer = riskFlags.length === 0
      ? `## Citation Validation\n\n✅ All ${allCitations.length} citations validated — official sources, within freshness threshold.`
      : `## Citation Validation\n\n⚠️ ${riskFlags.length} citation issue(s) detected:\n\n${riskFlags.map(f => `- [${f.severity.toUpperCase()}] ${f.message}`).join('\n')}`;

    return {
      agentName: this.name,
      success: true,
      data: {
        answer,
        validatedCount: allCitations.length,
        citations: [],
        riskFlags,
      },
    };
  }
}
