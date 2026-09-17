// ============================================================
// Migration Agent — Shared Types
// ============================================================

export type AgentName =
  | 'supervisor'
  | 'policy-monitor'
  | 'pathway-compare'
  | 'evidence-checklist'
  | 'risk-escalate'
  | 'citation-validate';

export type VisaCategory =
  | 'skilled-independent'
  | 'employer-sponsored'
  | 'family'
  | 'student'
  | 'visitor'
  | 'humanitarian'
  | 'business-innovation';

export type RiskLevel = 'low' | 'medium' | 'high' | 'critical';

// ─── Agent Task ───────────────────────────────────────────
export interface AgentTask {
  id: string;
  agentName: AgentName;
  input: Record<string, unknown>;
  status: 'pending' | 'running' | 'done' | 'error';
  result?: AgentResult;
  error?: string;
  durationMs?: number;
}

// ─── Agent Result ─────────────────────────────────────────
export interface AgentResult {
  summary: string;
  details: string;
  citations: Citation[];
  riskLevel?: RiskLevel;
  requiresHumanReview: boolean;
  metadata?: Record<string, unknown>;
}

// ─── Citation ─────────────────────────────────────────────
export interface Citation {
  title: string;
  source: string;        // e.g. 'Home Affairs', 'MARA', 'Migration Act 1958'
  url?: string;
  dateAccessed: string;  // ISO date
  relevance: string;     // one-line note on what it supports
}

// ─── Supervisor Request/Response ──────────────────────────
export interface SupervisorRequest {
  question: string;
  context?: ApplicantContext;
  sessionId?: string;
}

export interface SupervisorResponse {
  sessionId: string;
  question: string;
  answer: string;
  subagentResults: Record<AgentName, AgentResult | null>;
  citations: Citation[];
  riskLevel: RiskLevel;
  requiresHumanReview: boolean;
  disclaimer: string;
  processingMs: number;
}

// ─── Applicant Context ────────────────────────────────────
export interface ApplicantContext {
  nationality?: string;
  currentVisaSubclass?: string;
  occupation?: string;
  yearsInAustralia?: number;
  annualSalary?: number;
  hasEmployerSponsorship?: boolean;
  familyMembers?: number;
  ageYears?: number;
  englishLevel?: 'functional' | 'vocational' | 'competent' | 'proficient' | 'superior';
}

// ─── Policy Update ────────────────────────────────────────
export interface PolicyUpdate {
  id: string;
  title: string;
  summary: string;
  effectiveDate: string;
  source: string;
  url: string;
  affectedVisas: string[];
  changeType: 'new-policy' | 'amendment' | 'fee-change' | 'threshold-change' | 'program-setting';
  severity: 'minor' | 'moderate' | 'major';
  fetchedAt: string;
}

// ─── Visa Pathway ─────────────────────────────────────────
export interface VisaPathway {
  subclass: string;
  name: string;
  category: VisaCategory;
  processingTime: string;
  cost: number;
  pros: string[];
  cons: string[];
  eligibilityRequirements: string[];
  leadsToPR: boolean;
  annualCap?: number;
  currentDemand: 'low' | 'moderate' | 'high' | 'very-high';
}

// ─── Evidence Checklist ───────────────────────────────────
export interface EvidenceItem {
  category: string;
  item: string;
  mandatory: boolean;
  notes?: string;
  officialRef?: string;
}

export interface EvidenceChecklist {
  visaSubclass: string;
  items: EvidenceItem[];
  warnings: string[];
  generatedAt: string;
}
