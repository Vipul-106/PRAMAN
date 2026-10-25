'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { ApplicationRecord } from '@/lib/types';
import { CategoryBadge } from './status-badge';
import { formatDate } from '@/lib/format';
import {
  ArrowRight,
  Info,
  ShieldAlert,
  ChevronDown,
  ChevronUp,
} from 'lucide-react';

interface PriorityQueueProps {
  applications: ApplicationRecord[];
  limit?: number;
}

export function PriorityQueue({ applications, limit }: PriorityQueueProps) {
  const [expandedScoreId, setExpandedScoreId] = useState<string | null>(null);

  // Sort descending by priorityScore
  const sortedApps = [...applications].sort(
    (a, b) => b.priorityScore - a.priorityScore
  );
  const displayApps = limit ? sortedApps.slice(0, limit) : sortedApps;

  const toggleScoreBreakdown = (id: string, e: React.MouseEvent) => {
    e.stopPropagation();
    e.preventDefault();
    setExpandedScoreId(expandedScoreId === id ? null : id);
  };

  const getPriorityScoreBadge = (score: number) => {
    if (score >= 75) {
      return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    }
    if (score >= 40) {
      return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    }
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  };

  return (
    <div className="glass-card rounded-xl transition-all duration-200 overflow-hidden">
      <div className="p-4 border-b border-white/10 flex items-center justify-between">
        <div>
          <h3 className="text-sm font-bold text-white flex items-center gap-2">
            <span>High-Priority Scrutiny Queue</span>
            <span className="text-[11px] font-semibold px-2 py-0.5 rounded-full bg-blue-500/10 text-blue-400 border border-blue-500/20">
              Ranked by Risk Weight
            </span>
          </h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Automated triage ranking to assist officer review. Triage score is advisory, not an automated judgment.
          </p>
        </div>
        <Link
          href="/applications"
          className="text-xs text-blue-400 hover:text-blue-300 font-medium inline-flex items-center gap-1"
        >
          View all applications ({applications.length}) &rarr;
        </Link>
      </div>

      <div className="divide-y divide-white/5">
        {displayApps.map((app) => {
          const isExpanded = expandedScoreId === app.id;
          const topFinding = app.findings[0];

          return (
            <div
              key={app.id}
              className="p-4 hover:bg-slate-900/60 transition-colors"
            >
              <div className="flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                {/* Left: Identifiers & Institution */}
                <div className="space-y-1.5 min-w-[280px]">
                  <div className="flex items-center gap-2">
                    <span className="text-xs font-mono font-bold text-blue-400">
                      {app.referenceNumber}
                    </span>
                    <CategoryBadge category={app.category} />
                    <span className="text-[11px] text-slate-400">
                      Submitted {formatDate(app.submittedAt)}
                    </span>
                  </div>

                  <h4 className="text-sm font-semibold text-white">
                    {app.institutionName}
                  </h4>
                  <p className="text-xs text-slate-400">
                    {app.region} Region &bull; Code: {app.institutionId} &bull; Intake: {app.requestedIntake} Seats
                  </p>
                </div>

                {/* Middle: Priority Score + Expandable Breakdown */}
                <div className="relative">
                  <button
                    onClick={(e) => toggleScoreBreakdown(app.id, e)}
                    className={`inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-semibold transition-all hover:bg-white/5 ${getPriorityScoreBadge(
                      app.priorityScore
                    )}`}
                    title="Click to view weighted scoring breakdown"
                  >
                    <span>Priority Score: {app.priorityScore}/100</span>
                    <Info className="w-3.5 h-3.5 opacity-70" />
                    {isExpanded ? (
                      <ChevronUp className="w-3.5 h-3.5" />
                    ) : (
                      <ChevronDown className="w-3.5 h-3.5" />
                    )}
                  </button>

                  {/* Popover / Inline Score Breakdown */}
                  {isExpanded && (
                    <div className="absolute right-0 top-full mt-2 w-80 sm:w-96 p-4 rounded-xl bg-slate-900 border border-white/15 shadow-2xl z-40 text-left">
                      <div className="flex items-center justify-between pb-2 border-b border-white/10 mb-2">
                        <span className="text-xs font-bold text-white">
                          Priority Triage Breakdown
                        </span>
                        <span className="text-xs font-mono font-bold text-blue-400">
                          Total: {app.priorityScore}
                        </span>
                      </div>
                      <div className="space-y-2 text-xs">
                        {app.priorityBreakdown.factors.map((factor, idx) => (
                          <div key={idx} className="flex items-start justify-between gap-2">
                            <div>
                              <p className="font-medium text-slate-200">
                                {factor.factor}
                              </p>
                              <p className="text-[11px] text-slate-400 leading-tight">
                                {factor.explanation}
                              </p>
                            </div>
                            <span
                              className={`font-mono font-bold text-xs shrink-0 ${
                                factor.contribution > 0
                                  ? 'text-rose-400'
                                  : 'text-emerald-400'
                              }`}
                            >
                              {factor.contribution > 0 ? `+${factor.contribution}` : factor.contribution}
                            </span>
                          </div>
                        ))}
                      </div>
                      <p className="mt-3 pt-2 border-t border-white/5 text-[10.5px] text-slate-400 italic">
                        Score indicates risk triage urgency to guide officer queue sorting.
                      </p>
                    </div>
                  )}
                </div>

                {/* Right: Key Issue & Open Workspace */}
                <div className="flex items-center justify-between lg:justify-end gap-4 min-w-[240px]">
                  <div className="text-left lg:text-right">
                    {topFinding ? (
                      <div className="flex items-center lg:justify-end gap-1.5 text-xs text-rose-300">
                        <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                        <span className="truncate max-w-[200px]" title={topFinding.title}>
                          {topFinding.title}
                        </span>
                      </div>
                    ) : (
                      <span className="text-xs text-emerald-400 font-medium">
                        Standard clearance profile
                      </span>
                    )}
                    <p className="text-[11px] text-slate-400 mt-0.5">
                      Status: <span className="text-slate-200 font-medium">{app.status}</span>
                    </p>
                  </div>

                  <Link
                    href={`/applications/${app.id}`}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/30 hover:bg-blue-600/50 text-white text-xs font-semibold border border-blue-500/40 transition-all shrink-0 shadow-sm"
                  >
                    <span>Open Case</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
