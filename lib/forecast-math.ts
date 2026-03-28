export interface ForecastDataPoint {
  year: number;
  expectedValue: number;
  crisisValue: number | null;
  contributedPrincipal: number;
}

export interface ForecastParams {
  initialAmount: number;
  monthlyContribution: number;
  years: number;
  annualReturnRate: number; // e.g., 0.07 for 7%
  crisisYear?: number;      // e.g., year 5 to inject the crisis
  crisisDrawdown?: number;  // e.g., -0.38 for a 38% drop
}

/**
 * Generates an array of data points for plotting the compound growth of an investment over time.
 * Calculates both the smooth expected model and the "stressed" model side-by-side.
 */
export function generateForecastData({
  initialAmount,
  monthlyContribution,
  years,
  annualReturnRate,
  crisisYear,
  crisisDrawdown
}: ForecastParams): ForecastDataPoint[] {
  const data: ForecastDataPoint[] = [];
  
  const annualContribution = monthlyContribution * 12;
  
  let currentExpected = initialAmount;
  let currentCrisis = initialAmount;
  let totalPrincipal = initialAmount;

  // Year 0 (Today)
  data.push({
    year: 0,
    expectedValue: Math.round(currentExpected),
    crisisValue: crisisYear != null ? Math.round(currentCrisis) : null,
    contributedPrincipal: Math.round(totalPrincipal)
  });

  for (let year = 1; year <= years; year++) {
    // 1. Add contributions
    currentExpected += annualContribution;
    currentCrisis += annualContribution;
    totalPrincipal += annualContribution;

    // 2. Apply annual growth
    currentExpected = currentExpected * (1 + annualReturnRate);
    
    // 3. Apply crisis logic if applicable
    if (crisisYear === year && crisisDrawdown != null) {
      // The crisis drops the value drastically this specific year
      currentCrisis = currentCrisis * (1 - (Math.abs(crisisDrawdown) / 100)); // Ensure it's treated as a pure float deduction
    } else {
      currentCrisis = currentCrisis * (1 + annualReturnRate);
    }

    data.push({
      year,
      expectedValue: Math.round(currentExpected),
      crisisValue: crisisYear != null ? Math.round(currentCrisis) : null,
      contributedPrincipal: Math.round(totalPrincipal)
    });
  }

  return data;
}
