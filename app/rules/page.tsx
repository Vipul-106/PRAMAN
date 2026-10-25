'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { SeverityBadge } from '@/components/status-badge';
import { mockDatabase } from '@/lib/mock-data';
import { ValidationRule } from '@/lib/types';
import { dryRunRuleChange, DryRunResult } from '@/lib/validation-engine';
import {
  SlidersHorizontal,
  Play,
  RotateCcw,
  CheckCircle2,
  Info,
  Shield,
  Layers,
} from 'lucide-react';

export default function RuleEditorPage() {
  const [rules, setRules] = useState<ValidationRule[]>([...mockDatabase.rules]);
  const [dryRunResult, setDryRunResult] = useState<DryRunResult | null>(null);
  const [sessionApplied, setSessionApplied] = useState(false);

  const handleToggleRule = (ruleId: string) => {
    setRules((prev) =>
      prev.map((r) => (r.id === ruleId ? { ...r, enabled: !r.enabled } : r))
    );
    setSessionApplied(false);
  };

  const handleRunDryRun = () => {
    const result = dryRunRuleChange(rules);
    setDryRunResult(result);
  };

  const handleReset = () => {
    setRules([...mockDatabase.rules]);
    setDryRunResult(null);
    setSessionApplied(false);
  };

  const handleApplyToSession = () => {
    setSessionApplied(true);
  };

  return (
    <AppShell>
      <PageHeader
        title="Regulatory Rule Configuration & Dry-Run Simulator"
        description="Inspect active regulatory rules, simulate parameter alterations against the synthetic dataset, and review impact before session enforcement."
        breadcrumbs={[{ label: 'Rule Editor' }]}
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleRunDryRun}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
            >
              <Play className="w-3.5 h-3.5" />
              <span>Execute Dry Run</span>
            </button>
            <button
              onClick={handleReset}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 border border-white/10 text-xs font-medium transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Defaults</span>
            </button>
          </div>
        }
      />

      {/* Statutory Disclaimer */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-amber-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">PROTOTYPE RULE SIMULATION:</span> Configurable rules and thresholds are illustrative demo models. Real regulatory deployments must be formally mapped to the authoritative Approval Process Handbook (APH) with council committee sanction.
        </div>
      </div>

      {/* Dry Run Outcome Panel */}
      {dryRunResult && (
        <div className="gov-card p-5 rounded-xl border border-blue-500/30 space-y-3 bg-blue-950/20">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-blue-400 animate-pulse" />
              <h3 className="text-sm font-bold text-white">Dry-Run Simulation Impact Analysis</h3>
            </div>
            {!sessionApplied ? (
              <button
                onClick={handleApplyToSession}
                className="px-3 py-1 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-semibold shadow-sm transition-all"
              >
                Apply to Session State
              </button>
            ) : (
              <span className="text-xs text-emerald-400 font-semibold flex items-center gap-1">
                <CheckCircle2 className="w-3.5 h-3.5" />
                Applied to current session
              </span>
            )}
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-3 text-xs">
            <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Current Findings</span>
              <strong className="text-white text-base">{dryRunResult.currentFindingsCount}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Proposed Findings</span>
              <strong className="text-white text-base">{dryRunResult.proposedFindingsCount}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Removed Findings</span>
              <strong className="text-emerald-400 text-base">-{dryRunResult.removedFindings.length}</strong>
            </div>
            <div className="p-3 rounded-lg bg-slate-900 border border-white/5">
              <span className="text-slate-400 block text-[11px]">Affected Applications</span>
              <strong className="text-blue-400 text-base">{dryRunResult.affectedApplicationsCount}</strong>
            </div>
          </div>
        </div>
      )}

      {/* Rules List */}
      <div className="gov-card rounded-xl border border-white/10 overflow-hidden divide-y divide-white/5">
        {rules.map((rule) => (
          <div
            key={rule.id}
            className={`p-4 transition-colors ${
              rule.enabled ? 'hover:bg-slate-900/40' : 'opacity-60 bg-slate-950/40'
            }`}
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="font-mono text-xs font-bold text-blue-400">{rule.id}</span>
                  <span className="text-sm font-bold text-white">{rule.title}</span>
                  <SeverityBadge severity={rule.severity} />
                  <span className="text-[10px] px-2 py-0.5 rounded uppercase font-semibold bg-slate-800 text-slate-300">
                    {rule.category.replace(/_/g, ' ')}
                  </span>
                </div>
                <p className="text-xs text-slate-300">{rule.description}</p>
                <p className="text-[11px] text-slate-500 leading-snug">
                  Regulatory rationale: {rule.explanation}
                </p>
              </div>

              {/* Toggle switch */}
              <div className="flex items-center gap-3 shrink-0">
                <button
                  onClick={() => handleToggleRule(rule.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold border transition-all ${
                    rule.enabled
                      ? 'bg-blue-600/20 text-blue-300 border-blue-500/40 hover:bg-blue-600/30'
                      : 'bg-slate-900 text-slate-400 border-white/10 hover:text-white'
                  }`}
                >
                  {rule.enabled ? 'Active / Enabled' : 'Disabled'}
                </button>
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
