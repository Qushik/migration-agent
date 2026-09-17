# Agent Reference

## Supervisor

**File:** `packages/agents/src/supervisor.ts`

The central orchestrator. Receives `AgentQuery`, selects subagents based on keyword matching of the query string, runs each in sequence passing `previousResults` so later agents (like CitationValidator) can access earlier outputs, and returns an `AgentResponse`.

---

## PolicyMonitor

**File:** `packages/agents/src/subagents/policyMonitor.ts`

Provides structured data about recent Australian migration policy changes. In the current implementation, this returns a curated set of known 2026 changes. In production, wire this to a live ingestion pipeline (legislation.gov.au RSS, Home Affairs news feed, MARA notices).

**Key data it covers:**
- 2026–27 Program settings (185,000 places)
- TSMIT increase to $79,423 (1 July 2026)
- Student visa charge increase to $2,500 (1 July 2026)
- MARA regulatory framework update (1 April 2026)
- Student dependant restrictions (September 2026)
- Overstayer enforcement (September 2026)

---

## PathwayCompare

**File:** `packages/agents/src/subagents/pathwayCompare.ts`

Uses the `VISA_SUBCLASSES` constant in `packages/shared/src/visaTypes.ts` to return structured pros/cons for each supported subclass. Add new subclasses by extending that constant.

**Supported subclasses:** 189, 190, 482, 500, 820

---

## EvidenceChecker

**File:** `packages/agents/src/subagents/evidenceChecker.ts`

Returns a checklist of required documents for each visa subclass. Add or update checklists in the `EVIDENCE_CHECKLISTS` map in the same file.

---

## RiskAgent

**File:** `packages/agents/src/subagents/riskAgent.ts`

Performs both profile-based and query-based risk assessment:
- **Profile checks:** Age ≥45 for points-tested visas, salary below TSMIT, insufficient experience
- **Query checks:** Overstay history, condition 8503, character issues, student dependant restrictions

Any `critical` flag or `requires_human` flag sets `requiresHumanReview: true` in the final response.

---

## CitationValidator

**File:** `packages/agents/src/subagents/citationValidator.ts`

Always runs last. Reads `previousResults` to gather all citations, checks them against `POLICY_SOURCES` for official domain, and flags citations older than `AGENT_CONFIG.citationMaxAgeDays` (90 days).
