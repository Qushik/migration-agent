export interface PolicyChange {
  id: string;
  date: string; // ISO 8601
  title: string;
  summary: string;
  affectedSubclasses: string[];
  severity: 'info' | 'moderate' | 'major';
  sourceUrl: string;
  sourceAuthority: string;
}

export interface AgentQuery {
  query: string;
  visaSubclass?: string;
  userProfile?: UserProfile;
  sessionId?: string;
}

export interface UserProfile {
  age?: number;
  occupation?: string;
  anzscoCode?: string;
  englishLevel?: 'functional' | 'vocational' | 'competent' | 'proficient' | 'superior';
  salaryAUD?: number;
  yearsExperience?: number;
  hasEmployer?: boolean;
  statePreference?: string;
  familyMembers?: number;
}

export interface AgentResponse {
  taskId: string;
  query: string;
  answer: string;
  subagentsInvoked: string[];
  citations: Citation[];
  riskFlags: RiskFlag[];
  requiresHumanReview: boolean;
  confidenceScore: number; // 0-1
  timestamp: string;
}

export interface Citation {
  text: string;
  sourceUrl: string;
  sourceAuthority: string;
  dateAccessed: string;
  isOfficial: boolean;
}

export interface RiskFlag {
  type: 'high_refusal_risk' | 'missing_evidence' | 'policy_changed' | 'requires_human' | 'stale_info';
  message: string;
  severity: 'low' | 'medium' | 'high' | 'critical';
}
