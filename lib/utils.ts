// ============================================================
// Utility helpers
// ============================================================
import { type ClassValue, clsx } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

export function formatCurrency(value: number): string {
  return new Intl.NumberFormat('en-US', {
    style: 'currency',
    currency: 'USD',
    minimumFractionDigits: 0,
    maximumFractionDigits: 0,
  }).format(value);
}

export function formatPercent(value: number, decimals = 1): string {
  return `${value.toFixed(decimals)}%`;
}

export function formatDate(dateStr: string): string {
  return new Date(dateStr).toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
  });
}

export function formatDateTime(dateStr: string): string {
  return new Date(dateStr).toLocaleString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  });
}

export function timeAgo(dateStr: string): string {
  const now = new Date();
  const past = new Date(dateStr);
  const diffMs = now.getTime() - past.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays === 0) return 'Today';
  if (diffDays === 1) return 'Yesterday';
  if (diffDays < 7) return `${diffDays} days ago`;
  if (diffDays < 30) return `${Math.floor(diffDays / 7)} weeks ago`;
  if (diffDays < 365) return `${Math.floor(diffDays / 30)} months ago`;
  return `${Math.floor(diffDays / 365)} years ago`;
}

export function severityColor(severity: string): string {
  switch (severity) {
    case 'normal': return 'text-emerald-400';
    case 'mild': return 'text-amber-400';
    case 'severe': return 'text-orange-400';
    case 'dislocation': return 'text-red-400';
    default: return 'text-slate-400';
  }
}

export function severityBg(severity: string): string {
  switch (severity) {
    case 'normal': return 'bg-emerald-500/10 border-emerald-500/20';
    case 'mild': return 'bg-amber-500/10 border-amber-500/20';
    case 'severe': return 'bg-orange-500/10 border-orange-500/20';
    case 'dislocation': return 'bg-red-500/10 border-red-500/20';
    default: return 'bg-slate-500/10 border-slate-500/20';
  }
}

export function actionLabel(action: string): string {
  switch (action) {
    case 'stay': return 'Stay the Course';
    case 'rebalance': return 'Rebalance to Target';
    case 'refresh-profile': return 'Update Risk Profile';
    case 'escalate': return 'Escalate to Human Adviser';
    default: return action;
  }
}

export function actionColor(action: string): string {
  switch (action) {
    case 'stay': return 'text-emerald-400 bg-emerald-500/10';
    case 'rebalance': return 'text-blue-400 bg-blue-500/10';
    case 'refresh-profile': return 'text-amber-400 bg-amber-500/10';
    case 'escalate': return 'text-red-400 bg-red-500/10';
    default: return 'text-slate-400 bg-slate-500/10';
  }
}
