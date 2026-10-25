'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { MetricCard } from '@/components/metric-card';
import { AlertsStrip } from '@/components/alerts-strip';
import { PriorityQueue } from '@/components/priority-queue';
import { StatusBadge } from '@/components/status-badge';
import {
  getCommandCenterMetrics,
  getSystemAlerts,
} from '@/lib/mock-data';
import { formatDateTime, truncateHash } from '@/lib/format';
import {
  Inbox,
  AlertTriangle,
  Clock,
  ShieldAlert,
  Building,
  Activity,
  History,
  FileCheck2,
  CheckCircle2,
  ArrowRight,
  ShieldCheck,
} from 'lucide-react';
import { VerificationStatus } from '@/lib/types';
import { useSession } from '@/lib/session-context';
import AIOrbFace from '@/components/ui/ai-orb-face';

export default function OverviewPage() {
  const { applications, auditEvents } = useSession();
  const metrics = getCommandCenterMetrics();
  const alerts = getSystemAlerts();
  const recentAuditEvents = auditEvents.slice(-5).reverse();

  const statusList: { key: VerificationStatus; label: string; count: number }[] = [
    { key: 'verified', label: 'Verified', count: metrics.statusDistribution.verified },
    { key: 'mismatch_detected', label: 'Mismatch Detected', count: metrics.statusDistribution.mismatch_detected },
    { key: 'expired', label: 'Expired Clearances', count: metrics.statusDistribution.expired },
    { key: 'verification_pending', label: 'Pending Response', count: metrics.statusDistribution.verification_pending },
    { key: 'source_unavailable', label: 'Source Timeout', count: metrics.statusDistribution.source_unavailable },
    { key: 'manual_review_required', label: 'Manual Scrutiny', count: metrics.statusDistribution.manual_review_required },
  ];

  const totalDocuments = Object.values(metrics.statusDistribution).reduce((a, b) => a + b, 0);

  return (
    <AppShell>
      <PageHeader
        title="Regulatory Command Center"
        description="Unified AICTE decision-support cockpit for automated intake verification, cross-registry validation, and tamper anomaly triage."
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <AIOrbFace size={36} state="idle" colors={{ body: '#22d3ee', bodyEdge: '#cffafe', feature: '#083344' }} className="shrink-0" />
            <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse" />
            Decision Engine Active
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <Link
              href="/intake"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-[#e1b382] text-[#12343b] hover:bg-[#c89666] text-xs font-semibold shadow-lg shadow-black/20 transition-colors"
            >
              <FileCheck2 className="w-3.5 h-3.5" />
              <span>Smart Intake</span>
            </Link>
            <Link
              href="/benchmarks"
              className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-lg bg-slate-900/80 hover:bg-slate-800 text-slate-200 text-xs font-semibold border border-slate-700/80 transition-colors"
            >
              <Activity className="w-3.5 h-3.5" />
              <span>Benchmarks</span>
            </Link>
          </div>
        }
      />

      {/* Top Level Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-4">
        <MetricCard
          title="Applications in Queue"
          value={metrics.inQueue}
          subtitle="All active submissions"
          icon={Inbox}
          variant="default"
        />
        <MetricCard
          title="Action Required"
          value={metrics.actionRequired}
          subtitle="High priority triage cases"
          icon={AlertTriangle}
          variant="danger"
        />
        <MetricCard
          title="Pending Issuer Checks"
          value={metrics.pendingIssuerChecks}
          subtitle="Catalog queries queued"
          icon={Clock}
          variant="warning"
        />
        <MetricCard
          title="Potential Anomalies"
          value={metrics.potentialAnomalies}
          subtitle="Advisory flags for review"
          icon={ShieldAlert}
          variant="danger"
        />
        <MetricCard
          title="Inspection Recommended"
          value={metrics.inspectionRecommended}
          subtitle="Physical site screening"
          icon={Building}
          variant="info"
        />
      </div>

      {/* Critical Operational Alerts Strip */}
      <AlertsStrip alerts={alerts} />

      {/* Main Grid: Priority Queue + Verification Distribution & Audit */}
      <div className="grid grid-cols-1 xl:grid-cols-3 gap-6">
        {/* Left 2 Cols: Priority Queue */}
        <div className="xl:col-span-2 space-y-6">
          <PriorityQueue applications={applications} />

          {/* Quick Workflow Action Banners */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
            <Link
              href="/intake"
              className="glass-card p-4 rounded-xl transition-all duration-200 border-l-2 border-l-blue-500/60 hover:border-l-blue-400 group block"
            >
              <div className="flex items-center justify-between mb-2">
                <FileCheck2 className="w-5 h-5 text-blue-400 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-blue-400 transition-colors" />
              </div>
              <h4 className="text-xs font-bold text-white">Smart Document Intake</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                OCR field extraction, bounding boxes, and before/after rectification diffs.
              </p>
            </Link>

            <Link
              href="/verification"
              className="glass-card p-4 rounded-xl transition-all duration-200 border-l-2 border-l-emerald-500/60 hover:border-l-emerald-400 group block"
            >
              <div className="flex items-center justify-between mb-2">
                <CheckCircle2 className="w-5 h-5 text-indigo-400 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-indigo-400 transition-colors" />
              </div>
              <h4 className="text-xs font-bold text-white">Issuer Verification Hub</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Simulated state portals with outage retry recovery and manual routing.
              </p>
            </Link>

            <Link
              href="/rules"
              className="glass-card p-4 rounded-xl transition-all duration-200 border-l-2 border-l-amber-500/60 hover:border-l-amber-400 group block"
            >
              <div className="flex items-center justify-between mb-2">
                <ShieldCheck className="w-5 h-5 text-amber-400 group-hover:scale-110 transition-transform" />
                <ArrowRight className="w-4 h-4 text-slate-400 group-hover:text-amber-400 transition-colors" />
              </div>
              <h4 className="text-xs font-bold text-white">Rule Editor & Dry Run</h4>
              <p className="text-[11px] text-slate-400 mt-1">
                Simulate regulatory parameter changes before applying to session.
              </p>
            </Link>
          </div>
        </div>

        {/* Right Col: Verification Status Breakdown & Recent Audit Feed */}
        <div className="space-y-6">
          {/* Verification Status Distribution */}
          <div className="glass-card p-5 rounded-xl transition-all duration-200 space-y-4">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div>
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Verification Status Distribution
                </h3>
                <p className="text-[11px] text-slate-400">
                  Total documents in scope: {totalDocuments}
                </p>
              </div>
              <Link href="/verification" className="text-xs text-blue-400 hover:underline">
                View all &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {statusList.map((item) => {
                const pct = totalDocuments > 0 ? (item.count / totalDocuments) * 100 : 0;
                return (
                  <div key={item.key} className="space-y-1">
                    <div className="flex items-center justify-between text-xs">
                      <div className="flex items-center gap-1.5">
                        <StatusBadge status={item.key} showIcon={false} />
                      </div>
                      <span className="font-mono font-semibold text-slate-300">
                        {item.count}{' '}
                        <span className="text-[11px] text-slate-400">({pct.toFixed(0)}%)</span>
                      </span>
                    </div>
                    {/* Visual Progress Bar */}
                    <div className="h-1.5 w-full bg-slate-800 rounded-full overflow-hidden">
                      <div
                        className={`h-full rounded-full transition-all duration-500 ${
                          item.key === 'verified'
                            ? 'bg-emerald-400'
                            : item.key === 'mismatch_detected' || item.key === 'expired'
                            ? 'bg-rose-500'
                            : item.key === 'verification_pending' || item.key === 'source_unavailable'
                            ? 'bg-amber-400'
                            : 'bg-indigo-400'
                        }`}
                        style={{ width: `${pct}%` }}
                      />
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Recent Cryptographic Audit Activity */}
          <div className="glass-card p-5 rounded-xl transition-all duration-200 space-y-3">
            <div className="flex items-center justify-between pb-3 border-b border-slate-800/80">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <h3 className="text-xs font-bold uppercase tracking-wider text-slate-300">
                  Recent Audit Trail
                </h3>
              </div>
              <Link href="/audit" className="text-xs text-blue-400 hover:underline">
                Inspect chain &rarr;
              </Link>
            </div>

            <div className="space-y-3">
              {recentAuditEvents.map((evt) => (
                <div
                  key={evt.id}
                  className="p-2.5 rounded-lg bg-slate-950/50 border border-slate-800/70 border-l-2 border-l-blue-500/40 space-y-1.5 text-xs hover:border-slate-700/80 transition-colors"
                >
                  <div className="flex items-center justify-between">
                    <span className="font-semibold text-white">
                      {evt.action.replace(/_/g, ' ')}
                    </span>
                    <span className="text-[10px] text-slate-400 font-mono">
                      {formatDateTime(evt.timestamp)}
                    </span>
                  </div>
                  <p className="text-[11px] text-slate-300 line-clamp-2">
                    {evt.details}
                  </p>
                  <div className="flex items-center justify-between pt-1 text-[10px] text-slate-400 border-t border-white/5">
                    <span>Actor: {evt.actorName} ({evt.actorRole})</span>
                    <span className="font-mono text-blue-400">
                      Hash: {truncateHash(evt.eventHash, 10)}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
