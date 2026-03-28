// ============================================================
// Messaging Engine — Personalized messages based on user status
// ============================================================
import { Message, VulnerabilityClass, CrisisSeverity, ActionRecommendation } from '@/types';

let msgCounter = 100;

function createMessage(
  userId: string,
  type: Message['type'],
  title: string,
  content: string,
  priority: Message['priority']
): Message {
  msgCounter++;
  return {
    id: `msg-gen-${msgCounter}`,
    userId,
    type,
    title,
    content,
    read: false,
    priority,
    timestamp: new Date().toISOString(),
  };
}

export function generateCrisisMessages(
  userId: string,
  severity: CrisisSeverity,
  vulnerability: VulnerabilityClass,
  action: ActionRecommendation
): Message[] {
  const messages: Message[] = [];

  // ---- Severity-based messages ----
  if (severity === 'mild') {
    messages.push(
      createMessage(userId, 'crisis-explanation', 'Market Volatility Update',
        'Market stress is elevated. Before changing your portfolio, review your time horizon, cash needs, and risk tolerance. Historically, markets have recovered from corrections, but timing and magnitude are uncertain.',
        'medium')
    );
  }

  if (severity === 'severe') {
    messages.push(
      createMessage(userId, 'crisis-explanation', 'Significant Market Stress',
        'Markets are experiencing severe stress. This is a time for careful review, not reactive decisions. Your portfolio was designed to weather periods like this. If your circumstances changed, update your profile or request human support.',
        'high')
    );
    messages.push(
      createMessage(userId, 'fraud-warning', '⚠️ Heightened Scam Risk',
        'During periods of severe market stress, scam attempts increase significantly. Be cautious of unsolicited investment offers, especially those promising guaranteed returns or "safe haven" investments. This platform will never ask for your password.',
        'urgent')
    );
  }

  if (severity === 'dislocation') {
    messages.push(
      createMessage(userId, 'crisis-explanation', '🔴 Extreme Market Conditions',
        'Markets are experiencing extreme dislocation. Liquidity may be severely impaired. All portfolio changes are being routed through human advisers for your protection. Please do not make hasty decisions. A human adviser will contact you.',
        'urgent')
    );
    messages.push(
      createMessage(userId, 'fraud-warning', '🚨 Critical Fraud Alert',
        'During market dislocations, sophisticated scams targeting anxious investors are most active. Do NOT respond to unsolicited calls, emails, or messages about "emergency" portfolio changes. Contact only verified support channels.',
        'urgent')
    );
  }

  // ---- Vulnerability-based messages ----
  if (vulnerability === 'liquidity-sensitive') {
    messages.push(
      createMessage(userId, 'liquidity-reminder', 'Review Your Liquidity Needs',
        'Your profile indicates elevated liquidity needs. Before making portfolio changes, ensure you have adequate cash reserves for near-term expenses. Selling investments during market stress may lock in losses.',
        'high')
    );
  }

  if (vulnerability === 'behaviorally-vulnerable') {
    messages.push(
      createMessage(userId, 'calm-update', 'We\'re Here to Help',
        'We notice you may be feeling anxious about market conditions. This is completely natural. Before making changes, consider speaking with a human adviser who can review your situation. Your long-term plan was designed for moments like this.',
        'high')
    );
  }

  if (vulnerability === 'profile-mismatch') {
    messages.push(
      createMessage(userId, 'profile-refresh', 'Time to Update Your Profile',
        'Your risk profile was last updated more than 12 months ago. Life circumstances can change — job status, family needs, financial goals. Keeping your profile current helps ensure the portfolio illustration reflects your situation.',
        'medium')
    );
  }

  // ---- Action-based messages ----
  if (action === 'stay') {
    messages.push(
      createMessage(userId, 'calm-update', 'Stay the Course',
        'Based on your current profile and market conditions, no portfolio changes are recommended. Your allocation remains close to target. Continue focusing on your long-term investment goals.',
        'low')
    );
  }

  if (action === 'rebalance') {
    messages.push(
      createMessage(userId, 'action-recommendation', 'Rebalancing Opportunity',
        'Your portfolio has drifted from its target allocation. Rebalancing can help maintain your intended risk level. This involves shifting assets back toward your target weights. Review the details in your dashboard.',
        'medium')
    );
  }

  if (action === 'escalate') {
    messages.push(
      createMessage(userId, 'action-recommendation', 'Human Adviser Review',
        'Based on current conditions and your profile, we recommend a conversation with a human adviser before any portfolio changes. This is a protective measure, not a cause for alarm. An adviser will reach out to you.',
        'high')
    );
  }

  return messages;
}

// ---- Stable investor messages ----
export function generateStableMessages(userId: string): Message[] {
  return [
    createMessage(userId, 'calm-update', 'Monthly Portfolio Review',
      'Your portfolio continues to perform within expected ranges. Your allocation remains close to target with minor drift. Stay disciplined and focused on your long-term goals.',
      'low'),
    createMessage(userId, 'educational', 'Understanding Your Portfolio',
      'Your moderate-risk portfolio balances growth potential with stability. The 55% equity allocation provides growth, while 40% in bonds and inflation-protected securities provides cushioning during downturns.',
      'low'),
  ];
}
