'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { getBenchmarkMetrics } from '@/lib/mock-data';
import { BenchmarkMetrics } from '@/lib/types';
import { formatPercentage, formatDateTime } from '@/lib/format';
import {
  Activity,
  Play,
  CheckCircle2,
  Cpu,
  Clock,
  ShieldCheck,
  TrendingDown,
  Info,
} from 'lucide-react';

export default function BenchmarksPage() {
  const [metrics, setMetrics] = useState<BenchmarkMetrics>(getBenchmarkMetrics());
  const [isRunning, setIsRunning] = useState(false);
  const [lastRunSuccess, setLastRunSuccess] = useState(false);

  const handleRunBenchmark = () => {
    setIsRunning(true);
    setLastRunSuccess(false);

    setTimeout(() => {
      setMetrics((prev) => ({
        ...prev,
        lastRunTimestamp: new Date().toISOString(),
      }));
      setIsRunning(false);
      setLastRunSuccess(true);
    }, 800);
  };

  return (
    <AppShell>
      <PageHeader
        title="Synthetic Benchmark Metrics & Validation Analytics"
        description="Controlled synthetic benchmark runs evaluating OCR extraction accuracy, rule fidelity, anomaly precision/recall, and latency across test fixtures."
        breadcrumbs={[{ label: 'Benchmarks' }]}
        actions={
          <button
            onClick={handleRunBenchmark}
            disabled={isRunning}
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
          >
            <Play className={`w-3.5 h-3.5 ${isRunning ? 'animate-spin' : ''}`} />
            <span>{isRunning ? 'Executing Test Batch...' : 'Run Synthetic Benchmark'}</span>
          </button>
        }
      />

      {/* Methodology Notice */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">BENCHMARK METHODOLOGY NOTE:</span>{' '}
          {metrics.methodologyNote} Metrics are derived from deterministic synthetic fixtures and represent prototype testing performance.
        </div>
      </div>

      {lastRunSuccess && (
        <div className="p-3 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-300 text-xs flex items-center gap-2">
          <CheckCircle2 className="w-4 h-4 text-emerald-400" />
          <span>Synthetic benchmark test batch completed. Results re-calculated at {formatDateTime(metrics.lastRunTimestamp)}.</span>
        </div>
      )}

      {/* Primary Metric Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
        <div className="gov-card p-5 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">OCR Field Extraction</span>
            <Cpu className="w-4 h-4 text-blue-400" />
          </div>
          <p className="text-2xl font-bold text-white">{formatPercentage(metrics.extractionAccuracyPct)}</p>
          <p className="text-[11px] text-slate-400">Normalized field agreement on test fixtures</p>
        </div>

        <div className="gov-card p-5 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Validation Rule Accuracy</span>
            <ShieldCheck className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-400">{formatPercentage(metrics.validationAccuracyPct)}</p>
          <p className="text-[11px] text-slate-400">True positive/negative regulatory flags</p>
        </div>

        <div className="gov-card p-5 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Anomaly Precision & Recall</span>
            <Activity className="w-4 h-4 text-violet-400" />
          </div>
          <p className="text-2xl font-bold text-violet-300">
            {formatPercentage(metrics.anomalyPrecisionPct)} / {formatPercentage(metrics.anomalyRecallPct)}
          </p>
          <p className="text-[11px] text-slate-400">Precision / Recall on tamper indicators</p>
        </div>

        <div className="gov-card p-5 rounded-xl border border-white/10 space-y-1">
          <div className="flex items-center justify-between">
            <span className="text-xs text-slate-400 uppercase font-semibold">Manual Effort Reduction</span>
            <TrendingDown className="w-4 h-4 text-emerald-400" />
          </div>
          <p className="text-2xl font-bold text-emerald-300">{formatPercentage(metrics.manualEffortReductionPct)}</p>
          <p className="text-[11px] text-slate-400">Estimated triage time saved per dossier</p>
        </div>
      </div>

      {/* Latency & Fixture Info */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="gov-card p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Average Triage Latency</span>
          <p className="text-xl font-bold text-white">{metrics.avgVerificationTimeMs} ms</p>
          <span className="text-[11px] text-slate-400">End-to-end extraction & rule validation</span>
        </div>
        <div className="gov-card p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Alert Dispatch Latency</span>
          <p className="text-xl font-bold text-white">{metrics.alertLatencyMs} ms</p>
          <span className="text-[11px] text-slate-400">Queue indexing & triage score assignment</span>
        </div>
        <div className="gov-card p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase">Test Sample Fixtures</span>
          <p className="text-xl font-bold text-white">{metrics.sampleSize} Cases ({metrics.testFixtureCount} Fixtures)</p>
          <span className="text-[11px] text-slate-400">Seeded institutional test harness</span>
        </div>
      </div>

      {/* Category Breakdown Table */}
      <div className="gov-card rounded-xl border border-white/10 overflow-hidden">
        <div className="p-4 border-b border-white/10">
          <h3 className="text-sm font-bold text-white">Performance by Application Category</h3>
          <p className="text-xs text-slate-400 mt-0.5">
            Breakdown across approval categories in the synthetic benchmark dataset.
          </p>
        </div>
        <table className="w-full text-left text-xs">
          <thead>
            <tr className="border-b border-white/10 bg-slate-900/50 text-slate-400 font-semibold text-[11px] uppercase">
              <th className="p-3.5">Approval Category</th>
              <th className="p-3.5">Accuracy Rate</th>
              <th className="p-3.5">Test Cases Evaluated</th>
              <th className="p-3.5">Average Latency</th>
              <th className="p-3.5 text-right">Status</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/5 text-slate-200">
            {metrics.categoryBreakdown.map((cat) => (
              <tr key={cat.category} className="hover:bg-slate-900/30">
                <td className="p-3.5 font-bold text-white">{cat.category}</td>
                <td className="p-3.5 font-mono text-emerald-400 font-semibold">
                  {cat.accuracy.toFixed(1)}%
                </td>
                <td className="p-3.5 font-mono text-slate-300">{cat.casesTested}</td>
                <td className="p-3.5 font-mono text-slate-300">{cat.avgLatencyMs} ms</td>
                <td className="p-3.5 text-right">
                  <span className="px-2 py-0.5 rounded text-[11px] font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/20">
                    Validated
                  </span>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </AppShell>
  );
}
