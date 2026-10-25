'use client';

import React from 'react';
import { LucideIcon } from 'lucide-react';

interface MetricCardProps {
  title: string;
  value: string | number;
  subtitle?: string;
  icon: LucideIcon;
  variant?: 'default' | 'success' | 'warning' | 'danger' | 'info';
  actionLabel?: string;
  onAction?: () => void;
  className?: string;
}

export function MetricCard({
  title,
  value,
  subtitle,
  icon: Icon,
  variant = 'default',
  actionLabel,
  onAction,
  className = '',
}: MetricCardProps) {
  const getVariantStyles = () => {
    switch (variant) {
      case 'success':
        return {
          glow: 'hover:border-emerald-500/30',
          iconBg: 'bg-emerald-500/10 text-emerald-400 border-emerald-500/20',
          accent: 'text-emerald-400',
        };
      case 'warning':
        return {
          glow: 'hover:border-amber-500/30',
          iconBg: 'bg-amber-500/10 text-amber-400 border-amber-500/20',
          accent: 'text-amber-400',
        };
      case 'danger':
        return {
          glow: 'hover:border-rose-500/30',
          iconBg: 'bg-rose-500/10 text-rose-400 border-rose-500/20',
          accent: 'text-rose-400',
        };
      case 'info':
        return {
          glow: 'hover:border-indigo-500/30',
          iconBg: 'bg-indigo-500/10 text-indigo-400 border-indigo-500/20',
          accent: 'text-indigo-400',
        };
      default:
        return {
          glow: 'hover:border-blue-500/30',
          iconBg: 'bg-blue-500/10 text-blue-400 border-blue-500/20',
          accent: 'text-slate-200',
        };
    }
  };

  const styles = getVariantStyles();

  return (
    <div
      className={`glass-card p-5 rounded-xl transition-all duration-200 ${styles.glow} ${className}`}
    >
      <div className="flex items-start justify-between">
        <div className="space-y-1">
          <p className="text-xs font-medium uppercase tracking-wider text-slate-400">
            {title}
          </p>
          <div className="flex items-baseline gap-2">
            <span className="text-2xl font-bold tracking-tight text-white">
              {value}
            </span>
          </div>
        </div>
        <div className={`p-2.5 rounded-lg border ${styles.iconBg}`}>
          <Icon className="w-5 h-5" />
        </div>
      </div>

      {(subtitle || actionLabel) && (
        <div className="mt-3 pt-3 border-t border-white/5 flex items-center justify-between text-xs">
          {subtitle && <span className="text-slate-400">{subtitle}</span>}
          {actionLabel && onAction && (
            <button
              onClick={onAction}
              className={`font-medium hover:underline focus:outline-none ${styles.accent}`}
            >
              {actionLabel} &rarr;
            </button>
          )}
        </div>
      )}
    </div>
  );
}
