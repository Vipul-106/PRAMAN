'use client';

import React from 'react';
import { ValidationFinding, DocumentRecord } from '@/lib/types';
import { SeverityBadge } from './status-badge';
import {
  X,
  FileText,
  Database,
  ArrowRight,
  Info,
} from 'lucide-react';

interface EvidenceModalProps {
  finding: ValidationFinding;
  document?: DocumentRecord;
  isOpen: boolean;
  onClose: () => void;
  onTakeAction?: () => void;
}

export function EvidenceModal({
  finding,
  isOpen,
  onClose,
  onTakeAction,
}: EvidenceModalProps) {
  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="gov-card w-full max-w-2xl rounded-2xl border border-white/20 bg-slate-950 text-slate-100 shadow-2xl overflow-hidden flex flex-col max-h-[90vh]"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Modal Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/90 flex items-start justify-between gap-4">
          <div className="space-y-1">
            <div className="flex items-center gap-2">
              <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                {finding.ruleId}
              </span>
              <SeverityBadge severity={finding.severity} />
            </div>
            <h3 className="text-base font-bold text-white tracking-tight">{finding.title}</h3>
          </div>

          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close dialog"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-5 overflow-y-auto space-y-5 text-xs">
          {/* Statutory Safeguard Disclaimer */}
          <div className="p-3 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>ADVISORY DISCREPANCY EVIDENCE:</strong> Findings are automated decision-support flags.
              This finding requires human scrutiny by an authorized officer prior to any formal statutory order.
            </div>
          </div>

          {/* Side-by-Side Comparison Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            {/* Submitted Value */}
            <div className="p-4 rounded-xl bg-slate-900 border border-rose-500/30 space-y-2">
              <div className="flex items-center gap-2 text-rose-300 font-bold uppercase text-[10px] tracking-wider">
                <FileText className="w-3.5 h-3.5" />
                <span>Submitted Value (Applicant Document)</span>
              </div>
              <div className="text-sm font-mono font-bold text-white break-words">
                {finding.submittedValue}
              </div>
              <p className="text-[11px] text-slate-400">
                Source: {finding.evidence.documentName} &bull; Page {finding.evidence.page || 1}
              </p>
            </div>

            {/* Expected Record Value */}
            <div className="p-4 rounded-xl bg-slate-900 border border-emerald-500/30 space-y-2">
              <div className="flex items-center gap-2 text-emerald-300 font-bold uppercase text-[10px] tracking-wider">
                <Database className="w-3.5 h-3.5" />
                <span>Authoritative Institutional Baseline</span>
              </div>
              <div className="text-sm font-mono font-bold text-white break-words">
                {finding.recordValue}
              </div>
              <p className="text-[11px] text-slate-400">
                Registry: AICTE Approval Process Records / Central Database
              </p>
            </div>
          </div>

          {/* Reason & Detailed Flag Analysis */}
          <div className="gov-card p-4 rounded-xl border border-white/10 space-y-2 bg-slate-900/50">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Why This Was Flagged
            </span>
            <p className="text-slate-200 leading-relaxed text-xs">
              {finding.reason}
            </p>
          </div>

          {/* Remediation & Recommendation */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/10 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Would Clear If
              </span>
              <p className="text-emerald-300 text-xs">
                {finding.wouldClearIf}
              </p>
            </div>

            <div className="p-3.5 rounded-xl bg-slate-900/40 border border-white/10 space-y-1.5">
              <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                Recommended Officer Action
              </span>
              <p className="text-blue-300 text-xs">
                {finding.recommendation}
              </p>
            </div>
          </div>

          {/* Simulated Bounding Box Coordinates */}
          {finding.evidence.bbox && (
            <div className="p-3 rounded-lg bg-slate-950 border border-white/5 font-mono text-[11px] text-slate-400 flex items-center justify-between">
              <span>Coordinate Bounding Box:</span>
              <span className="text-blue-400">
                [x: {finding.evidence.bbox.x}, y: {finding.evidence.bbox.y}, w: {finding.evidence.bbox.width}, h: {finding.evidence.bbox.height}]
              </span>
            </div>
          )}
        </div>

        {/* Modal Footer with Officer Action Trigger */}
        <div className="p-4 bg-slate-900/90 border-t border-white/10 flex items-center justify-between gap-3">
          <span className="text-[11px] text-slate-400">
            Status: <strong className="text-white capitalize">{finding.status}</strong>
          </span>

          <div className="flex items-center gap-2">
            <button
              onClick={onClose}
              className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium transition-colors"
            >
              Close
            </button>
            {onTakeAction && (
              <button
                onClick={() => {
                  onClose();
                  onTakeAction();
                }}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
              >
                <span>Take Officer Action</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
