// ============================================================
// FinGuide — Educational Assistant Logic
// ============================================================

interface FinGuideResponse {
  content: string;
}

const KNOWLEDGE_BASE: Record<string, string> = {
  etf: `**What is an ETF?**\n\nAn Exchange-Traded Fund (ETF) is a type of investment fund that trades on stock exchanges, similar to individual stocks. ETFs typically track an index, sector, commodity, or asset class.\n\n**Key features:**\n• **Diversification** — One ETF can hold hundreds or thousands of securities\n• **Low cost** — ETFs typically have lower expense ratios than mutual funds\n• **Transparency** — Holdings are disclosed regularly\n• **Liquidity** — Can be bought and sold throughout the trading day\n\nETFs are subject to market risk, including the possible loss of principal.`,

  diversification: `**What is Diversification?**\n\nDiversification is the practice of spreading investments across different asset classes, sectors, and geographies to reduce concentration risk.\n\n**How it works in this portfolio:**\n• **Equities (55%)** — Growth potential through global stocks\n• **US Bonds (20%)** — Stability and income from investment-grade bonds\n• **International Bonds (10%)** — Additional geographic diversification\n• **Inflation Protection (10%)** — Hedge against unexpected inflation\n• **Real Estate (5%)** — Exposure to real assets\n\n⚠️ Diversification may reduce concentration risk, but it does not eliminate losses. All investments can decline in value.`,

  rebalancing: `**What is Rebalancing?**\n\nRebalancing is the process of realigning your portfolio's asset allocation back to its target weights. Over time, as different assets grow at different rates, your portfolio can drift from its intended allocation.\n\n**How rebalancing works here:**\n• Reviews occur monthly\n• Rebalancing triggers when any position drifts more than 5 percentage points from target\n• Incoming cash is used first (before selling)\n• During crisis conditions, drift bands may widen and human review may be required\n\nRebalancing is a disciplined approach to maintaining your intended risk level, not a way to "time the market."`,

  crisis: `**Understanding Crisis Mode**\n\nThe crisis engine monitors market conditions and assesses whether your portfolio may need adjustment. It uses transparent, rule-based logic.\n\n**What it monitors:**\n• Market drawdowns (how far markets have fallen)\n• Volatility levels (how much markets are swinging)\n• Bond-equity correlations (whether diversification is effective)\n• Liquidity conditions (whether markets are functioning normally)\n\n**What it recommends:**\n1. **Stay the course** — When conditions don't warrant changes\n2. **Rebalance** — When drift exceeds thresholds\n3. **Refresh profile** — When your circumstances may have changed\n4. **Escalate to adviser** — When human judgment is needed\n\n⚠️ These are educational demonstrations, not actionable advice.`,

  risk: `**Understanding Risk**\n\nInvestment risk is the possibility that your investments may lose value. Different types include:\n\n• **Market risk** — Prices may decline due to broad economic factors\n• **Inflation risk** — Returns may not keep pace with inflation\n• **Liquidity risk** — You may not be able to sell at a fair price\n• **Concentration risk** — Too much exposure to one area\n• **Correlation risk** — Assets may all decline together in a crisis\n\n**Your risk score** reflects your capacity and willingness to endure investment losses. It considers your time horizon, income stability, liquidity needs, and emotional tolerance.\n\n⚠️ Risk cannot be eliminated — only managed through diversification, appropriate allocation, and sound planning.`,

  liquidity: `**Understanding Liquidity**\n\nLiquidity refers to how quickly and easily you can convert investments to cash without significant loss of value.\n\n**Key concepts:**\n• **Emergency fund** — Cash reserves covering 3-6 months of expenses\n• **Liquid investments** — ETFs and stocks that trade on exchanges\n• **Liquidity stress** — When markets don't function normally and selling becomes difficult\n\n**Why it matters during a crisis:**\nDuring market stress, bid-ask spreads can widen significantly, meaning the price you can actually sell at may be much lower than the quoted price. Having adequate cash reserves prevents forced selling at poor prices.\n\n⚠️ Never invest money you may need for near-term expenses.`,
};

const ADVICE_REDIRECT = "This app does not provide investment advice. It can help you understand the portfolio logic, risks, and available options. For personalized guidance, please consult a qualified financial adviser.";

export function getFinGuideResponse(userMessage: string): FinGuideResponse {
  const lower = userMessage.toLowerCase();

  // Detect advice-seeking questions
  const advicePatterns = [
    'should i buy', 'should i sell', 'what should i invest in',
    'is now a good time', 'will the market', 'predict', 'guarantee',
    'which stock', 'best investment', 'make money', 'beat the market',
    'should i change', 'what do you recommend', 'tell me what to do',
    'advice', 'advise me', 'what to buy',
  ];

  if (advicePatterns.some(p => lower.includes(p))) {
    return { content: ADVICE_REDIRECT };
  }

  // Match educational topics
  if (lower.includes('etf') || lower.includes('exchange traded') || lower.includes('exchange-traded')) {
    return { content: KNOWLEDGE_BASE.etf };
  }

  if (lower.includes('diversif')) {
    return { content: KNOWLEDGE_BASE.diversification };
  }

  if (lower.includes('rebalanc')) {
    return { content: KNOWLEDGE_BASE.rebalancing };
  }

  if (lower.includes('crisis') || lower.includes('crash') || lower.includes('downturn') || lower.includes('bear market')) {
    return { content: KNOWLEDGE_BASE.crisis };
  }

  if (lower.includes('risk') || lower.includes('volatil') || lower.includes('loss')) {
    return { content: KNOWLEDGE_BASE.risk };
  }

  if (lower.includes('liquid') || lower.includes('cash') || lower.includes('emergency fund') || lower.includes('withdraw')) {
    return { content: KNOWLEDGE_BASE.liquidity };
  }

  if (lower.includes('expense ratio') || lower.includes('fee') || lower.includes('cost')) {
    return {
      content: `**Understanding Expense Ratios**\n\nAn expense ratio is the annual fee charged by an ETF, expressed as a percentage of assets. Lower is generally better.\n\n**Your portfolio's weighted expense ratio is approximately 0.058%**, which means for every $10,000 invested, you'd pay about $5.80 per year.\n\nThis is significantly lower than the average mutual fund expense ratio of ~0.50%. Low costs are one of the key advantages of index-based ETF investing.\n\n⚠️ Expense ratios are one of many factors to consider. They do not account for trading costs, taxes, or the impact of tracking error.`,
    };
  }

  // Default helpful response
  return {
    content: `I can help you understand:\n\n• **ETFs** — What they are and how they work\n• **Diversification** — How spreading investments reduces risk\n• **Rebalancing** — Why and how portfolios are rebalanced\n• **Crisis mode** — How the crisis engine works\n• **Risk** — Types of investment risk\n• **Liquidity** — Cash needs and emergency funds\n• **Expense ratios** — What they cost you\n\nTry asking about any of these topics!\n\n⚠️ Remember: ${ADVICE_REDIRECT}`,
  };
}
