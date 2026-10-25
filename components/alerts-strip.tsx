'use client';

import React from 'react';
import Link from 'next/link';
import { SystemAlert } from '@/lib/types';
import { AlertCircle, AlertTriangle, ShieldAlert, ArrowRight, HelpCircle } from 'lucide-react';

interface AlertsStripProps {
  alerts: SystemAlert[];
  onDismiss?: (id: string) => void;
}

export function AlertsStrip({ alerts }: AlertsStripProps) {
  if (alerts.length === 0) return null;

  const getAlertIcon = (type: SystemAlert['type']) => {
    switch (type) {
      case 'potential_anomaly':
        return <ShieldAlert className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'expired_doc':
        return <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />;
      case 'unavailable_source':
        return <HelpCircle className="w-4 h-4 text-amber-400 shrink-0" />;
      case 'infrastructure_gap':
      case 'missing_doc':
      default:
        return <AlertCircle className="w-4 h-4 text-amber-400 shrink-0" />;
    }
  };

  const getAlertStyle = (severity: SystemAlert['severity']) => {
    if (severity === 'critical') {
      return 'bg-rose-950/40 border-rose-500/30 text-rose-200';
    }
    if (severity === 'high') {
      return 'bg-rose-950/20 border-rose-500/20 text-rose-300';
    }
    return 'bg-amber-950/20 border-amber-500/20 text-amber-200';
  };

  return (
    <div className="space-y-2 mb-6">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-rose-500 animate-pulse" />
          <h3 className="text-xs font-semibold uppercase tracking-wider text-slate-400">
            Critical Triage Alerts ({alerts.length})
          </h3>
        </div>
        <span className="text-[11px] text-slate-500">
          Advisory indicators requiring officer scrutiny
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
        {alerts.map((alert) => (
          <div
            key={alert.id}
            className={`p-3.5 rounded-xl border flex flex-col justify-between transition-all hover:border-white/20 ${getAlertStyle(
              alert.severity
            )}`}
          >
            <div>
              <div className="flex items-start justify-between gap-2">
                <div className="flex items-center gap-2">
                  {getAlertIcon(alert.type)}
                  <span className="text-xs font-bold leading-tight">
                    {alert.title}
                  </span>
                </div>
                <span className="text-[10px] px-1.5 py-0.2 rounded font-semibold uppercase tracking-wider bg-black/30 border border-white/10">
                  {alert.severity}
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-2 line-clamp-2 leading-relaxed">
                {alert.message}
              </p>
            </div>

            <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-xs">
              <span className="text-[11px] text-slate-400 font-mono truncate max-w-[180px]">
                {alert.institutionName}
              </span>
              <Link
                href={`/applications/${alert.applicationId}`}
                className="inline-flex items-center gap-1 font-semibold text-white hover:text-blue-300 transition-colors"
              >
                <span>Case {alert.applicationRef.split('/').pop()}</span>
                <ArrowRight className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
