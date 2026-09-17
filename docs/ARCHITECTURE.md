# Architecture — Migration Intelligence Agent

## Overview

The system follows a **Supervisor + Subagents** pattern:

1. A user question arrives at the API.
2. The **Supervisor Agent** analyses the question and decides which subagents to run.
3. Selected subagents run **in parallel**.
4. The Supervisor collects results, determines risk level, and synthesises a final answer.
5. The answer includes citations, a risk flag, and a disclaimer.

## Subagent Responsibilities

| Agent | Input | Output |
|-------|-------|--------|
| `policy-monitor` | Question text | Recent relevant policy changes with citations |
| `pathway-compare` | Question + applicant context | Visa pathway analysis with pros/cons |
| `evidence-checklist` | Question (must mention subclass) | Mandatory/optional document list |
| `risk-escalate` | Question + applicant context | Risk flags, escalation recommendation |
| `citation-validate` | Question | Verified official source citations |

## Data Flow

```
HTTP POST /api/query
        │
        ▼
   SupervisorRequest
        │
        ▼
   planTasks() → determines which subagents to run
        │
        ▼
   runSubagentsInParallel() → Promise.all()
        │
   ┌────┴─────────────────────────────────────┐
   │        │          │         │            │
policy  pathway   evidence    risk      citation
monitor compare  checklist  escalate   validate
   │        │          │         │            │
   └────────┴──────────┴─────────┴────────────┘
        │
        ▼
   synthesiseAnswer() → merges subagent summaries
        │
        ▼
   SupervisorResponse (with citations, risk, disclaimer)
```

## Adding a New Subagent

1. Create `packages/agents/my-new-agent.ts`
2. Export `runMyNewAgent(request: SupervisorRequest): Promise<AgentResult>`
3. Add it to `packages/agents/index.ts`
4. Add it to the `runners` map in `supervisor.ts`
5. Add logic to `planTasks()` for when to trigger it
6. Add a route in `apps/api/src/routes/` if needed

## Production Enhancements (Phase 2)

- Replace hardcoded policy data with a **Postgres database + scheduled scraper**
- Add **vector retrieval (Pinecone/pgvector)** for semantic search over policy documents
- Integrate **OpenAI GPT-4o** for dynamic answer generation beyond templates
- Add **user authentication** and session history
- Add **audit logging** for compliance
- Deploy on **Railway / Fly.io / AWS**
