'use client';

import React, { useState } from 'react';
import { ValidationRule, OfficerRole } from '@/lib/types';
import { SeverityBadge } from './status-badge';
import { dryRunRuleChange, DryRunResult } from '@/lib/validation-engine';
import { useSession } from '@/lib/session-context';
import {
  Play,
  RotateCcw,
  CheckCircle2,
  Info,
  Lock,
} from 'lucide-react';

interface RuleEditorProps {
  currentRole: OfficerRole;
}

export function RuleEditor({ currentRole }: RuleEditorProps) {
  const { rules, updateRules, resetRules, addAuditEvent } = useSession();
  const [localRules, setLocalRules] = useState<ValidationRule[]>([...rules]);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);
  const [isDryRunning, setIsDryRunning] = useState(false);
  const [sessionAppliedMessage, setSessionAppliedMessage] = useState<string | null>(null);

  const isAdmin = currentRole === 'Administrator';

  const handleToggleRule = (ruleId: string) => {
    if (!isAdmin) return;
    setLocalRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
    setSessionAppliedMessage(null);
  };

  const handleExecuteDryRun = async () => {
    setIsDryRunning(true);
    setSessionAppliedMessage(null);

    const result = dryRunRuleChange(localRules);
    setDryRunResult(result);
    setIsDryRunning(false);

    await addAuditEvent({
      action: 'DRY_RUN_RULES_SIMULATION',
      applicationId: 'RULES-DRY-RUN',
      details: `Executed dry-run on ${localRules.length} rules. Impact: ${result.affectedApplicationIds.length} applications affected (${result.addedFindings.length} added, ${result.removedFindings.length} cleared).`,
    });
  };

  const handleApplyToSession = () => {
    if (!isAdmin) return;
    updateRules(localRules);
    setSessionAppliedMessage('Rules successfully applied to active officer session.');
  };

  const handleResetToBaseline = () => {
    resetRules();
    setLocalRules([...rules]);
    setDryRunResult(null);
    setSessionAppliedMessage('Rule set reset to canonical baseline.');
  };

  return (
    <div className="space-y-6">
      {/* Role Restriction Banner if non-admin */}
      {!isAdmin && (
        <div className="p-4 rounded-xl bg-amber-500/10 border border-amber-500/30 text-amber-300 flex items-start gap-3 text-xs">
          <Lock className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
          <div className="space-y-1">
            <span className="font-bold text-white uppercase tracking-wider text-[11px]">
              READ-ONLY RULE ACCESS ({currentRole} Role)
            </span>
            <p>
              Only authorized <strong>Administrator</strong> accounts can modify statutory rule
              toggles or adjust threshold parameters. Switch to Administrator using the top bar role
              switcher to test dry-run modifications.
            </p>
          </div>
        </div>
      )}

      {/* Statutory Advisory Notice */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">PROTOTYPE RULE CONFIGURATION:</span> Regulatory rules
          and validation logic reflect configurable demo models. Authoritative AICTE scrutiny rules
          require formal mapping to the official Approval Process Handbook (APH) and committee sanction.
        </div>
      </div>

      {/* Control Actions Bar */}
      <div className="gov-card p-4 rounded-xl border border-white/10 flex flex-col sm:flex-row sm:items-center justify-between gap-4">
        <div className="flex items-center gap-2">
          <span className="text-xs text-slate-400 font-semibold">
            Configured Rules: <strong className="text-white">{localRules.length}</strong>
          </span>
          <span className="text-[11px] text-slate-500">&bull;</span>
          <span className="text-xs text-emerald-400 font-semibold">
            {localRules.filter((r) => r.enabled).length} Enabled
          </span>
        </div>

        <div className="flex items-center gap-2">
          <button
            onClick={handleExecuteDryRun}
            disabled={isDryRunning}
            className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isDryRunning ? 'animate-spin' : ''}`} />
            <span>Execute Dry Run</span>
          </button>

          {isAdmin && (
            <>
              <button
                onClick={handleApplyToSession}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Apply to Session</span>
              </button>

              <button
                onClick={handleResetToBaseline}
                className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs font-medium border border-white/10 transition-colors"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset Defaults</span>
              </button>
            </>
          )}
        </div>
      </div>

      {sessionAppliedMessage && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>{sessionAppliedMessage}</span>
        </div>
      )}

      {/* Dry Run Simulation Impact Report */}
      {dryRunResult && (
        <div className="gov-card p-5 rounded-xl border border-blue-500/40 bg-blue-950/20 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-blue-500/20">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Dry-Run Impact Analysis</h3>
            </div>
            <span className="text-xs text-blue-300 font-mono">
              {dryRunResult.affectedApplicationIds.length} Cases Affected
            </span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Newly Added Flags</span>
              <p className="text-xl font-bold text-rose-400">+{dryRunResult.addedFindings.length}</p>
              <p className="text-[11px] text-slate-500">More stringent compliance thresholds</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Cleared Discrepancies</span>
              <p className="text-xl font-bold text-emerald-400">-{dryRunResult.removedFindings.length}</p>
              <p className="text-[11px] text-slate-500">Relaxed or disabled validation rules</p>
            </div>

            <div className="p-3 rounded-lg bg-slate-900 border border-white/10 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Affected Case IDs</span>
              <p className="text-xs font-mono text-slate-300 truncate">
                {dryRunResult.affectedApplicationIds.join(', ') || 'None'}
              </p>
              <p className="text-[11px] text-slate-500">Triage scores will recalculate</p>
            </div>
          </div>
        </div>
      )}

      {/* Rule Cards List */}
      <div className="space-y-3">
        {localRules.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 rounded-xl border transition-all ${
              rule.enabled
                ? 'bg-slate-900/80 border-white/10'
                : 'bg-slate-950/40 border-white/5 opacity-60'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-start justify-between gap-3">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                    {rule.id}
                  </span>
                  <span className="text-xs font-mono uppercase text-slate-400">
                    Category: {rule.category.replace('_', ' ')}
                  </span>
                  <SeverityBadge severity={rule.severity} />
                </div>
                <h4 className="text-sm font-bold text-white">{rule.title}</h4>
                <p className="text-xs text-slate-300 leading-relaxed">{rule.description}</p>
                <div className="p-2.5 rounded bg-slate-950/60 border border-white/5 text-[11px] text-slate-400 mt-2">
                  <strong>Trigger Condition:</strong> <span className="font-mono text-slate-300">{rule.condition}</span>
                </div>
              </div>

              {/* Toggle Switch */}
              <div className="flex items-center gap-2 shrink-0 pt-1">
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  disabled={!isAdmin}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all ${
                    rule.enabled
                      ? 'bg-emerald-600/20 text-emerald-400 border border-emerald-500/30 hover:bg-emerald-600/30'
                      : 'bg-slate-800 text-slate-400 border border-white/10 hover:bg-slate-700'
                  } disabled:opacity-40 disabled:cursor-not-allowed`}
                >
                  {rule.enabled ? 'Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
