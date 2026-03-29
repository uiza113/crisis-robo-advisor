"use client";

import React from 'react';
import { TradeSignal } from '@/types';

interface SignalGaugeProps {
  strength: number; // 0-100
  signal: TradeSignal;
}

export const SignalGauge: React.FC<SignalGaugeProps> = ({ strength, signal }) => {
  // Map 0-100 to rotation degrees (-90 to 90)
  const rotation = (strength / 100) * 180 - 90;

  const getSignalColor = () => {
    if (signal === 'buy') return 'text-emerald-400 glow-text-success';
    if (signal === 'sell') return 'text-rose-400 glow-text-error';
    return 'text-surface-400';
  };

  const getSignalBg = () => {
    if (signal === 'buy') return 'from-emerald-500/20 to-transparent';
    if (signal === 'sell') return 'from-rose-500/20 to-transparent';
    return 'from-surface-500/10 to-transparent';
  };

  return (
    <div className="relative flex flex-col items-center justify-center h-48 w-full overflow-hidden">
      {/* Gauge Background Arc */}
      <div className="absolute top-8 w-64 h-32 border-8 border-surface-200/20 rounded-t-full" />
      
      {/* Dynamic Color Overlay */}
      <div className={`absolute top-8 w-64 h-32 border-8 border-transparent rounded-t-full bg-gradient-to-t ${getSignalBg()} opacity-50`} />

      {/* Ticks */}
      <div className="absolute top-[136px] flex justify-between w-64 px-4 text-[10px] font-mono text-surface-500">
        <span>SELL</span>
        <span>NEUTRAL</span>
        <span>BUY</span>
      </div>

      {/* Needle Pivot */}
      <div className="absolute bottom-8 w-4 h-4 rounded-full bg-white shadow-lg z-10" />

      {/* Needle */}
      <div 
        className="absolute bottom-10 w-1 h-24 bg-gradient-to-t from-white to-white/20 origin-bottom transition-transform duration-1000 ease-out z-0"
        style={{ transform: `rotate(${rotation}deg)` }}
      />

      {/* Center Label */}
      <div className="absolute bottom-12 flex flex-col items-center">
        <span className={`text-3xl font-black tracking-widest uppercase transition-all duration-500 ${getSignalColor()}`}>
          {signal}
        </span>
        <span className="text-[10px] font-bold font-mono text-surface-400 mt-1">
          STRENGTH {strength}%
        </span>
      </div>
    </div>
  );
};
