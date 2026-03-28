// ============================================================
// Risk Calculator — Scoring model for risk profiling
// ============================================================
import { QuestionnaireAnswer, RiskCategory } from '@/types';
import { ONBOARDING_QUESTIONS } from './seed-data';

export function calculateRiskScore(answers: QuestionnaireAnswer[]): number {
  const totalScore = answers.reduce((sum, a) => sum + a.score, 0);
  // Max possible score is 60 + 15 + 15 + 25 + 12 + 15 = 142
  // Normalize to 0–100
  const maxPossible = 142;
  return Math.round((totalScore / maxPossible) * 100);
}

export function classifyRisk(score: number): RiskCategory {
  if (score <= 39) return 'conservative';
  if (score <= 60) return 'moderate';
  return 'growth';
}

export function getRiskExplanation(score: number, category: RiskCategory): string {
  const explanations: Record<RiskCategory, string> = {
    conservative: `Your risk score is ${score}/100, placing you in the conservative range (0–39). This suggests a preference for capital preservation and lower volatility, typically suitable for shorter time horizons or lower loss tolerance. A conservative portfolio emphasizes bonds and inflation protection over equities.`,
    moderate: `Your risk score is ${score}/100, placing you in the moderate range (40–60). This reflects a balanced approach — you're willing to accept some market fluctuation in exchange for potential growth, while maintaining meaningful downside protection through diversification. A moderate portfolio balances equities with bonds.`,
    'growth': `Your risk score is ${score}/100, placing you in the growth-oriented range (61–100). This indicates comfort with higher volatility and a longer time horizon, prioritizing growth potential. A growth portfolio emphasizes equities while maintaining some diversification.`,
  };
  return explanations[category];
}

export function getDefaultAnswersForModerate(): QuestionnaireAnswer[] {
  return ONBOARDING_QUESTIONS.map((q) => {
    // Pick the moderate-ish answer for each question (usually index 2 or 3)
    const middleIdx = Math.floor(q.options.length / 2);
    const option = q.options[middleIdx];
    return {
      questionId: q.id,
      question: q.question,
      answer: option.value,
      score: option.score,
    };
  });
}
