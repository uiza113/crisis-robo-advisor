"use client";

import { useState } from "react";
import { AreaChart, Area, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from "recharts";
import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Slider } from "@/components/ui/slider";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { generateForecastData } from "@/lib/forecast-math";
import { formatCurrency } from "@/lib/utils";
import { ShieldAlert, TrendingUp, Presentation, AlertTriangle } from "lucide-react";

const RISK_LEVELS = [
  { label: "Conservative", returnRate: 0.04, description: "Lower volatility, bond-heavy array." },
  { label: "Moderate", returnRate: 0.07, description: "Balanced mix of equities and fixed income." },
  { label: "Aggressive", returnRate: 0.10, description: "High equity exposure, maximizing long-term gains." }
];

export default function ForecastPage() {
  const { portfolio, activeScenario } = useAppStore();
  
  const [initialAmount, setInitialAmount] = useState<number>(portfolio?.totalValue || 50000);
  const [monthlyContribution, setMonthlyContribution] = useState<number[]>([500]);
  const [years, setYears] = useState<number[]>([20]);
  const [riskIndex, setRiskIndex] = useState(1); // 1 = Moderate
  const [enableCrisis, setEnableCrisis] = useState(false);

  const riskLevel = RISK_LEVELS[riskIndex];
  const crisisYear = 5; // Fixed at year 5 for visual clarity

  const rawData = generateForecastData({
    initialAmount,
    monthlyContribution: monthlyContribution[0],
    years: years[0],
    annualReturnRate: riskLevel.returnRate,
    crisisYear: enableCrisis ? crisisYear : undefined,
    crisisDrawdown: enableCrisis ? activeScenario.drawdown : undefined
  });

  // Calculate some stats for the header cards
  const finalYear = rawData[rawData.length - 1];
  const totalInvested = finalYear.contributedPrincipal;
  const targetEndValue = finalYear.expectedValue;
  const crisisEndValue = enableCrisis && finalYear.crisisValue ? finalYear.crisisValue : targetEndValue;
  
  const difference = targetEndValue - crisisEndValue;

  return (
    <div className="space-y-6">
      <div>
         <h1 className="text-3xl font-bold tracking-tight bg-gradient-to-r from-emerald-400 to-teal-500 text-transparent bg-clip-text inline-flex items-center gap-3">
           <Presentation className="h-8 w-8 text-emerald-500" />
           Investment Forecaster
         </h1>
         <p className="text-surface-400 mt-2 max-w-3xl leading-relaxed">
            Customize your inputs and risk appetite to project your wealth compounding over time. Inject a <strong>Crisis Catalyst</strong> to visualize how staying the course historically heals deep portfolio wounds.
         </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
         {/* LEFT CONTROLS */}
         <div className="lg:col-span-1 space-y-6">
            <Card className="bg-surface-100 border-white/5">
               <CardHeader className="pb-4">
                  <CardTitle className="text-lg">Custom Variables</CardTitle>
               </CardHeader>
               <CardContent className="space-y-6">
                  <div className="space-y-2">
                     <Label className="text-surface-300">Initial Deposit ($)</Label>
                     <Input 
                        type="number" 
                        value={initialAmount} 
                        onChange={(e) => setInitialAmount(Number(e.target.value))}
                        className="font-mono text-lg bg-surface-200"
                     />
                  </div>

                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm">
                        <Label className="text-surface-300">Monthly Contribution</Label>
                        <span className="font-mono text-brand-400">{formatCurrency(monthlyContribution[0])}/mo</span>
                     </div>
                     <Slider 
                        value={monthlyContribution} 
                        onValueChange={setMonthlyContribution} 
                        max={5000} 
                        step={50}
                     />
                  </div>

                  <div className="space-y-3">
                     <div className="flex justify-between items-center text-sm">
                        <Label className="text-surface-300">Time Horizon</Label>
                        <span className="font-mono text-white">{years[0]} Years</span>
                     </div>
                     <Slider 
                        value={years} 
                        onValueChange={setYears} 
                        max={40} 
                        min={5}
                        step={1}
                     />
                  </div>

                  <div className="space-y-3 pt-4 border-t border-white/5">
                     <Label className="text-surface-300">Risk Profile / Target Return</Label>
                     <div className="flex flex-col gap-2">
                        {RISK_LEVELS.map((risk, index) => (
                           <button
                              key={risk.label}
                              className={`text-left text-sm px-4 py-3 rounded-lg border transition-all ${
                                 riskIndex === index 
                                 ? 'border-emerald-500 bg-emerald-500/10 shadow-[0_0_15px_rgba(16,185,129,0.2)] text-emerald-100' 
                                 : 'border-white/5 bg-surface-200 text-surface-400 hover:bg-surface-300'
                              }`}
                              onClick={() => setRiskIndex(index)}
                           >
                              <div className="font-bold mb-0.5 flex justify-between">
                                 <span>{risk.label}</span>
                                 <span className="font-mono">{risk.returnRate * 100}%</span>
                              </div>
                              <div className="text-xs opacity-70 leading-relaxed">{risk.description}</div>
                           </button>
                        ))}
                     </div>
                  </div>
               </CardContent>
            </Card>
            
            <Card className={`border-2 transition-colors duration-500 ${enableCrisis ? 'border-red-500/50 bg-red-900/10 shadow-[0_0_30px_rgba(239,68,68,0.1)]' : 'border-white/5 bg-surface-100'}`}>
               <CardHeader className="pb-2">
                  <CardTitle className="text-base flex items-center gap-2">
                     <AlertTriangle className={enableCrisis ? "text-red-400" : "text-surface-500"} />
                     Stress Test Sandbox
                  </CardTitle>
               </CardHeader>
               <CardContent>
                  <p className="text-xs text-surface-400 leading-relaxed mb-4">
                     See what happens if a <span className="font-bold text-white uppercase">{activeScenario.name}</span> instantly deletes <span className="text-red-400 font-bold font-mono">{activeScenario.drawdown}%</span> of your wealth in Year {crisisYear}.
                  </p>
                  <Button 
                     variant={enableCrisis ? "default" : "outline"}
                     onClick={() => setEnableCrisis(!enableCrisis)}
                     className={`w-full ${enableCrisis ? 'bg-red-600 hover:bg-red-500 text-white' : 'border-red-500/30 text-red-400 hover:bg-red-500/10'}`}
                  >
                     {enableCrisis ? "Remove Market Crisis" : "Inject Market Crisis"}
                  </Button>
               </CardContent>
            </Card>
         </div>

         {/* RIGHT CHART */}
         <div className="lg:col-span-3 space-y-6">
            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
               <Card className="bg-surface-100 border-white/5">
                  <CardContent className="pt-6">
                     <p className="text-sm font-semibold uppercase tracking-widest text-surface-400 mb-1">Total Principal</p>
                     <div className="text-3xl font-mono text-white tracking-tight">{formatCurrency(totalInvested)}</div>
                     <p className="text-xs text-surface-500 mt-2">Money out of your pocket</p>
                  </CardContent>
               </Card>
               <Card className="bg-surface-100 border-emerald-500/20 shadow-[0_0_20px_rgba(16,185,129,0.05)]">
                  <CardContent className="pt-6">
                     <p className="text-sm font-semibold uppercase tracking-widest text-emerald-400/80 mb-1">Smooth Expected Value</p>
                     <div className="text-3xl font-mono text-emerald-400 font-bold tracking-tight">{formatCurrency(targetEndValue)}</div>
                     <p className="text-xs text-surface-400 mt-2">Assuming perfect {riskLevel.returnRate * 100}% growth</p>
                  </CardContent>
               </Card>
               <Card className={`border transition-all duration-300 ${enableCrisis ? 'bg-red-500/5 border-red-500/30' : 'bg-surface-100 border-white/5 opacity-50'}`}>
                  <CardContent className="pt-6">
                     <p className={`text-sm font-semibold uppercase tracking-widest mb-1 ${enableCrisis ? 'text-red-400/80' : 'text-surface-500'}`}>Crisis Adjusted Value</p>
                     <div className={`text-3xl font-mono font-bold tracking-tight ${enableCrisis ? 'text-red-400' : 'text-surface-500'}`}>
                        {enableCrisis ? formatCurrency(crisisEndValue) : "Inactive"}
                     </div>
                     <p className="text-xs text-surface-400 mt-2">
                        {enableCrisis ? `Cost of panic selling: ${formatCurrency(difference)}` : "Turn on Stress Test"}
                     </p>
                  </CardContent>
               </Card>
            </div>

            <Card className="bg-surface-100 border-white/5 overflow-hidden">
               <CardHeader className="border-b border-white/5 bg-surface-200/50">
                  <CardTitle className="text-lg">Projected Compounding Growth</CardTitle>
                  <CardDescription>Hover over the timeline to view detailed year-over-year milestones.</CardDescription>
               </CardHeader>
               <CardContent className="p-0">
                  <div className="h-[500px] w-full p-6">
                     <ResponsiveContainer width="100%" height="100%">
                        <AreaChart data={rawData} margin={{ top: 20, right: 30, left: 20, bottom: 0 }}>
                           <defs>
                              <linearGradient id="colorExpected" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#10b981" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#10b981" stopOpacity={0}/>
                              </linearGradient>
                              <linearGradient id="colorCrisis" x1="0" y1="0" x2="0" y2="1">
                                 <stop offset="5%" stopColor="#ef4444" stopOpacity={0.3}/>
                                 <stop offset="95%" stopColor="#ef4444" stopOpacity={0}/>
                              </linearGradient>
                           </defs>
                           <CartesianGrid strokeDasharray="3 3" stroke="rgba(255,255,255,0.05)" vertical={false} />
                           <XAxis 
                              dataKey="year" 
                              stroke="#6b7280" 
                              tickFormatter={(val) => `Year ${val}`}
                              tick={{fill: '#6b7280', fontSize: 12}}
                           />
                           <YAxis 
                              stroke="#6b7280" 
                              tickFormatter={(val) => `$${(val / 1000).toPrecision(3)}k`}
                              tick={{fill: '#6b7280', fontSize: 12}}
                           />
                           <Tooltip 
                              formatter={(value: any, name: any) => {
                                 if (name === "expectedValue") return [formatCurrency(value), "Smooth Growth"];
                                 if (name === "crisisValue" && value) return [formatCurrency(value), "Crisis Impact"];
                                 if (name === "contributedPrincipal") return [formatCurrency(value), "Total Principal"];
                                 return [value, name];
                              }}
                              labelFormatter={(label) => `Investment Year ${label}`}
                              contentStyle={{ 
                                 backgroundColor: 'rgba(26, 26, 46, 0.95)', 
                                 border: '1px solid rgba(255,255,255,0.1)',
                                 borderRadius: '8px',
                                 boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.5)',
                                 color: '#fff',
                                 backdropFilter: 'blur(8px)'
                              }}
                              itemStyle={{ fontWeight: 600, fontSize: '14px' }}
                           />
                           
                           {enableCrisis && (
                              <ReferenceLine x={crisisYear} stroke="rgba(239, 68, 68, 0.5)" strokeDasharray="3 3" label={{ position: 'top', value: `${activeScenario.name} Hits`, fill: '#ef4444', fontSize: 10 }} />
                           )}

                           <Area 
                              type="monotone" 
                              dataKey="contributedPrincipal" 
                              stroke="#4b5563" 
                              fill="transparent" 
                              strokeWidth={2}
                           />

                           <Area 
                              type="monotone" 
                              dataKey="expectedValue" 
                              stroke="#10b981" 
                              fillOpacity={1} 
                              fill="url(#colorExpected)" 
                              strokeWidth={enableCrisis ? 1 : 3}
                              strokeDasharray={enableCrisis ? "5 5" : undefined}
                           />

                           {enableCrisis && (
                              <Area 
                                 type="monotone" 
                                 dataKey="crisisValue" 
                                 stroke="#ef4444" 
                                 fillOpacity={1} 
                                 fill="url(#colorCrisis)" 
                                 strokeWidth={3}
                              />
                           )}
                        </AreaChart>
                     </ResponsiveContainer>
                  </div>
               </CardContent>
            </Card>
         </div>
      </div>
    </div>
  );
}
