import type { AgentQuery, AgentResponse } from '@migration-agent/shared';
import type { ISubagent, SubagentResult } from './types.js';
import { PolicyMonitorAgent } from './subagents/policyMonitor.js';
import { PathwayCompareAgent } from './subagents/pathwayCompare.js';
import { EvidenceCheckerAgent } from './subagents/evidenceChecker.js';
import { RiskAgent } from './subagents/riskAgent.js';
import { CitationValidatorAgent } from './subagents/citationValidator.js';
import { AGENT_CONFIG } from '@migration-agent/shared';

/**
 * Supervisor Agent
 * ----------------
 * Routes queries to the appropriate subagents, aggregates their results,
 * and returns a structured AgentResponse with citations and risk flags.
 */
export class Supervisor {
  private subagents: ISubagent[];

  constructor() {
    this.subagents = [
      new PolicyMonitorAgent(),
      new PathwayCompareAgent(),
      new EvidenceCheckerAgent(),
      new RiskAgent(),
      new CitationValidatorAgent(),
    ];
  }

  /**
   * Determines which subagents to invoke based on the query intent.
   */
  private selectSubagents(query: AgentQuery): ISubagent[] {
    const q = query.query.toLowerCase();
    const selected: ISubagent[] = [];

    const policyAgent = this.subagents.find(a => a.name === 'PolicyMonitor')!;
    const pathwayAgent = this.subagents.find(a => a.name === 'PathwayCompare')!;
    const evidenceAgent = this.subagents.find(a => a.name === 'EvidenceChecker')!;
    const riskAgent = this.subagents.find(a => a.name === 'RiskAgent')!;
    const citationAgent = this.subagents.find(a => a.name === 'CitationValidator')!;

    // Policy queries
    if (q.includes('change') || q.includes('update') || q.includes('new') || q.includes('recent') || q.includes('policy')) {
      selected.push(policyAgent);
    }

    // Pathway / comparison queries
    if (q.includes('visa') || q.includes('pathway') || q.includes('compare') || q.includes('option') || q.includes('eligible') || q.includes('subclass')) {
      selected.push(pathwayAgent);
    }

    // Evidence / checklist queries
    if (q.includes('document') || q.includes('evidence') || q.includes('checklist') || q.includes('need') || q.includes('require')) {
      selected.push(evidenceAgent);
    }

    // Risk queries
    if (q.includes('risk') || q.includes('refus') || q.includes('overstay') || q.includes('character') || q.includes('condition')) {
      selected.push(riskAgent);
    }

    // Always validate citations
    selected.push(citationAgent);

    // Default: run all agents if no clear match
    if (selected.length === 1) {
      return this.subagents;
    }

    return selected;
  }

  /**
   * Main entry point — orchestrates subagents and returns a response.
   */
  async run(query: AgentQuery): Promise<AgentResponse> {
    const taskId = `task_${Date.now()}_${Math.random().toString(36).slice(2, 8)}`;
    const selected = this.selectSubagents(query);
    const results: SubagentResult[] = [];

    // Run subagents sequentially (can parallelise non-dependent ones)
    for (const agent of selected) {
      try {
        const result = await agent.run({
          query,
          previousResults: results,
        });
        results.push(result);
      } catch (err) {
        results.push({
          agentName: agent.name,
          success: false,
          data: null,
          error: err instanceof Error ? err.message : String(err),
        });
      }
    }

    return this.aggregate(taskId, query, results, selected);
  }

  /**
   * Aggregates subagent results into a final structured response.
   */
  private aggregate(
    taskId: string,
    query: AgentQuery,
    results: SubagentResult[],
    selected: ISubagent[],
  ): AgentResponse {
    const citations = results
      .flatMap(r => (r.data as { citations?: unknown[] })?.citations ?? [])
      .filter(Boolean) as AgentResponse['citations'];

    const riskFlags = results
      .flatMap(r => (r.data as { riskFlags?: unknown[] })?.riskFlags ?? [])
      .filter(Boolean) as AgentResponse['riskFlags'];

    const requiresHumanReview = riskFlags.some(
      f => f.severity === 'critical' || f.type === 'requires_human',
    );

    const answerParts = results
      .filter(r => r.success && (r.data as { answer?: string })?.answer)
      .map(r => (r.data as { answer: string }).answer);

    const answer = answerParts.length > 0
      ? answerParts.join('\n\n')
      : 'I was unable to generate a complete answer for this query. Please consult a registered migration agent.';

    const successCount = results.filter(r => r.success).length;
    const confidenceScore = results.length > 0 ? successCount / results.length : 0;

    return {
      taskId,
      query: query.query,
      answer,
      subagentsInvoked: selected.map(a => a.name),
      citations,
      riskFlags,
      requiresHumanReview,
      confidenceScore,
      timestamp: new Date().toISOString(),
    };
  }
}
