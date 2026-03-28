// ============================================================
// Seed Data — Users, ETFs, Scenarios, Portfolios, Messages, etc.
// ============================================================
import {
  User, ETFMetadata, MarketScenario, Portfolio, RiskProfile,
  Message, EscalationCase, AuditLogEntry, ComplianceDisclosure,
  OnboardingQuestion, Holding,
} from '@/types';

// ---- Users ----
export const SEED_USERS: User[] = [
  {
    id: 'user-alex',
    name: 'Alex Chen',
    email: 'alex@demo.com',
    role: 'investor',
    avatarColor: '#6366f1',
    createdAt: '2025-06-15T10:00:00Z',
  },
  {
    id: 'user-jordan',
    name: 'Jordan Lee',
    email: 'jordan@demo.com',
    role: 'investor',
    avatarColor: '#f59e0b',
    createdAt: '2025-04-20T10:00:00Z',
  },
  {
    id: 'user-sam',
    name: 'Sam Rivera',
    email: 'sam@demo.com',
    role: 'investor',
    avatarColor: '#10b981',
    createdAt: '2025-09-01T10:00:00Z',
  },
  {
    id: 'user-morgan',
    name: 'Morgan Taylor',
    email: 'morgan@demo.com',
    role: 'adviser',
    avatarColor: '#8b5cf6',
    createdAt: '2024-01-01T10:00:00Z',
  },
  {
    id: 'user-casey',
    name: 'Casey Admin',
    email: 'casey@demo.com',
    role: 'admin',
    avatarColor: '#ef4444',
    createdAt: '2024-01-01T10:00:00Z',
  },
];

// ---- ETF Metadata ----
export const ETF_DATA: ETFMetadata[] = [
  {
    ticker: 'VT',
    name: 'Vanguard Total World Stock ETF',
    category: 'Global Equity',
    expenseRatio: 0.0007,
    description:
      'Provides broad exposure to global equity markets, including developed and emerging markets. Holdings span thousands of stocks worldwide.',
    riskLevel: 'high',
    assetClass: 'Equity',
  },
  {
    ticker: 'BND',
    name: 'Vanguard Total Bond Market ETF',
    category: 'US Aggregate Bond',
    expenseRatio: 0.0003,
    description:
      'Tracks the Bloomberg U.S. Aggregate Float Adjusted Index, providing broad exposure to U.S. investment-grade bonds.',
    riskLevel: 'low',
    assetClass: 'Fixed Income',
  },
  {
    ticker: 'BNDX',
    name: 'Vanguard Total International Bond ETF',
    category: 'International Bond',
    expenseRatio: 0.0007,
    description:
      'Provides exposure to non-U.S. investment-grade bonds, hedged against currency fluctuations for U.S.-dollar investors.',
    riskLevel: 'low',
    assetClass: 'Fixed Income',
  },
  {
    ticker: 'VTIP',
    name: 'Vanguard Short-Term Inflation-Protected Securities ETF',
    category: 'Inflation-Protected Bond',
    expenseRatio: 0.0004,
    description:
      'Invests in short-term U.S. Treasury Inflation-Protected Securities (TIPS), providing a hedge against unexpected inflation.',
    riskLevel: 'low',
    assetClass: 'Fixed Income',
  },
  {
    ticker: 'VNQ',
    name: 'Vanguard Real Estate ETF',
    category: 'REIT',
    expenseRatio: 0.0012,
    description:
      'Provides diversified exposure to U.S. real estate investment trusts (REITs), which own and operate commercial real estate.',
    riskLevel: 'moderate',
    assetClass: 'Real Estate',
  },
];

// ---- Target Allocation ----
export const TARGET_ALLOCATION: Record<string, number> = {
  VT: 55,
  BND: 20,
  BNDX: 10,
  VTIP: 10,
  VNQ: 5,
};

// ---- Market Scenarios ----
export const MARKET_SCENARIOS: MarketScenario[] = [
  {
    id: 'scenario-normal',
    name: 'Normal Market',
    description: 'Markets operate within typical ranges. Volatility is low, spreads are tight, and correlations behave as expected.',
    severity: 'normal',
    drawdown: 2,
    volatilityLevel: 12,
    bondEquityCorrelation: -0.3,
    bidAskSpreadStress: 0.1,
  },
  {
    id: 'scenario-mild',
    name: 'Elevated Volatility',
    description: 'Markets show increased turbulence. A correction of 10% with VIX rising to 28. Bond-equity diversification still functioning.',
    severity: 'mild',
    drawdown: 10,
    volatilityLevel: 28,
    bondEquityCorrelation: -0.1,
    bidAskSpreadStress: 0.3,
    historicalAnalogue: {
      event: '2018 Trade War Selloff',
      description: 'Late 2018 saw a near-20% plunge driven by rate hike fears and tariff escalations.',
      historicalDrawdown: 19.8,
      recoveryMonths: 4,
    }
  },
  {
    id: 'scenario-severe',
    name: 'Severe Global Financial Crisis',
    description: 'Major market stress similar to 2008 or 2020 Covid crash. Equities down 25%, volatility extremely elevated, correlations shifting.',
    severity: 'severe',
    drawdown: 25,
    volatilityLevel: 45,
    bondEquityCorrelation: 0.4,
    bidAskSpreadStress: 0.6,
    historicalAnalogue: {
      event: '2020 Pandemic Flash Crash',
      description: 'The S&P 500 plunged 34% in 33 days as global lockdowns began, causing massive panic selloffs.',
      historicalDrawdown: 33.9,
      recoveryMonths: 6,
    }
  },
  {
    id: 'scenario-dislocation',
    name: 'Liquidity Stress / Market Dislocation',
    description: 'Extreme stress: markets down 35%+, bond-equity correlations broken, bid-ask spreads at crisis levels. Liquidity severely impaired.',
    severity: 'dislocation',
    drawdown: 38,
    volatilityLevel: 65,
    bondEquityCorrelation: 0.85,
    bidAskSpreadStress: 0.9,
    historicalAnalogue: {
      event: '2008 Global Financial Crisis',
      description: 'A systemic banking failure caused credit markets to freeze. VIX hit 80+ and equities essentially halved.',
      historicalDrawdown: 56.8,
      recoveryMonths: 48,
    }
  },
];

// ---- Helper: build holdings with drift ----
function buildHoldings(
  scenario: 'normal' | 'mild' | 'severe' | 'dislocation',
  totalValue: number
): Holding[] {
  // Simulate drift based on scenario
  const driftMap: Record<string, Record<string, number>> = {
    normal: { VT: 56, BND: 20, BNDX: 10, VTIP: 9.5, VNQ: 4.5 },
    mild: { VT: 50, BND: 23, BNDX: 11, VTIP: 11, VNQ: 5 },
    severe: { VT: 44, BND: 26, BNDX: 12, VTIP: 13, VNQ: 5 },
    dislocation: { VT: 38, BND: 28, BNDX: 14, VTIP: 15, VNQ: 5 },
  };

  const currentWeights = driftMap[scenario];

  return ETF_DATA.map((etf) => ({
    ticker: etf.ticker,
    name: etf.name,
    targetWeight: TARGET_ALLOCATION[etf.ticker],
    currentWeight: currentWeights[etf.ticker],
    drift: +(currentWeights[etf.ticker] - TARGET_ALLOCATION[etf.ticker]).toFixed(1),
    value: +((currentWeights[etf.ticker] / 100) * totalValue).toFixed(2),
    category: etf.category,
  }));
}

// ---- Risk Profiles ----
export const SEED_RISK_PROFILES: RiskProfile[] = [
  {
    id: 'rp-alex',
    userId: 'user-alex',
    score: 52,
    category: 'moderate',
    timeHorizon: 15,
    hasEmergencyFund: true,
    liquidityNeed: 'low',
    lossTolerance: 'moderate',
    investingKnowledge: 'intermediate',
    incomeStability: 'stable',
    answers: [],
    lastUpdated: '2025-12-01T10:00:00Z',
  },
  {
    id: 'rp-jordan',
    userId: 'user-jordan',
    score: 45,
    category: 'moderate',
    timeHorizon: 10,
    hasEmergencyFund: true,
    liquidityNeed: 'low',
    lossTolerance: 'low',
    investingKnowledge: 'beginner',
    incomeStability: 'moderate',
    answers: [],
    lastUpdated: '2025-03-01T10:00:00Z',
  },
  {
    id: 'rp-sam',
    userId: 'user-sam',
    score: 48,
    category: 'moderate',
    timeHorizon: 8,
    hasEmergencyFund: false,
    liquidityNeed: 'high',
    lossTolerance: 'moderate',
    investingKnowledge: 'intermediate',
    incomeStability: 'unstable',
    answers: [],
    lastUpdated: '2025-10-15T10:00:00Z',
  },
];

// ---- Portfolios ----
export const SEED_PORTFOLIOS: Portfolio[] = [
  {
    id: 'pf-alex',
    userId: 'user-alex',
    totalValue: 125000,
    holdings: buildHoldings('normal', 125000),
    weightedExpenseRatio: 0.00058,
    lastRebalanced: '2025-11-15T10:00:00Z',
    driftStatus: 'within-band',
    createdAt: '2025-06-15T10:00:00Z',
  },
  {
    id: 'pf-jordan',
    userId: 'user-jordan',
    totalValue: 85000,
    holdings: buildHoldings('mild', 85000),
    weightedExpenseRatio: 0.00058,
    lastRebalanced: '2025-09-01T10:00:00Z',
    driftStatus: 'needs-rebalance',
    createdAt: '2025-04-20T10:00:00Z',
  },
  {
    id: 'pf-sam',
    userId: 'user-sam',
    totalValue: 45000,
    holdings: buildHoldings('severe', 45000),
    weightedExpenseRatio: 0.00058,
    lastRebalanced: '2025-08-01T10:00:00Z',
    driftStatus: 'crisis-hold',
    createdAt: '2025-09-01T10:00:00Z',
  },
];

// ---- Messages ----
export const SEED_MESSAGES: Message[] = [
  {
    id: 'msg-1',
    userId: 'user-alex',
    type: 'calm-update',
    title: 'Monthly Portfolio Review',
    content: 'Your portfolio is performing within expected ranges. Your allocation remains close to target with minor drift. No action needed at this time.',
    read: false,
    priority: 'low',
    timestamp: '2026-03-15T09:00:00Z',
  },
  {
    id: 'msg-2',
    userId: 'user-alex',
    type: 'educational',
    title: 'Understanding Diversification',
    content: 'Diversification spreads your investments across different asset classes. This may help reduce concentration risk, but it does not eliminate losses. Your portfolio holds 5 ETFs across equities, bonds, inflation-protected securities, and real estate.',
    read: true,
    priority: 'low',
    timestamp: '2026-03-10T09:00:00Z',
  },
  {
    id: 'msg-3',
    userId: 'user-jordan',
    type: 'crisis-explanation',
    title: 'Market Volatility Update',
    content: 'Market stress is elevated. Before changing your portfolio, review your time horizon, cash needs, and risk tolerance. Historically, markets have recovered from corrections, but timing and magnitude are uncertain. If your circumstances have changed, consider updating your profile.',
    read: false,
    priority: 'high',
    timestamp: '2026-03-20T09:00:00Z',
  },
  {
    id: 'msg-4',
    userId: 'user-jordan',
    type: 'fraud-warning',
    title: '⚠️ Scam Alert During Market Stress',
    content: 'During periods of market volatility, scam attempts increase. Never share your account credentials, and be cautious of unsolicited investment offers promising guaranteed returns. This platform will never ask for your password via email or message.',
    read: false,
    priority: 'urgent',
    timestamp: '2026-03-21T09:00:00Z',
  },
  {
    id: 'msg-5',
    userId: 'user-sam',
    type: 'liquidity-reminder',
    title: 'Liquidity Check Recommended',
    content: 'Your profile indicates a high liquidity need, but your emergency fund status shows limited reserves. We recommend reviewing your cash needs before making portfolio changes. If your financial situation has changed, please update your profile or request human support.',
    read: false,
    priority: 'high',
    timestamp: '2026-03-18T09:00:00Z',
  },
  {
    id: 'msg-6',
    userId: 'user-sam',
    type: 'profile-refresh',
    title: 'Time to Review Your Risk Profile',
    content: 'It has been several months since your last risk assessment. Life circumstances can change — job status, family needs, financial goals. Keeping your profile current helps ensure the portfolio illustration reflects your situation.',
    read: false,
    priority: 'medium',
    timestamp: '2026-03-19T09:00:00Z',
  },
];

// ---- Escalation Cases ----
export const SEED_ESCALATIONS: EscalationCase[] = [
  {
    id: 'esc-1',
    userId: 'user-jordan',
    userName: 'Jordan Lee',
    reason: 'Behavioral vulnerability — elevated anxiety signals during market correction. User attempted to liquidate entire portfolio.',
    status: 'open',
    adviserId: undefined,
    notes: ['System detected panic sell signal on 2026-03-20'],
    recentBehavior: [
      'Logged in 12 times in 2 hours',
      'Attempted full portfolio liquidation',
      'Viewed crisis page 8 times',
    ],
    questionnaireAge: 12,
    panicSellSignal: true,
    liquidityRiskFlag: false,
    complianceNotes: ['Auto-escalated by crisis engine rule BE-001'],
    riskScore: 45,
    createdAt: '2026-03-20T11:00:00Z',
    updatedAt: '2026-03-20T11:00:00Z',
  },
  {
    id: 'esc-2',
    userId: 'user-sam',
    userName: 'Sam Rivera',
    reason: 'Liquidity risk — user has high liquidity need with no emergency fund. Withdrawal requested during severe market stress.',
    status: 'in-progress',
    adviserId: 'user-morgan',
    notes: [
      'System detected liquidity risk on 2026-03-18',
      'Adviser Morgan reviewing case — scheduled callback for 2026-03-22',
    ],
    recentBehavior: [
      'Requested $15,000 withdrawal',
      'Updated liquidity need to "high"',
      'Viewed liquidity reminder message',
    ],
    questionnaireAge: 5,
    panicSellSignal: false,
    liquidityRiskFlag: true,
    complianceNotes: ['Auto-escalated by crisis engine rule LQ-002', 'Adviser assigned 2026-03-19'],
    riskScore: 48,
    createdAt: '2026-03-18T14:00:00Z',
    updatedAt: '2026-03-19T09:00:00Z',
  },
];

// ---- Audit Log ----
export const SEED_AUDIT_LOG: AuditLogEntry[] = [
  {
    id: 'audit-1',
    userId: 'user-alex',
    userName: 'Alex Chen',
    action: 'Profile Created',
    detail: 'Risk profile created with score 52 (moderate). Time horizon: 15 years.',
    category: 'profile-change',
    timestamp: '2025-06-15T10:05:00Z',
    performedBy: 'system',
  },
  {
    id: 'audit-2',
    userId: 'user-alex',
    userName: 'Alex Chen',
    action: 'Portfolio Recommendation',
    detail: 'Initial moderate-risk portfolio recommended: VT 55%, BND 20%, BNDX 10%, VTIP 10%, VNQ 5%.',
    category: 'recommendation',
    timestamp: '2025-06-15T10:06:00Z',
    performedBy: 'system',
  },
  {
    id: 'audit-3',
    userId: 'user-jordan',
    userName: 'Jordan Lee',
    action: 'Crisis Assessment',
    detail: 'Scenario "Elevated Volatility" triggered. Severity: mild. Vulnerability: behaviorally-vulnerable. Action: escalate.',
    category: 'crisis',
    timestamp: '2026-03-20T11:00:00Z',
    performedBy: 'crisis-engine',
  },
  {
    id: 'audit-4',
    userId: 'user-jordan',
    userName: 'Jordan Lee',
    action: 'Escalation Created',
    detail: 'Case ESC-1 created. Reason: panic sell signal during market correction.',
    category: 'escalation',
    timestamp: '2026-03-20T11:01:00Z',
    performedBy: 'crisis-engine',
  },
  {
    id: 'audit-5',
    userId: 'user-sam',
    userName: 'Sam Rivera',
    action: 'Escalation Created',
    detail: 'Case ESC-2 created. Reason: high liquidity need, no emergency fund, withdrawal requested.',
    category: 'escalation',
    timestamp: '2026-03-18T14:01:00Z',
    performedBy: 'crisis-engine',
  },
  {
    id: 'audit-6',
    userId: 'user-sam',
    userName: 'Sam Rivera',
    action: 'Adviser Assigned',
    detail: 'Morgan Taylor assigned to case ESC-2.',
    category: 'escalation',
    timestamp: '2026-03-19T09:00:00Z',
    performedBy: 'user-morgan',
  },
  {
    id: 'audit-7',
    userId: 'system',
    userName: 'System',
    action: 'Market Scenario Update',
    detail: 'Market scenario changed to "Elevated Volatility" for simulation.',
    category: 'system',
    timestamp: '2026-03-20T08:00:00Z',
    performedBy: 'system',
  },
];

// ---- Compliance Disclosures ----
export const COMPLIANCE_DISCLOSURES: ComplianceDisclosure[] = [
  {
    id: 'disc-1',
    type: 'educational-use',
    title: 'Educational Use Disclaimer',
    content: 'This application is an educational fintech demonstration. It does not provide personal investment advice, does not manage real money, and is not registered as an investment adviser with any regulatory authority. All portfolio allocations shown are conceptual illustrations for educational purposes only.',
    version: '1.0',
    effectiveDate: '2025-01-01',
  },
  {
    id: 'disc-2',
    type: 'no-advice',
    title: 'No Investment Advice Notice',
    content: 'Nothing in this application constitutes a recommendation, solicitation, or offer to buy or sell any securities or investment products. The portfolio allocations, risk assessments, and crisis recommendations shown are conceptual examples and should not be relied upon for making actual investment decisions.',
    version: '1.0',
    effectiveDate: '2025-01-01',
  },
  {
    id: 'disc-3',
    type: 'model-limitations',
    title: 'Model Limitations',
    content: 'The crisis engine, risk scoring model, and rebalancing rules used in this application are simplified educational models. They do not capture the full complexity of financial markets, individual circumstances, tax implications, or regulatory requirements. Real-world robo-advisors use more sophisticated models subject to regulatory oversight.',
    version: '1.0',
    effectiveDate: '2025-01-01',
  },
  {
    id: 'disc-4',
    type: 'market-risk',
    title: 'Market Risk Disclosure',
    content: 'All investments involve risk, including the possible loss of principal. Past performance does not guarantee future results. Diversification does not ensure a profit or protect against a loss. The value of investments can go down as well as up, and you may get back less than you invest.',
    version: '1.0',
    effectiveDate: '2025-01-01',
  },
  {
    id: 'disc-5',
    type: 'etf-risk',
    title: 'ETF Risk Disclosure',
    content: 'ETFs are subject to market risk, including the possible loss of principal. ETFs trade like stocks, are subject to investment risk, and will fluctuate in value. The risks of owning an ETF generally reflect the risks of owning the underlying securities they are designed to track.',
    version: '1.0',
    effectiveDate: '2025-01-01',
  },
  {
    id: 'disc-6',
    type: 'crisis-limitations',
    title: 'Crisis Mode Limitations',
    content: 'The crisis simulation feature uses simplified scenarios for educational purposes. Real market crises are complex, unpredictable events that may not match any predefined scenario. The crisis engine\'s recommendations are rule-based educational outputs, not actionable financial advice.',
    version: '1.0',
    effectiveDate: '2025-01-01',
  },
  {
    id: 'disc-7',
    type: 'human-oversight',
    title: 'Human Oversight Disclosure',
    content: 'This application includes a simulated human escalation workflow. In a real robo-advisory service, human oversight is essential for complex situations, regulatory compliance, and protection of investors — especially those who may be vulnerable during market stress.',
    version: '1.0',
    effectiveDate: '2025-01-01',
  },
  {
    id: 'disc-8',
    type: 'privacy',
    title: 'Privacy and Data Use Notice',
    content: 'This demo application stores data locally and does not transmit personal information to external services. In a production environment, a robo-advisor must comply with applicable data protection regulations, including data minimization, purpose limitation, and user consent requirements.',
    version: '1.0',
    effectiveDate: '2025-01-01',
  },
  {
    id: 'disc-9',
    type: 'explainability',
    title: 'Explainability Statement',
    content: 'All recommendations in this application are generated by transparent, rule-based logic. Every recommendation includes an explanation of which rules were triggered and why. There are no black-box algorithms. Users can inspect the full decision logic at any time.',
    version: '1.0',
    effectiveDate: '2025-01-01',
  },
];

// ---- Onboarding Questions ----
export const ONBOARDING_QUESTIONS: OnboardingQuestion[] = [
  {
    id: 'q-horizon',
    question: 'What is your investment time horizon?',
    explanation: 'Your time horizon affects how much short-term volatility you can afford to ride out. Longer horizons generally allow for more growth-oriented allocations.',
    options: [
      { label: 'Less than 3 years', value: 'short', score: 5 },
      { label: '3–5 years', value: 'medium-short', score: 15 },
      { label: '5–10 years', value: 'medium', score: 30 },
      { label: '10–20 years', value: 'long', score: 45 },
      { label: 'More than 20 years', value: 'very-long', score: 60 },
    ],
  },
  {
    id: 'q-emergency',
    question: 'Do you have an emergency fund covering 3–6 months of expenses?',
    explanation: 'An emergency fund helps ensure you won\'t need to sell investments at a loss to cover unexpected expenses.',
    options: [
      { label: 'No, I do not have an emergency fund', value: 'none', score: 0 },
      { label: 'I have less than 3 months saved', value: 'partial', score: 5 },
      { label: 'Yes, I have 3–6 months saved', value: 'adequate', score: 12 },
      { label: 'Yes, I have more than 6 months saved', value: 'strong', score: 15 },
    ],
  },
  {
    id: 'q-liquidity',
    question: 'How likely are you to need a large portion of this money within the next 12 months?',
    explanation: 'If you may need to withdraw funds soon, a more conservative allocation may be appropriate to reduce the risk of selling at a loss.',
    options: [
      { label: 'Very likely — I expect to need it', value: 'high', score: 0 },
      { label: 'Somewhat likely', value: 'moderate', score: 5 },
      { label: 'Unlikely', value: 'low', score: 10 },
      { label: 'Very unlikely — this is long-term money', value: 'none', score: 15 },
    ],
  },
  {
    id: 'q-loss',
    question: 'If your portfolio dropped 20% in a month, what would you do?',
    explanation: 'Your reaction to losses reveals your emotional risk tolerance, which is just as important as your financial capacity for risk.',
    options: [
      { label: 'Sell everything to prevent further losses', value: 'sell-all', score: 0 },
      { label: 'Sell some to reduce exposure', value: 'sell-some', score: 8 },
      { label: 'Do nothing and wait for recovery', value: 'hold', score: 18 },
      { label: 'Buy more at lower prices', value: 'buy-more', score: 25 },
    ],
  },
  {
    id: 'q-knowledge',
    question: 'How would you describe your investing knowledge?',
    explanation: 'Understanding your familiarity with investing helps calibrate the complexity of the portfolio and the level of educational support provided.',
    options: [
      { label: 'Beginner — I\'m new to investing', value: 'beginner', score: 3 },
      { label: 'Intermediate — I understand basic concepts', value: 'intermediate', score: 8 },
      { label: 'Advanced — I\'m very comfortable with financial markets', value: 'advanced', score: 12 },
    ],
  },
  {
    id: 'q-income',
    question: 'How stable is your current income?',
    explanation: 'Stable income provides a cushion that allows for more growth-oriented investing, while unstable income may warrant a more conservative approach.',
    options: [
      { label: 'Very unstable — freelance or gig work', value: 'unstable', score: 0 },
      { label: 'Somewhat stable — contract or variable income', value: 'moderate', score: 6 },
      { label: 'Stable — full-time employment with benefits', value: 'stable', score: 12 },
      { label: 'Very stable — tenured, government, or pension-backed', value: 'very-stable', score: 15 },
    ],
  },
];

export function getScenarioById(id: string): MarketScenario {
  return MARKET_SCENARIOS.find((s) => s.id === id) || MARKET_SCENARIOS[0];
}

export function getUserById(id: string): User | undefined {
  return SEED_USERS.find((u) => u.id === id);
}

export function getProfileByUserId(userId: string): RiskProfile | undefined {
  return SEED_RISK_PROFILES.find((p) => p.userId === userId);
}

export function getPortfolioByUserId(userId: string): Portfolio | undefined {
  return SEED_PORTFOLIOS.find((p) => p.userId === userId);
}

export function getMessagesForUser(userId: string): Message[] {
  return SEED_MESSAGES.filter((m) => m.userId === userId);
}

export function calculateWeightedExpenseRatio(): number {
  let weighted = 0;
  for (const etf of ETF_DATA) {
    weighted += etf.expenseRatio * (TARGET_ALLOCATION[etf.ticker] / 100);
  }
  return +weighted.toFixed(5);
}
