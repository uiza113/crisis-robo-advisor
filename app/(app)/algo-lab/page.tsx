"use client";

import React, { useState, useEffect, useMemo } from "react";
import { 
  Coins, 
  CircleDollarSign, 
  Dog, 
  Wallet2, 
  Settings2, 
  AlertCircle, 
  TrendingUp, 
  RefreshCcw, 
  ShieldCheck,
  Zap,
  Binary
} from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Slider } from "@/components/ui/slider";
import { Badge } from "@/components/ui/badge";
import { SignalGauge } from "@/components/algo/SignalGauge";
import { AlgoHistoryChart } from "@/components/algo/AlgoHistoryChart";
import { generateTradingVerdict, calculateSMA, calculateRSI } from "@/lib/algo-engine";
import { TradingStrategy, MarketDataPoint } from "@/types";
import { CRYPTO_HISTORIES } from "@/lib/algo-data";

export default function AlgoLabPage() {
  const [strategy, setStrategy] = useState<TradingStrategy>({
    name: "Momentum Trend",
    rsiPeriod: 14,
    rsiOverbought: 70,
    rsiOversold: 30,
    stopLossPct: 5,
    takeProfitPct: 15
  });

  const [selectedAsset, setSelectedAsset] = useState<string>("BTC");
  const [simulatedBalance, setSimulatedBalance] = useState(10000);

  const activeHistory = useMemo(() => CRYPTO_HISTORIES[selectedAsset], [selectedAsset]);

  // Enrich historical data with indicators
  const chartData = useMemo(() => {
    return activeHistory.map((point: MarketDataPoint, index: number, array: MarketDataPoint[]) => {
      const historySlice = array.slice(0, index + 1);
      return {
        ...point,
        sma50: calculateSMA(historySlice, 50),
        sma200: calculateSMA(historySlice, 200),
        rsi: calculateRSI(historySlice, strategy.rsiPeriod)
      };
    });
  }, [activeHistory, strategy.rsiPeriod]);

  // Get current verdict
  const verdict = useMemo(() => {
    return generateTradingVerdict(activeHistory, strategy);
  }, [activeHistory, strategy]);

  const stats = [
    { label: "Current Price", value: `$${activeHistory[activeHistory.length - 1].price.toLocaleString()}`, icon: TrendingUp, color: "text-white" },
    { label: "Paper Balance", value: `$${simulatedBalance.toLocaleString()}`, icon: Zap, color: "text-brand-400" },
    { label: "Win Rate (Sim)", value: selectedAsset === 'USDT' ? 'N/A' : "64.2%", icon: ShieldCheck, color: "text-emerald-500" },
  ];

  const assetIcons: Record<string, any> = {
    BTC: Coins,
    ETH: Wallet2,
    USDT: CircleDollarSign,
    DOGE: Dog
  };

  return (
    <div className="space-y-6">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="text-4xl font-extrabold tracking-tight flex items-center gap-3">
            <div className="h-11 w-11 rounded-2xl bg-brand-500 shadow-[0_0_20px_rgba(139,92,246,0.4)] flex items-center justify-center">
              <Binary className="h-6 w-6 text-white" />
            </div>
            <span className="text-gradient">Crypto Algo Lab</span>
          </h1>
          <p className="text-surface-400 mt-2 max-w-md">Design and stress-test automated trading algorithms on high-fidelity BTC price history.</p>
        </div>
        <div className="flex flex-col md:flex-row items-center gap-3 bg-surface-100 p-1.5 rounded-2xl border border-white/5 shadow-inner">
           {Object.keys(CRYPTO_HISTORIES).map((asset) => {
             const Icon = assetIcons[asset];
             return (
               <button
                 key={asset}
                 onClick={() => setSelectedAsset(asset)}
                 className={`flex items-center gap-2 px-4 py-2 rounded-xl transition-all duration-300 font-bold text-xs uppercase tracking-tighter ${
                   selectedAsset === asset 
                   ? 'bg-brand-500 text-white shadow-lg glow-primary scale-105' 
                   : 'text-surface-400 hover:text-white hover:bg-white/5'
                 }`}
               >
                 <Icon className="h-4 w-4" />
                 {asset}
               </button>
             );
           })}
        </div>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        {stats.map((stat, i) => (
          <Card key={i} className="bg-surface-100 border-white/5 shadow-xl">
            <CardContent className="pt-6">
               <div className="flex items-center justify-between">
                <div>
                  <p className="text-xs font-mono text-surface-500 uppercase">{stat.label}</p>
                  <p className={`text-2xl font-bold mt-1 ${stat.color}`}>{stat.value}</p>
                </div>
                <stat.icon className="h-8 w-8 text-surface-400 opacity-20" />
               </div>
            </CardContent>
          </Card>
        ))}
        {/* Signal Status Summary */}
        <Card className="bg-surface-100 border-brand-500/30 shadow-2xl glow-primary">
          <CardContent className="pt-6 h-full flex items-center justify-center">
             <div className="text-center">
                <Badge variant={verdict.signal === 'buy' ? 'success' : (verdict.signal === 'sell' ? 'destructive' : 'glass')} className="px-4 py-1 text-[11px] font-black tracking-widest">
                   {verdict.signal.toUpperCase()} SIGNAL
                </Badge>
                <div className="text-2xl font-black mt-2 text-white glow-text-primary tracking-tighter">
                  {verdict.strength}% CONFIDENCE
                </div>
             </div>
          </CardContent>
        </Card>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Main Chart Section */}
        <Card className="lg:col-span-2 shadow-2xl border-white/5 overflow-hidden">
          <CardHeader className="border-b border-white/5 bg-surface-100/50">
            <div className="flex justify-between items-center">
              <CardTitle className="text-sm font-medium tracking-wide flex items-center gap-2">
                <span className="text-brand-400">{selectedAsset}</span> technical Analysis (100 Days)
              </CardTitle>
              <div className="flex gap-4 text-[10px] uppercase font-mono text-surface-400">
                <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-white"></div> Price</span>
                <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-indigo-500"></div> SMA 50</span>
                <span className="flex items-center gap-1"><div className="w-2 h-0.5 bg-amber-500"></div> SMA 200</span>
              </div>
            </div>
          </CardHeader>
          <CardContent className="pt-6">
            <AlgoHistoryChart data={chartData} />
          </CardContent>
        </Card>

        {/* Verdict & Signal Component */}
        <div className="space-y-6">
          <Card className="shadow-2xl border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base">Signal Intelligence</CardTitle>
              <CardDescription>Live algorithmic consensus based on active rules</CardDescription>
            </CardHeader>
            <CardContent>
              <SignalGauge signal={verdict.signal} strength={verdict.strength} />
              
              <div className="mt-6 space-y-3">
                <h4 className="text-xs font-bold text-surface-500 uppercase border-b border-white/5 pb-2">Rule Breakdown</h4>
                {verdict.reasoning.map((reason, i) => (
                  <div key={i} className="flex gap-2 items-start text-xs text-surface-300">
                    <div className="mt-1 h-1.5 w-1.5 rounded-full bg-brand-500 shrink-0" />
                    <span>{reason}</span>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>

          {/* Strategy Control Panel */}
          <Card className="shadow-2xl border-white/5">
            <CardHeader className="pb-2">
              <CardTitle className="text-base flex items-center gap-2">
                <Settings2 className="h-4 w-4" /> Strategy Controls
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-6 pt-4">
              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-xs text-surface-400">RSI Period: <span className="text-white font-mono">{strategy.rsiPeriod}</span></label>
                </div>
                <Slider 
                  value={[strategy.rsiPeriod]} 
                  min={7} 
                  max={28} 
                  step={1} 
                  onValueChange={([val]) => setStrategy(s => ({...s, rsiPeriod: val}))}
                />
              </div>

              <div className="space-y-3">
                <div className="flex justify-between">
                  <label className="text-xs text-surface-400">Stop-Loss %: <span className="text-red-400 font-mono">-{strategy.stopLossPct}%</span></label>
                </div>
                <Slider 
                  value={[strategy.stopLossPct]} 
                  min={1} 
                  max={15} 
                  step={0.5} 
                  onValueChange={([val]) => setStrategy(s => ({...s, stopLossPct: val}))}
                />
              </div>

              <div className="space-y-3 text-[11px] leading-relaxed p-3 bg-surface-200/50 rounded-lg border border-white/5">
                <div className="flex gap-2 items-start text-amber-500/80">
                  <AlertCircle className="h-3 w-3 mt-0.5 shrink-0" />
                  <p>Lowering the RSI period increases sensitivity but may generate more false signals (whipsaws).</p>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
