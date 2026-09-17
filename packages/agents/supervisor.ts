// ============================================================
// SUPERVISOR AGENT
// Orchestrates all subagents and synthesises the final answer
// ============================================================

import type {
  AgentTask,
  AgentResult,
  AgentName,
  SupervisorRequest,
  SupervisorResponse,
  RiskLevel,
} from '../shared/types';
import { runPolicyMonitor } from './policy-monitor';
import { runPathwayCompare } from './pathway-compare';
import { runEvidenceChecklist } from './evidence-checklist';
import { runRiskEscalate } from './risk-escalate';
import { runCitationValidate } from './citation-validate';

const DISCLAIMER =
  'This response provides general migration information only. It is NOT registered migration advice. ' +
  'Always consult a MARA-registered migration agent (www.mara.gov.au) for personalised advice. ' +
  'Policy information is sourced from official Australian Government publications and is subject to change.';

/**
 * Main entry point. Call this to process a migration question.
 */
export async function runSupervisor(
  request: SupervisorRequest,
): Promise<SupervisorResponse> {
  const start = Date.now();
  const sessionId = request.sessionId ?? crypto.randomUUID();

  console.log(`[Supervisor] Starting session ${sessionId}`);
  console.log(`[Supervisor] Question: ${request.question}`);

  // ── Step 1: Plan which subagents are needed ──────────────
  const plan = planTasks(request);
  console.log(`[Supervisor] Running subagents: ${plan.join(', ')}`);

  // ── Step 2: Run subagents in parallel ────────────────────
  const tasks = await runSubagentsInParallel(request, plan);

  // ── Step 3: Collect results ───────────────────────────────
  const subagentResults = collectResults(tasks);

  // ── Step 4: Validate citations ────────────────────────────
  const allCitations = Object.values(subagentResults)
    .filter(Boolean)
    .flatMap((r) => r!.citations);

  // ── Step 5: Determine overall risk level ─────────────────
  const riskLevel = determineRiskLevel(subagentResults);
  const requiresHumanReview =
    riskLevel === 'high' || riskLevel === 'critical' ||
    Object.values(subagentResults).some((r) => r?.requiresHumanReview);

  // ── Step 6: Synthesise final answer ──────────────────────
  const answer = synthesiseAnswer(request.question, subagentResults, riskLevel);

  return {
    sessionId,
    question: request.question,
    answer,
    subagentResults,
    citations: deduplicateCitations(allCitations),
    riskLevel,
    requiresHumanReview,
    disclaimer: DISCLAIMER,
    processingMs: Date.now() - start,
  };
}

// ── Task Planning ────────────────────────────────────────────
function planTasks(request: SupervisorRequest): AgentName[] {
  const q = request.question.toLowerCase();
  const tasks: AgentName[] = ['policy-monitor', 'citation-validate'];

  if (/visa|subclass|pathway|apply|application|eligible|eligib/.test(q)) {
    tasks.push('pathway-compare');
  }
  if (/document|evidence|checklist|need to provide|what do i need/.test(q)) {
    tasks.push('evidence-checklist');
  }
  if (/risk|refuse|reject|problem|concern|overstay|character|health|ban/.test(q)) {
    tasks.push('risk-escalate');
  }
  // Always run risk if pathway is involved
  if (tasks.includes('pathway-compare') && !tasks.includes('risk-escalate')) {
    tasks.push('risk-escalate');
  }

  return [...new Set(tasks)];
}

// ── Parallel Execution ───────────────────────────────────────
async function runSubagentsInParallel(
  request: SupervisorRequest,
  plan: AgentName[],
): Promise<AgentTask[]> {
  const runners: Record<AgentName, (r: SupervisorRequest) => Promise<AgentResult>> = {
    'supervisor': async () => { throw new Error('Cannot call supervisor recursively'); },
    'policy-monitor': runPolicyMonitor,
    'pathway-compare': runPathwayCompare,
    'evidence-checklist': runEvidenceChecklist,
    'risk-escalate': runRiskEscalate,
    'citation-validate': runCitationValidate,
  };

  const taskPromises = plan.map(async (agentName): Promise<AgentTask> => {
    const taskStart = Date.now();
    const task: AgentTask = {
      id: crypto.randomUUID(),
      agentName,
      input: { question: request.question, context: request.context },
      status: 'running',
    };

    try {
      const result = await runners[agentName](request);
      return { ...task, status: 'done', result, durationMs: Date.now() - taskStart };
    } catch (err) {
      console.error(`[${agentName}] Error:`, err);
      return {
        ...task,
        status: 'error',
        error: err instanceof Error ? err.message : String(err),
        durationMs: Date.now() - taskStart,
      };
    }
  });

  return Promise.all(taskPromises);
}

// ── Result Helpers ───────────────────────────────────────────
function collectResults(
  tasks: AgentTask[],
): Record<AgentName, AgentResult | null> {
  const results: Partial<Record<AgentName, AgentResult | null>> = {};
  for (const task of tasks) {
    results[task.agentName] = task.result ?? null;
  }
  return results as Record<AgentName, AgentResult | null>;
}

function determineRiskLevel(
  results: Record<AgentName, AgentResult | null>,
): RiskLevel {
  const levels = Object.values(results)
    .filter(Boolean)
    .map((r) => r!.riskLevel)
    .filter(Boolean);

  if (levels.includes('critical')) return 'critical';
  if (levels.includes('high')) return 'high';
  if (levels.includes('medium')) return 'medium';
  return 'low';
}

function deduplicateCitations(
  citations: import('../shared/types').Citation[],
) {
  const seen = new Set<string>();
  return citations.filter((c) => {
    const key = c.url ?? c.source + c.title;
    if (seen.has(key)) return false;
    seen.add(key);
    return true;
  });
}

// ── Answer Synthesis ─────────────────────────────────────────
function synthesiseAnswer(
  question: string,
  results: Record<AgentName, AgentResult | null>,
  riskLevel: RiskLevel,
): string {
  const parts: string[] = [];

  const policy = results['policy-monitor'];
  const pathway = results['pathway-compare'];
  const evidence = results['evidence-checklist'];
  const risk = results['risk-escalate'];

  if (policy?.summary) parts.push(`**Policy Context**\n${policy.summary}`);
  if (pathway?.summary) parts.push(`**Pathway Analysis**\n${pathway.summary}`);
  if (evidence?.summary) parts.push(`**Evidence Required**\n${evidence.summary}`);
  if (risk?.summary) {
    const prefix = riskLevel === 'high' || riskLevel === 'critical'
      ? '⚠️ **Risk & Escalation (Human Review Recommended)**'
      : '**Risk Assessment**';
    parts.push(`${prefix}\n${risk.summary}`);
  }

  return parts.join('\n\n') || 'Unable to generate a complete response. Please consult a registered migration agent.';
}
