'use client';

import React, { useState } from 'react';
import { OfficerActionType, OfficerRole } from '@/lib/types';
import {
  X,
  Info,
  AlertTriangle,
} from 'lucide-react';

interface OfficerActionDialogProps {
  isOpen: boolean;
  onClose: () => void;
  applicationId: string;
  findingId?: string;
  findingTitle?: string;
  currentRole: OfficerRole;
  onConfirmAction: (params: {
    actionType: OfficerActionType;
    reason?: string;
    note?: string;
  }) => Promise<void>;
}

export function OfficerActionDialog({
  isOpen,
  onClose,
  applicationId,
  findingId,
  findingTitle,
  currentRole,
  onConfirmAction,
}: OfficerActionDialogProps) {
  const [selectedAction, setSelectedAction] = useState<OfficerActionType>('acknowledge');
  const [reason, setReason] = useState('');
  const [note, setNote] = useState('');
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [validationError, setValidationError] = useState<string | null>(null);

  if (!isOpen) return null;

  const requiresReason = selectedAction === 'dismiss' || selectedAction === 'clarification' || selectedAction === 'escalate';

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setValidationError(null);

    if (requiresReason && !reason.trim()) {
      setValidationError(
        selectedAction === 'dismiss'
          ? 'Mandatory statutory requirement: A specific dismissal rationale must be recorded.'
          : selectedAction === 'clarification'
          ? 'Mandatory statutory requirement: Enter specific clarification instructions for the applicant.'
          : 'Mandatory statutory requirement: State the escalation justification for senior committee review.'
      );
      return;
    }

    setIsSubmitting(true);
    try {
      await onConfirmAction({
        actionType: selectedAction,
        reason: reason.trim() || undefined,
        note: note.trim() || undefined,
      });
      setIsSubmitting(false);
      onClose();
    } catch {
      setIsSubmitting(false);
      setValidationError('Failed to record officer action in verifiable audit log.');
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/80 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="glass-card w-full max-w-lg rounded-xl transition-all duration-200 text-slate-100 shadow-2xl overflow-hidden"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Header */}
        <div className="p-4 sm:p-5 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
          <div>
            <h3 className="text-base font-bold text-white tracking-tight">Record Officer Action</h3>
            <p className="text-xs text-slate-400 mt-0.5">
              Target: <span className="font-mono text-blue-400">{applicationId}</span>
              {findingId && ` &bull; Finding ${findingId}`}
            </p>
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
            aria-label="Close"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Form Body */}
        <form onSubmit={handleSubmit} className="p-5 space-y-4 text-xs">
          {/* Statutory Officer Guardrail Notice */}
          <div className="p-3 rounded-xl bg-blue-950/40 border border-blue-500/30 text-blue-300 flex items-start gap-2.5">
            <Info className="w-4 h-4 text-blue-400 shrink-0 mt-0.5" />
            <div className="leading-relaxed">
              <strong>OFFICER DECISION-SUPPORT GUARDRAIL:</strong> In accordance with statutory scrutiny rules,
              preliminary officer actions are strictly restricted to <em>Acknowledge</em>, <em>Dismiss with reason</em>,
              <em>Request clarification</em>, and <em>Escalate</em>. Formal approval or rejection requires competent
              authority council sanction.
            </div>
          </div>

          {findingTitle && (
            <div className="p-2.5 rounded bg-slate-900 border border-white/5">
              <span className="text-[10.5px] uppercase font-bold text-slate-400 block tracking-wider">
                Target Finding:
              </span>
              <p className="font-semibold text-white mt-0.5">{findingTitle}</p>
            </div>
          )}

          {/* Action Radio Options */}
          <div className="space-y-2">
            <label className="font-bold text-white text-xs block">Select Permitted Officer Action:</label>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
              {/* 1. Acknowledge */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  selectedAction === 'acknowledge'
                    ? 'border-emerald-500 bg-emerald-950/20 text-white'
                    : 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="officerAction"
                  value="acknowledge"
                  checked={selectedAction === 'acknowledge'}
                  onChange={() => setSelectedAction('acknowledge')}
                  className="mt-0.5 text-emerald-500"
                />
                <div>
                  <span className="font-bold block text-xs">Acknowledge</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                    Confirm review of evidence into audit log.
                  </span>
                </div>
              </label>

              {/* 2. Dismiss with Reason */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  selectedAction === 'dismiss'
                    ? 'border-amber-500 bg-amber-950/20 text-white'
                    : 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="officerAction"
                  value="dismiss"
                  checked={selectedAction === 'dismiss'}
                  onChange={() => setSelectedAction('dismiss')}
                  className="mt-0.5 text-amber-500"
                />
                <div>
                  <span className="font-bold block text-xs">Dismiss with Reason</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                    Remove finding with logged rationale.
                  </span>
                </div>
              </label>

              {/* 3. Request Clarification */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  selectedAction === 'clarification'
                    ? 'border-blue-500 bg-blue-950/20 text-white'
                    : 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="officerAction"
                  value="clarification"
                  checked={selectedAction === 'clarification'}
                  onChange={() => setSelectedAction('clarification')}
                  className="mt-0.5 text-blue-500"
                />
                <div>
                  <span className="font-bold block text-xs">Request Clarification</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                    Solicit documentary reply from college.
                  </span>
                </div>
              </label>

              {/* 4. Escalate */}
              <label
                className={`p-3 rounded-xl border cursor-pointer flex items-start gap-2.5 transition-all ${
                  selectedAction === 'escalate'
                    ? 'border-purple-500 bg-purple-950/20 text-white'
                    : 'border-white/10 bg-slate-900/60 text-slate-300 hover:border-white/20'
                }`}
              >
                <input
                  type="radio"
                  name="officerAction"
                  value="escalate"
                  checked={selectedAction === 'escalate'}
                  onChange={() => setSelectedAction('escalate')}
                  className="mt-0.5 text-purple-500"
                />
                <div>
                  <span className="font-bold block text-xs">Escalate</span>
                  <span className="text-[11px] text-slate-400 block mt-0.5 leading-snug">
                    Refer case to Higher Standing Scrutiny.
                  </span>
                </div>
              </label>
            </div>
          </div>

          {/* Reason Input (Mandatory for Dismiss, Clarification, Escalate) */}
          {requiresReason && (
            <div className="space-y-1.5 pt-1">
              <label className="font-bold text-white text-xs block">
                {selectedAction === 'dismiss'
                  ? 'Mandatory Dismissal Rationale *'
                  : selectedAction === 'clarification'
                  ? 'Clarification Message for Institution *'
                  : 'Escalation Justification *'}
              </label>
              <textarea
                value={reason}
                onChange={(e) => {
                  setReason(e.target.value);
                  setValidationError(null);
                }}
                rows={3}
                placeholder={
                  selectedAction === 'dismiss'
                    ? 'State why this finding is dismissed (e.g. Supplementary Gazette order sighted)...'
                    : selectedAction === 'clarification'
                    ? 'Provide exact deficiency to be rectified by applicant...'
                    : 'State reasons for escalation (e.g. Serious structural discrepancy)...'
                }
                className="w-full bg-slate-900 border border-white/15 text-white rounded-lg p-2.5 text-xs focus:outline-none focus:border-blue-500"
              />
            </div>
          )}

          {/* Optional Officer Note */}
          <div className="space-y-1.5">
            <label className="font-bold text-slate-300 text-xs block">
              Internal Scrutiny Note (Optional)
            </label>
            <input
              type="text"
              value={note}
              onChange={(e) => setNote(e.target.value)}
              placeholder="Internal file remarks for peer reviewers..."
              className="glass-input w-full rounded-lg px-3 py-2 text-sm"
            />
          </div>

          {/* Validation Error Banner */}
          {validationError && (
            <div className="p-3 rounded-lg bg-rose-950/40 border border-rose-500/40 text-rose-300 text-xs flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 shrink-0" />
              <span>{validationError}</span>
            </div>
          )}

          {/* Action Buttons */}
          <div className="pt-3 border-t border-white/10 flex items-center justify-between">
            <span className="text-[11px] text-slate-400">
              Logged under: <strong className="text-white">{currentRole}</strong>
            </span>

            <div className="flex items-center gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium transition-colors"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={isSubmitting}
                className="px-4 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
              >
                {isSubmitting ? 'Recording Action...' : 'Record Action & Append Audit'}
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}
