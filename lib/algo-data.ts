import { MarketDataPoint } from "@/types";

// Generates 100 days of mock BTC price data with some volatility
export function generateAssetHistory(
  startPrice: number, 
  volatility: number, 
  days: number = 100
): MarketDataPoint[] {
  const data: MarketDataPoint[] = [];
  let currentPrice = startPrice;
  const startTimestamp = new Date();
  startTimestamp.setDate(startTimestamp.getDate() - days);

  for (let i = 0; i < days; i++) {
    const date = new Date(startTimestamp);
    date.setDate(date.getDate() + i);
    
    // Random walk with specific volatility
    const change = (Math.random() - 0.49) * (currentPrice * volatility); 
    currentPrice += change;
    
    // Volume simulation
    const volume = Math.floor(Math.random() * (startPrice * 0.1)) + (startPrice * 0.05);

    data.push({
      timestamp: date.toISOString(),
      price: +currentPrice.toFixed(startPrice < 10 ? 4 : 2),
      volume: +volume.toFixed(0)
    });
  }

  return data;
}

export const CRYPTO_HISTORIES: Record<string, MarketDataPoint[]> = {
  BTC: generateAssetHistory(65000, 0.03),
  ETH: generateAssetHistory(3500, 0.04),
  USDT: generateAssetHistory(1.0001, 0.0002), // Very low volatility
  DOGE: generateAssetHistory(0.12, 0.08),     // High volatility
};

