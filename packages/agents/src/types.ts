import type { AgentQuery, AgentResponse, RiskFlag, Citation } from '@migration-agent/shared';

export interface SubagentResult {
  agentName: string;
  success: boolean;
  data: unknown;
  error?: string;
}

export interface SubagentContext {
  query: AgentQuery;
  previousResults: SubagentResult[];
}

export interface ISubagent {
  name: string;
  description: string;
  run(ctx: SubagentContext): Promise<SubagentResult>;
}

export type { AgentQuery, AgentResponse, RiskFlag, Citation };
