import { MarketDataPoint } from "@/types";

// Generates 100 days of mock BTC price data with some volatility
export function generateMockCryptoData(): MarketDataPoint[] {
  const data: MarketDataPoint[] = [];
  let currentPrice = 65000;
  const startTimestamp = new Date();
  startTimestamp.setDate(startTimestamp.getDate() - 100);

  for (let i = 0; i < 100; i++) {
    const date = new Date(startTimestamp);
    date.setDate(date.getDate() + i);
    
    // Random walk with drift
    const change = (Math.random() - 0.48) * 2000; 
    currentPrice += change;
    
    // Add some spikes for "Volume"
    const volume = Math.floor(Math.random() * 5000) + 2000;

    data.push({
      timestamp: date.toISOString(),
      price: +currentPrice.toFixed(2),
      volume: volume
    });
  }

  return data;
}

export const BTC_HISTORY = generateMockCryptoData();
