import { MarketDataPoint, TechnicalIndicators, AlgoVerdict, TradeSignal, TradingStrategy } from "@/types";

/**
 * Technical Indicator Calculations
 */

export function calculateSMA(data: MarketDataPoint[], period: number): number {
  if (data.length < period) return data[data.length - 1]?.price || 0;
  const subset = data.slice(-period);
  const sum = subset.reduce((acc, point) => acc + point.price, 0);
  return +(sum / period).toFixed(2);
}

export function calculateRSI(data: MarketDataPoint[], period: number = 14): number {
  if (data.length <= period) return 50;

  let gains = 0;
  let losses = 0;

  for (let i = 1; i <= period; i++) {
    const diff = data[data.length - i].price - data[data.length - i - 1].price;
    if (diff >= 0) gains += diff;
    else losses -= diff;
  }

  const avgGain = gains / period;
  const avgLoss = losses / period;

  if (avgLoss === 0) return 100;
  
  const rs = avgGain / avgLoss;
  const rsi = 100 - (100 / (1 + rs));
  return +rsi.toFixed(2);
}

/**
 * Trading Algorithm Logic
 */

export function generateTradingVerdict(
  history: MarketDataPoint[],
  strategy: TradingStrategy
): AlgoVerdict {
  const currentPrice = history[history.length - 1].price;
  const currentVolume = history[history.length - 1].volume;
  const avgVolume = history.slice(-10).reduce((a, b) => a + b.volume, 0) / 10;

  const sma50 = calculateSMA(history, 50);
  const sma200 = calculateSMA(history, 200);
  const rsi = calculateRSI(history, strategy.rsiPeriod);

  const indicators: TechnicalIndicators = { sma50, sma200, rsi };
  const reasoning: string[] = [];
  
  let signal: TradeSignal = 'hold';
  let score = 50; // bias neutral

  // 1. Trend Following (SMA Crossover / Position)
  if (currentPrice > sma50 && sma50 > sma200) {
    reasoning.push("Bullish: Price > SMA50 > SMA200 (Golden Cross potential)");
    score += 20;
  } else if (currentPrice < sma50 && sma50 < sma200) {
    reasoning.push("Bearish: Price < SMA50 < SMA200 (Death Cross potential)");
    score -= 20;
  }

  // 2. Momentum (RSI)
  if (rsi < strategy.rsiOversold) {
    reasoning.push(`Oversold: RSI ${rsi} < ${strategy.rsiOversold}`);
    score += 25;
  } else if (rsi > strategy.rsiOverbought) {
    reasoning.push(`Overbought: RSI ${rsi} > ${strategy.rsiOverbought}`);
    score -= 25;
  } else {
    reasoning.push("Momentum: RSI is in neutral territory");
  }

  // 3. Volume Confirmation
  if (currentVolume > avgVolume * 1.5) {
    reasoning.push("Volume: Strong confirmational trading volume detected");
    score += (score > 50 ? 10 : -10);
  }

  // Final Verdict
  if (score >= 70) signal = 'buy';
  else if (score <= 30) signal = 'sell';
  else signal = 'hold';

  return {
    signal,
    strength: score,
    reasoning,
    indicators
  };
}

/**
 * Risk Management Rules
 */

export function checkRiskRules(
  entryPrice: number,
  currentPrice: number,
  strategy: TradingStrategy
): { action: 'exit' | 'stay'; reason?: string } {
  const pnl = ((currentPrice - entryPrice) / entryPrice) * 100;

  if (pnl <= -strategy.stopLossPct) {
    return { action: 'exit', reason: `Stop-Loss triggered at -${strategy.stopLossPct}%` };
  }
  
  if (pnl >= strategy.takeProfitPct) {
    return { action: 'exit', reason: `Take-Profit targets reached at +${strategy.takeProfitPct}%` };
  }

  return { action: 'stay' };
}
