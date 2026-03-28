// ============================================================
// Crisis Engine — Transparent, Rule-Based Crisis Assessment
// ============================================================
import {
  CrisisEngineInput,
  CrisisEngineOutput,
  CrisisSeverity,
  VulnerabilityClass,
  ActionRecommendation,
} from '@/types';

// ---- Severity Classification ----
export function classifySeverity(
  drawdown: number,
  volatility: number,
  bondEquityCorrelation: number,
  bidAskSpreadStress: number
): { severity: CrisisSeverity; rules: string[]; explanations: string[] } {
  const rules: string[] = [];
  const explanations: string[] = [];

  // Dislocation check first (most severe)
  if (drawdown > 30 || bidAskSpreadStress > 0.8 || bondEquityCorrelation > 0.8) {
    if (drawdown > 30) {
      rules.push('SEV-D1: Drawdown exceeds 30%');
      explanations.push(`Markets have declined ${drawdown}%, which exceeds the 30% threshold for market dislocation.`);
    }
    if (bidAskSpreadStress > 0.8) {
      rules.push('SEV-D2: Bid-ask spread stress exceeds 0.8');
      explanations.push('Liquidity conditions are severely impaired — it may be difficult to buy or sell at fair prices.');
    }
    if (bondEquityCorrelation > 0.8) {
      rules.push('SEV-D3: Bond-equity correlation exceeds 0.8');
      explanations.push('Bonds and stocks are moving together, which reduces the effectiveness of diversification.');
    }
    return { severity: 'dislocation', rules, explanations };
  }

  // Severe check
  if (drawdown >= 15 || volatility > 25) {
    if (drawdown >= 15) {
      rules.push('SEV-S1: Drawdown between 15% and 30%');
      explanations.push(`Markets have declined ${drawdown}%, indicating severe stress.`);
    }
    if (volatility > 25) {
      rules.push('SEV-S2: Volatility exceeds 25');
      explanations.push(`Market volatility is at ${volatility}, well above normal levels of 12-18.`);
    }
    return { severity: 'severe', rules, explanations };
  }

  // Mild check
  if (drawdown >= 5 || volatility >= 15) {
    if (drawdown >= 5) {
      rules.push('SEV-M1: Drawdown between 5% and 15%');
      explanations.push(`Markets have declined ${drawdown}%, showing elevated but not extreme stress.`);
    }
    if (volatility >= 15) {
      rules.push('SEV-M2: Volatility at or above 15');
      explanations.push(`Market volatility is at ${volatility}, above the calm-market range.`);
    }
    return { severity: 'mild', rules, explanations };
  }

  rules.push('SEV-N1: All indicators within normal ranges');
  explanations.push('Markets are operating within typical ranges. No elevated stress detected.');
  return { severity: 'normal', rules, explanations };
}

// ---- Vulnerability Classification ----
export function classifyVulnerability(
  liquidityNeed: string,
  hasEmergencyFund: boolean,
  withdrawalRequested: boolean,
  anxietySignal: number,
  questionnaireAgeMonths: number,
  lossTolerance: string
): { vulnerability: VulnerabilityClass; rules: string[]; explanations: string[] } {
  const rules: string[] = [];
  const explanations: string[] = [];

  // Check profile mismatch
  if (questionnaireAgeMonths > 12) {
    rules.push('VUL-PM1: Questionnaire older than 12 months');
    explanations.push(`Your risk profile was last updated ${questionnaireAgeMonths} months ago. Life circumstances may have changed.`);
    return { vulnerability: 'profile-mismatch', rules, explanations };
  }

  // Check behavioral vulnerability
  if (anxietySignal >= 7) {
    rules.push('VUL-BV1: High anxiety signal (≥7)');
    explanations.push('Elevated anxiety detected. During market stress, it\'s important to pause and review before making changes.');
    return { vulnerability: 'behaviorally-vulnerable', rules, explanations };
  }

  // Check liquidity sensitivity
  if (
    liquidityNeed === 'high' ||
    liquidityNeed === 'moderate' ||
    !hasEmergencyFund ||
    withdrawalRequested
  ) {
    if (liquidityNeed === 'high' || liquidityNeed === 'moderate') {
      rules.push('VUL-LS1: Elevated liquidity need');
      explanations.push('Your liquidity needs are elevated, which increases sensitivity to market declines.');
    }
    if (!hasEmergencyFund) {
      rules.push('VUL-LS2: No emergency fund');
      explanations.push('Without an emergency fund, you may need to sell investments at unfavorable prices.');
    }
    if (withdrawalRequested) {
      rules.push('VUL-LS3: Withdrawal requested');
      explanations.push('You have a pending withdrawal request during a period of market stress.');
    }
    return { vulnerability: 'liquidity-sensitive', rules, explanations };
  }

  rules.push('VUL-ST1: No vulnerability flags detected');
  explanations.push('Your profile shows no elevated vulnerability indicators at this time.');
  return { vulnerability: 'stable', rules, explanations };
}

// ---- Action Recommendation ----
export function recommendAction(
  severity: CrisisSeverity,
  vulnerability: VulnerabilityClass
): { action: ActionRecommendation; rules: string[]; explanations: string[] } {
  const rules: string[] = [];
  const explanations: string[] = [];

  // Dislocation always escalates
  if (severity === 'dislocation') {
    rules.push('ACT-E1: Market dislocation — escalate all cases');
    explanations.push('During market dislocation, all cases are routed to a human adviser for individualized review.');
    return { action: 'escalate', rules, explanations };
  }

  // Behaviorally vulnerable during stress → escalate
  if (vulnerability === 'behaviorally-vulnerable' && (severity === 'severe' || severity === 'mild')) {
    rules.push('ACT-E2: Behaviorally vulnerable during stress');
    explanations.push('Given elevated anxiety signals during market stress, a conversation with a human adviser is recommended.');
    return { action: 'escalate', rules, explanations };
  }

  // Profile mismatch → refresh
  if (vulnerability === 'profile-mismatch') {
    rules.push('ACT-RP1: Profile mismatch — refresh needed');
    explanations.push('Your risk profile may be outdated. Please review your circumstances before any portfolio changes.');
    return { action: 'refresh-profile', rules, explanations };
  }

  // Liquidity-sensitive during mild+ stress → refresh
  if (vulnerability === 'liquidity-sensitive' && severity !== 'normal') {
    rules.push('ACT-RP2: Liquidity-sensitive during stress');
    explanations.push('Given your liquidity needs and current market stress, reviewing your profile and cash needs is recommended.');
    return { action: 'refresh-profile', rules, explanations };
  }

  // Mild + stable → rebalance
  if (severity === 'mild' && vulnerability === 'stable') {
    rules.push('ACT-RB1: Mild stress, stable profile — rebalance to target');
    explanations.push('A mild correction has moved your portfolio away from target. Rebalancing may help maintain your intended risk level.');
    return { action: 'rebalance', rules, explanations };
  }

  // Severe + stable → rebalance, but with caution
  if (severity === 'severe' && vulnerability === 'stable') {
    rules.push('ACT-RB2: Severe stress, stable profile — rebalance with caution');
    explanations.push('Markets are under severe stress, but your profile is stable. Rebalancing to target may be appropriate, but review your circumstances first.');
    return { action: 'rebalance', rules, explanations };
  }

  // Default: stay the course
  rules.push('ACT-SC1: Normal conditions — stay the course');
  explanations.push('No action needed. Your portfolio is aligned with your risk profile. Stay disciplined and focused on your long-term goals.');
  return { action: 'stay', rules, explanations };
}

// ---- Main Engine ----
export function runCrisisEngine(input: CrisisEngineInput): CrisisEngineOutput {
  const { scenario, userProfile, anxietySignal, withdrawalRequested, questionnaireAgeMonths } = input;

  const sevResult = classifySeverity(
    scenario.drawdown,
    scenario.volatilityLevel,
    scenario.bondEquityCorrelation,
    scenario.bidAskSpreadStress
  );

  const vulResult = classifyVulnerability(
    userProfile.liquidityNeed,
    userProfile.hasEmergencyFund,
    withdrawalRequested,
    anxietySignal,
    questionnaireAgeMonths,
    userProfile.lossTolerance
  );

  const actResult = recommendAction(sevResult.severity, vulResult.vulnerability);

  return {
    severityClass: sevResult.severity,
    vulnerabilityClass: vulResult.vulnerability,
    actionRecommendation: actResult.action,
    explanations: [...sevResult.explanations, ...vulResult.explanations, ...actResult.explanations],
    rulesFired: [...sevResult.rules, ...vulResult.rules, ...actResult.rules],
  };
}
