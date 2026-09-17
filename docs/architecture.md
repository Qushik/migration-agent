# Architecture

## Overview

This system uses a **Supervisor + Subagent** pattern. The Supervisor receives every user query, selects the appropriate subagents based on query intent, runs them sequentially, and aggregates their results into a single structured response.

## Agent Communication Flow

```
User Query
    │
    ▼
┌──────────────────────────────────────────────┐
│              Supervisor Agent                │
│                                              │
│  1. Parse query intent                       │
│  2. Select subagents                         │
│  3. Run subagents sequentially               │
│  4. Aggregate results + citations + risks    │
│  5. Return AgentResponse                     │
└──────────────────────────────────────────────┘
    │         │         │         │         │
    ▼         ▼         ▼         ▼         ▼
Policy   Pathway   Evidence   Risk    Citation
Monitor  Compare   Checker   Agent   Validator
```

## Subagent Responsibilities

| Subagent | Trigger Keywords | Output |
|---|---|---|  
| PolicyMonitor | change, update, recent, policy | Policy change digest + citations |
| PathwayCompare | visa, pathway, compare, eligible | Pros/cons matrix per subclass |
| EvidenceChecker | document, evidence, checklist, need | Tailored document checklist |
| RiskAgent | risk, refusal, overstay, character | Risk flags, escalation recommendation |
| CitationValidator | (always runs last) | Citation freshness + official source check |

## SubagentResult Schema

```typescript
interface SubagentResult {
  agentName: string;
  success: boolean;
  data: {
    answer: string;
    citations: Citation[];
    riskFlags: RiskFlag[];
    [key: string]: unknown; // agent-specific extras
  };
  error?: string;
}
```

## AgentResponse Schema

```typescript
interface AgentResponse {
  taskId: string;               // unique task ID
  query: string;                // original user query
  answer: string;               // aggregated answer
  subagentsInvoked: string[];   // which agents ran
  citations: Citation[];        // all validated citations
  riskFlags: RiskFlag[];        // all risk flags
  requiresHumanReview: boolean; // true if any critical flag
  confidenceScore: number;      // 0–1
  timestamp: string;            // ISO 8601
}
```
