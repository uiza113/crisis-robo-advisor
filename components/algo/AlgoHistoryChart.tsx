"use client";

import React from "react";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  ReferenceLine,
  Area,
  AreaChart,
} from "recharts";
import { MarketDataPoint } from "@/types";

interface AlgoHistoryChartProps {
  data: (MarketDataPoint & { sma50?: number; sma200?: number; rsi?: number })[];
}

export const AlgoHistoryChart: React.FC<AlgoHistoryChartProps> = ({ data }) => {
  return (
    <div className="space-y-4 w-full h-[500px]">
      {/* Price + SMA Chart */}
      <div className="h-[300px] w-full bg-surface-200/20 rounded-lg p-2 border border-white/5">
        <ResponsiveContainer width="100%" height="100%">
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              hide 
            />
            <YAxis 
              domain={['auto', 'auto']} 
              orientation="right" 
              stroke="#666" 
              fontSize={10} 
              tickFormatter={(val) => `$${(val / 1000).toFixed(1)}k`}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '12px' }}
              labelStyle={{ display: 'none' }}
            />
            <Line 
              type="monotone" 
              dataKey="price" 
              stroke="#06b6d4" 
              strokeWidth={2.5} 
              dot={false} 
              name="Price"
              className="drop-shadow-[0_0_8px_rgba(6,182,212,0.4)]"
            />
            <Line 
              type="monotone" 
              dataKey="sma50" 
              stroke="#8b5cf6" 
              strokeWidth={1.5} 
              dot={false} 
              name="SMA 50"
              strokeDasharray="5 5"
            />
            <Line 
              type="monotone" 
              dataKey="sma200" 
              stroke="#f59e0b" 
              strokeWidth={1.5} 
              dot={false} 
              name="SMA 200"
            />
          </LineChart>
        </ResponsiveContainer>
      </div>

      {/* RSI Chart */}
      <div className="h-[150px] w-full bg-surface-200/20 rounded-lg p-2 border border-white/5">
        <ResponsiveContainer width="100%" height="100%">
          <AreaChart data={data}>
            <CartesianGrid strokeDasharray="3 3" stroke="#333" vertical={false} />
            <XAxis 
              dataKey="timestamp" 
              tickFormatter={(str) => new Date(str).toLocaleDateString()} 
              stroke="#666" 
              fontSize={10}
            />
            <YAxis 
              domain={[0, 100]} 
              orientation="right" 
              stroke="#666" 
              fontSize={10} 
              ticks={[30, 70]}
            />
            <Tooltip 
              contentStyle={{ backgroundColor: '#111', border: '1px solid #333', fontSize: '12px' }}
              labelStyle={{ display: 'none' }}
            />
            <ReferenceLine y={70} stroke="#ef4444" strokeDasharray="3 3" label={{ position: 'right', value: '70', fill: '#ef4444', fontSize: 10 }} />
            <ReferenceLine y={30} stroke="#10b981" strokeDasharray="3 3" label={{ position: 'right', value: '30', fill: '#10b981', fontSize: 10 }} />
            <Area 
              type="monotone" 
              dataKey="rsi" 
              stroke="#a78bfa" 
              fill="rgba(167, 139, 250, 0.15)" 
              name="RSI"
            />
          </AreaChart>
        </ResponsiveContainer>
      </div>
    </div>
  );
};
