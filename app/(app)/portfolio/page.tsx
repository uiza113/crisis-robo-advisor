"use client";

import { useAppStore } from "@/store/app-store";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { formatCurrency, formatPercent } from "@/lib/utils";
import { Info, PieChart, ShieldAlert, FileText, ArrowUpRight, ArrowDownRight } from "lucide-react";
import Link from "next/link";
import { ETF_DATA } from "@/lib/seed-data";

export default function PortfolioPage() {
  const { portfolio, activeScenario } = useAppStore();

  if (!portfolio) return <div className="p-8 text-center text-surface-400">Loading portfolio details...</div>;

  const sortedHoldings = [...portfolio.holdings].sort((a, b) => b.currentWeight - a.currentWeight);

  const totalDrift = sortedHoldings.reduce((acc, h) => acc + Math.abs(h.drift), 0);
  const needsRebalance = portfolio.driftStatus === 'needs-rebalance';
  const crisisHold = portfolio.driftStatus === 'crisis-hold';

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Portfolio Details</h1>
          <p className="text-surface-400 mt-1 max-w-2xl">
            A comprehensive breakdown of your conceptual underlying holdings, allocations, and cost structure.
          </p>
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card className="col-span-1 md:col-span-3 bg-surface-100 border-white/5">
          <CardHeader>
            <CardTitle className="text-xl">Holdings Breakdown</CardTitle>
            <CardDescription className="flex items-center justify-between">
               <span>Current simulated values based on {activeScenario.name} scenario.</span>
               <span className="font-mono text-white glow-text text-lg">{formatCurrency(portfolio.totalValue)}</span>
            </CardDescription>
          </CardHeader>
          <CardContent>
             <div className="overflow-x-auto">
               <table className="w-full text-sm text-left">
                 <thead className="text-xs uppercase bg-surface-200/50 border-b border-white/10 text-surface-400">
                   <tr>
                     <th className="px-4 py-3 font-semibold">Ticker</th>
                     <th className="px-4 py-3 font-semibold">Name & Category</th>
                     <th className="px-4 py-3 font-semibold text-right">Value</th>
                     <th className="px-4 py-3 font-semibold text-right text-brand-300">Target</th>
                     <th className="px-4 py-3 font-semibold text-right">Current</th>
                     <th className="px-4 py-3 font-semibold text-right">Drift</th>
                   </tr>
                 </thead>
                 <tbody className="divide-y divide-white/5">
                   {sortedHoldings.map((holding) => {
                     const etf = ETF_DATA.find(e => e.ticker === holding.ticker);
                     return (
                       <tr key={holding.ticker} className="hover:bg-surface-200/30 transition-colors">
                         <td className="px-4 py-4 font-bold tracking-widest">{holding.ticker}</td>
                         <td className="px-4 py-4">
                           <div className="font-medium text-white">{holding.name}</div>
                           <div className="text-xs text-surface-400 mt-1">{holding.category} • {formatPercent(etf?.expenseRatio || 0, 3)} ER</div>
                         </td>
                         <td className="px-4 py-4 text-right font-mono text-surface-100">{formatCurrency(holding.value)}</td>
                         <td className="px-4 py-4 text-right tabular-nums text-brand-300 font-medium">{holding.targetWeight}%</td>
                         <td className="px-4 py-4 text-right tabular-nums text-white font-medium">{holding.currentWeight}%</td>
                         <td className="px-4 py-4 text-right">
                           <Badge 
                             variant="glass" 
                             className={`font-mono text-xs ${
                               Math.abs(holding.drift) > 4 ? 'bg-amber-500/10 text-amber-400 border-amber-500/20' : 
                               'bg-transparent border-transparent text-surface-400'
                             }`}
                           >
                             {holding.drift > 0 ? <ArrowUpRight className="inline h-3 w-3 mr-1" /> : <ArrowDownRight className="inline h-3 w-3 mr-1" />}
                             {Math.abs(holding.drift)}%
                           </Badge>
                         </td>
                       </tr>
                     );
                   })}
                 </tbody>
               </table>
             </div>
          </CardContent>
        </Card>

        <div className="space-y-6">
           <Card className="border border-white/5 bg-surface-100">
             <CardHeader className="pb-3 text-center border-b border-white/5 bg-surface-200/50">
               <CardTitle className="text-sm uppercase tracking-wider text-surface-400">Cost Structure</CardTitle>
             </CardHeader>
             <CardContent className="pt-6 relative text-center">
                <div className="text-4xl font-black text-transparent bg-clip-text bg-gradient-to-br from-emerald-400 to-teal-600 drop-shadow-lg mb-2">
                  {formatPercent(portfolio.weightedExpenseRatio * 100, 3)}
                </div>
                <p className="text-xs font-medium text-surface-300">Weighted Average Expense Ratio</p>
                
                <div className="mt-6 pt-4 border-t border-white/5 text-sm text-surface-400 leading-relaxed text-left">
                  For every <span className="text-white font-mono">$10,000</span> invested, you pay approximately <span className="text-white font-mono">{formatCurrency(10000 * portfolio.weightedExpenseRatio)}</span> annually in underlying fund fees.
                </div>
             </CardContent>
           </Card>

           <Card className="border border-white/5 bg-surface-100">
             <CardHeader className="pb-2">
               <CardTitle className="text-sm font-semibold flex items-center gap-2">
                 <ShieldAlert className="h-4 w-4 text-brand-400" />
                 Rebalancing Status
               </CardTitle>
             </CardHeader>
             <CardContent>
               <div className="mb-4">
                 {needsRebalance ? (
                   <span className="text-amber-400 font-semibold mb-2 block">Action Recommended</span>
                 ) : crisisHold ? (
                   <span className="text-red-400 font-semibold mb-2 block">Human Review Required</span>
                 ) : (
                   <span className="text-emerald-400 font-semibold mb-2 block">Within normal bands</span>
                 )}
                 
                 <div className="flex justify-between items-end mb-1">
                   <span className="text-xs text-surface-400 uppercase tracking-wider">Total Absolute Drift</span>
                   <span className="text-xl font-mono text-white">{formatPercent(totalDrift)}</span>
                 </div>
                 
                 <div className="h-2 w-full bg-surface-300 rounded-full overflow-hidden mt-2">
                   <div 
                     className={`h-full opacity-80 ${totalDrift > 10 ? 'bg-amber-500' : 'bg-emerald-500'}`} 
                     style={{ width: `${Math.min(100, (totalDrift / 20) * 100)}%` }} // arbitrary scale
                   />
                 </div>
               </div>
               
               {needsRebalance && (
                  <Button size="sm" className="w-full bg-brand-600 text-white mt-2 shadow shadow-brand-500/20">Initate Rebalance</Button>
               )}
               {crisisHold && (
                  <Button size="sm" variant="outline" className="w-full border-red-500/30 text-red-300 mt-2 hover:bg-red-500/10">Request Adviser Review</Button>
               )}
             </CardContent>
           </Card>
        </div>
      </div>
    </div>
  );
}
