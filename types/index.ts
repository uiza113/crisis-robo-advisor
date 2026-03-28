// ============================================================
// Crisis-Aware Robo-Advisor — Core Types
// ============================================================

// ---- Auth & Users ----
export type UserRole = 'investor' | 'adviser' | 'admin';

export interface User {
  id: string;
  name: string;
  email: string;
  role: UserRole;
  avatarColor: string;
  createdAt: string;
}

// ---- Risk Profile ----
export type RiskCategory = 'conservative' | 'moderate' | 'growth';

export interface QuestionnaireAnswer {
  questionId: string;
  question: string;
  answer: string;
  score: number;
}

export interface RiskProfile {
  id: string;
  userId: string;
  score: number;
  category: RiskCategory;
  timeHorizon: number; // years
  hasEmergencyFund: boolean;
  liquidityNeed: 'none' | 'low' | 'moderate' | 'high';
  lossTolerance: 'low' | 'moderate' | 'high';
  investingKnowledge: 'beginner' | 'intermediate' | 'advanced';
  incomeStability: 'unstable' | 'moderate' | 'stable';
  answers: QuestionnaireAnswer[];
  lastUpdated: string;
}

// ---- Portfolio ----
export interface ETFMetadata {
  ticker: string;
  name: string;
  category: string;
  expenseRatio: number;
  description: string;
  riskLevel: 'low' | 'moderate' | 'high';
  assetClass: string;
}

export interface Holding {
  ticker: string;
  name: string;
  targetWeight: number;
  currentWeight: number;
  drift: number;
  value: number;
  category: string;
}

export interface Portfolio {
  id: string;
  userId: string;
  totalValue: number;
  holdings: Holding[];
  weightedExpenseRatio: number;
  lastRebalanced: string;
  driftStatus: 'within-band' | 'needs-rebalance' | 'crisis-hold';
  createdAt: string;
}

// ---- Market Scenarios ----
export type CrisisSeverity = 'normal' | 'mild' | 'severe' | 'dislocation';

export interface MarketScenario {
  id: string;
  name: string;
  description: string;
  severity: CrisisSeverity;
  drawdown: number; // percentage
  volatilityLevel: number; // VIX-like
  bondEquityCorrelation: number; // -1 to 1
  bidAskSpreadStress: number; // 0 to 1
  isCustom?: boolean;
  historicalAnalogue?: {
    event: string;
    description: string;
    historicalDrawdown: number;
    recoveryMonths: number;
  };
}

// ---- Crisis Assessment ----
export type VulnerabilityClass =
  | 'stable'
  | 'liquidity-sensitive'
  | 'behaviorally-vulnerable'
  | 'profile-mismatch';

export type ActionRecommendation =
  | 'stay'
  | 'rebalance'
  | 'refresh-profile'
  | 'escalate';

export interface CrisisAssessment {
  id: string;
  userId: string;
  scenarioId: string;
  severityClass: CrisisSeverity;
  vulnerabilityClass: VulnerabilityClass;
  actionRecommendation: ActionRecommendation;
  explanations: string[];
  rulesFired: string[];
  timestamp: string;
}

// ---- Crisis Engine Inputs ----
export interface CrisisEngineInput {
  scenario: MarketScenario;
  userProfile: RiskProfile;
  portfolio: Portfolio;
  anxietySignal: number; // 0-10
  withdrawalRequested: boolean;
  questionnaireAgeMonths: number;
}

export interface CrisisEngineOutput {
  severityClass: CrisisSeverity;
  vulnerabilityClass: VulnerabilityClass;
  actionRecommendation: ActionRecommendation;
  explanations: string[];
  rulesFired: string[];
  beforeRecommendation?: string;
  afterRecommendation?: string;
}

// ---- Recommendations ----
export interface Recommendation {
  id: string;
  userId: string;
  action: ActionRecommendation;
  rationale: string;
  triggeredBy: string;
  timestamp: string;
}

// ---- Messages ----
export type MessageType =
  | 'calm-update'
  | 'crisis-explanation'
  | 'fraud-warning'
  | 'liquidity-reminder'
  | 'profile-refresh'
  | 'action-recommendation'
  | 'educational';

export interface Message {
  id: string;
  userId: string;
  type: MessageType;
  title: string;
  content: string;
  read: boolean;
  priority: 'low' | 'medium' | 'high' | 'urgent';
  timestamp: string;
}

// ---- Escalation ----
export type EscalationStatus = 'open' | 'in-progress' | 'resolved' | 'closed';

export interface EscalationCase {
  id: string;
  userId: string;
  userName: string;
  reason: string;
  status: EscalationStatus;
  adviserId?: string;
  notes: string[];
  recentBehavior: string[];
  questionnaireAge: number; // months
  panicSellSignal: boolean;
  liquidityRiskFlag: boolean;
  complianceNotes: string[];
  riskScore: number;
  createdAt: string;
  updatedAt: string;
}

// ---- Audit ----
export interface AuditLogEntry {
  id: string;
  userId: string;
  userName: string;
  action: string;
  detail: string;
  category: 'recommendation' | 'profile-change' | 'escalation' | 'system' | 'auth' | 'crisis';
  timestamp: string;
  performedBy: string;
}

// ---- Compliance ----
export interface ComplianceDisclosure {
  id: string;
  type: string;
  title: string;
  content: string;
  version: string;
  effectiveDate: string;
}

// ---- Onboarding ----
export interface OnboardingQuestion {
  id: string;
  question: string;
  explanation: string;
  options: {
    label: string;
    value: string;
    score: number;
  }[];
}

// ---- FinGuide ----
export interface FinGuideMessage {
  id: string;
  role: 'user' | 'assistant';
  content: string;
  timestamp: string;
}

// ---- App State ----
export interface AppState {
  currentUser: User | null;
  riskProfile: RiskProfile | null;
  portfolio: Portfolio | null;
  activeScenario: MarketScenario;
  crisisAssessment: CrisisAssessment | null;
  messages: Message[];
  escalationCases: EscalationCase[];
  auditLog: AuditLogEntry[];
  finGuideMessages: FinGuideMessage[];
  finGuideOpen: boolean;
  onboardingComplete: boolean;
  // Actions
  setCurrentUser: (user: User | null) => void;
  setRiskProfile: (profile: RiskProfile | null) => void;
  setPortfolio: (portfolio: Portfolio | null) => void;
  setActiveScenario: (scenario: MarketScenario) => void;
  setCrisisAssessment: (assessment: CrisisAssessment | null) => void;
  setMessages: (messages: Message[]) => void;
  addMessage: (message: Message) => void;
  markMessageRead: (id: string) => void;
  setEscalationCases: (cases: EscalationCase[]) => void;
  addAuditEntry: (entry: AuditLogEntry) => void;
  setAuditLog: (log: AuditLogEntry[]) => void;
  addFinGuideMessage: (msg: FinGuideMessage) => void;
  toggleFinGuide: () => void;
  setOnboardingComplete: (val: boolean) => void;
}
