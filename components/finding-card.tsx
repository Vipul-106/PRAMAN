'use client';

import React, { useState } from 'react';
import { ValidationFinding, DocumentRecord } from '@/lib/types';
import { SeverityBadge } from './status-badge';
import { EvidenceModal } from './evidence-modal';
import {
  FileSearch,
  ArrowRight,
} from 'lucide-react';

interface FindingCardProps {
  finding: ValidationFinding;
  document?: DocumentRecord;
  onSelectFinding?: (finding: ValidationFinding) => void;
  onOpenActionDialog?: (finding: ValidationFinding) => void;
}

export function FindingCard({
  finding,
  document,
  onSelectFinding,
  onOpenActionDialog,
}: FindingCardProps) {
  const [isEvidenceOpen, setIsEvidenceOpen] = useState(false);

  const isCriticalOrHigh = finding.severity === 'critical' || finding.severity === 'high';

  return (
    <>
      <div
        className={`p-4 sm:p-5 rounded-xl border transition-all space-y-3.5 bg-slate-900/80 ${
          finding.status === 'dismissed'
            ? 'opacity-60 border-white/5 bg-slate-950/40'
            : isCriticalOrHigh
            ? 'border-rose-500/30 hover:border-rose-500/50 shadow-md shadow-rose-950/20'
            : 'border-white/10 hover:border-white/20'
        }`}
      >
        {/* Header with Rule ID, Title & Severity */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
          <div className="flex items-center gap-2">
            <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
              {finding.ruleId}
            </span>
            <h4 className="text-sm font-bold text-white tracking-tight">{finding.title}</h4>
          </div>

          <div className="flex items-center gap-2">
            {finding.status !== 'active' && (
              <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 border border-white/10 font-medium capitalize">
                {finding.status.replace('_', ' ')}
              </span>
            )}
            <SeverityBadge severity={finding.severity} />
          </div>
        </div>

        {/* Reason */}
        <p className="text-xs text-slate-300 leading-relaxed">
          {finding.reason}
        </p>

        {/* Value Comparison Pill */}
        <div className="p-3 rounded-lg bg-slate-950/80 border border-white/5 grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Submitted in Document:
            </span>
            <span className="font-mono text-rose-300 font-semibold break-words">
              {finding.submittedValue}
            </span>
          </div>

          <div>
            <span className="text-[10px] uppercase font-bold text-slate-400 block tracking-wider">
              Registry Baseline:
            </span>
            <span className="font-mono text-emerald-300 font-semibold break-words">
              {finding.recordValue}
            </span>
          </div>
        </div>

        {/* Why Flagged & Would Clear If */}
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs">
          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-slate-400 tracking-wider">
              Source Evidence
            </span>
            <p className="text-slate-300 text-[11px]">
              {finding.evidence.documentName} &bull; Page {finding.evidence.page || 1}
            </p>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] font-bold uppercase text-emerald-400 tracking-wider">
              Would Clear If
            </span>
            <p className="text-slate-300 text-[11px]">
              {finding.wouldClearIf}
            </p>
          </div>
        </div>

        {/* Recommendation & Actions Row */}
        <div className="pt-3 border-t border-white/5 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <p className="text-blue-300 text-[11.5px] flex items-center gap-1.5">
            <span className="font-semibold text-slate-400">Next Step:</span>
            <span>{finding.recommendation}</span>
          </p>

          <div className="flex items-center gap-2 shrink-0">
            <button
              onClick={() => {
                if (onSelectFinding) onSelectFinding(finding);
                setIsEvidenceOpen(true);
              }}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-semibold border border-white/10 transition-colors"
            >
              <FileSearch className="w-3.5 h-3.5 text-blue-400" />
              <span>View Evidence</span>
            </button>

            {onOpenActionDialog && (
              <button
                onClick={() => onOpenActionDialog(finding)}
                className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <span>Officer Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>

      {/* Evidence Modal */}
      <EvidenceModal
        finding={finding}
        document={document}
        isOpen={isEvidenceOpen}
        onClose={() => setIsEvidenceOpen(false)}
        onTakeAction={() => onOpenActionDialog && onOpenActionDialog(finding)}
      />
    </>
  );
}
