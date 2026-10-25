'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { StatusBadge, CategoryBadge, SeverityBadge } from '@/components/status-badge';
import { getApplicationById, getInstitutionById } from '@/lib/mock-data';
import { formatDate, formatDateTime } from '@/lib/format';
import {
  FileText,
  AlertTriangle,
  Building2,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  Clock,
} from 'lucide-react';

interface CaseWorkspacePageProps {
  params: Promise<{ id: string }>;
}

export default function CaseWorkspacePage({ params }: CaseWorkspacePageProps) {
  const resolvedParams = use(params);
  const applicationId = resolvedParams.id;
  const application = getApplicationById(applicationId);
  const institution = application ? getInstitutionById(application.institutionId) : undefined;

  const [activeTab, setActiveTab] = useState<'summary' | 'documents' | 'findings' | 'issuer' | 'infrastructure'>('summary');

  if (!application) {
    return (
      <AppShell>
        <div className="gov-card p-12 text-center rounded-xl border border-white/10 space-y-4 max-w-xl mx-auto my-12">
          <ShieldAlert className="w-12 h-12 text-amber-400 mx-auto" />
          <h2 className="text-lg font-bold text-white">Application Case Not Found</h2>
          <p className="text-xs text-slate-400">
            Case ID &apos;{applicationId}&apos; does not exist in the synthetic institutional database.
          </p>
          <Link
            href="/applications"
            className="inline-flex items-center gap-1.5 px-4 py-2 rounded-lg bg-blue-600 text-white text-xs font-semibold hover:bg-blue-500 transition-all"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            <span>Return to Application Queue</span>
          </Link>
        </div>
      </AppShell>
    );
  }

  const tabs = [
    { id: 'summary', label: 'Case Summary' },
    { id: 'documents', label: `Documents & OCR (${application.documents.length})` },
    { id: 'findings', label: `Advisory Findings (${application.findings.length})` },
    { id: 'issuer', label: `Issuer Checks (${application.verificationEvents.length})` },
    { id: 'infrastructure', label: `Infrastructure (${application.infrastructure.length})` },
  ];

  return (
    <AppShell>
      <PageHeader
        title={`${application.referenceNumber}`}
        description={`${application.institutionName} • ${application.region} Region • Submitted ${formatDate(application.submittedAt)}`}
        breadcrumbs={[
          { label: 'Applications', href: '/applications' },
          { label: application.referenceNumber },
        ]}
        badge={<CategoryBadge category={application.category} />}
        actions={
          <div className="flex items-center gap-2">
            <span className="px-3 py-1 rounded-lg text-xs font-bold bg-slate-900 border border-white/10 text-white">
              Priority: {application.priorityScore}/100
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-500/30">
              {application.status}
            </span>
          </div>
        }
      />

      {/* Case Workflow Stages Timeline */}
      <div className="gov-card p-4 rounded-xl border border-white/10 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-slate-200">Regulatory Triage Stages</span>
          <span>Decision-Support Flow</span>
        </div>
        <div className="grid grid-cols-2 md:grid-cols-6 gap-2 text-xs text-center font-medium">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1. Intake</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>2. OCR Extract</span>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Rule Check</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>4. Issuer Query</span>
          </div>
          <div className="p-2 rounded-lg bg-slate-900 border border-white/10 text-slate-400 flex items-center justify-center gap-1.5">
            <span>5. Compliance</span>
          </div>
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center justify-center gap-1.5">
            <span>6. Officer Triage</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as 'summary' | 'documents' | 'findings' | 'issuer' | 'infrastructure')}
            className={`px-3 py-1.5 rounded-lg text-xs font-semibold whitespace-nowrap transition-all ${
              activeTab === tab.id
                ? 'bg-blue-600/30 text-white border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* Tab Panels */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Left 2 Cols: Institutional Profile & Programmes */}
          <div className="lg:col-span-2 space-y-6">
            <div className="gov-card p-5 rounded-xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <Building2 className="w-4 h-4 text-blue-400" />
                <span>Institutional Profile & Registration</span>
              </h3>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 text-xs">
                <div>
                  <span className="text-slate-400 block">Institution Name:</span>
                  <strong className="text-white text-sm">{application.institutionName}</strong>
                </div>
                <div>
                  <span className="text-slate-400 block">AICTE Permanent ID:</span>
                  <span className="text-slate-200 font-mono">{application.institutionId}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Region & State:</span>
                  <span className="text-slate-200">{application.region} &bull; {institution?.state}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">TER Processing Fee:</span>
                  <span className="font-semibold text-emerald-400">{application.terPaymentStatus}</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Approved Intake:</span>
                  <span className="text-slate-200 font-mono">{application.previousApprovedIntake} Seats</span>
                </div>
                <div>
                  <span className="text-slate-400 block">Requested Intake:</span>
                  <span className="text-blue-400 font-mono font-bold">{application.requestedIntake} Seats</span>
                </div>
              </div>
            </div>

            {/* Programmes List */}
            <div className="gov-card p-5 rounded-xl border border-white/10 space-y-3">
              <h3 className="text-sm font-bold text-white">Submitted Programmes for Approval</h3>
              <div className="divide-y divide-white/5">
                {application.programmes.map((p, idx) => (
                  <div key={idx} className="py-2.5 flex items-center justify-between text-xs">
                    <div>
                      <p className="font-semibold text-white">{p.name}</p>
                      <p className="text-slate-400 text-[11px]">Level: {p.level} &bull; Accreditation: {p.accreditationStatus}</p>
                    </div>
                    <div className="text-right font-mono">
                      <span className="text-slate-400">{p.currentApprovedIntake}</span> &rarr;{' '}
                      <span className="font-bold text-blue-400">{p.requestedIntake} Seats</span>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Right Col: High Priority Findings Summary */}
          <div className="space-y-6">
            <div className="gov-card p-5 rounded-xl border border-white/10 space-y-4">
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <AlertTriangle className="w-4 h-4 text-rose-400" />
                <span>Advisory Finding Summary</span>
              </h3>
              {application.findings.length === 0 ? (
                <div className="p-4 rounded-lg bg-emerald-500/10 border border-emerald-500/20 text-emerald-300 text-xs">
                  Zero regulatory discrepancies flagged for this application submission.
                </div>
              ) : (
                <div className="space-y-3">
                  {application.findings.map((f) => (
                    <div
                      key={f.id}
                      className="p-3 rounded-lg bg-slate-900/80 border border-white/10 space-y-1.5 text-xs"
                    >
                      <div className="flex items-center justify-between">
                        <span className="font-semibold text-rose-300 truncate max-w-[200px]">
                          {f.title}
                        </span>
                        <SeverityBadge severity={f.severity} />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {f.reason}
                      </p>
                      <div className="pt-2 border-t border-white/5 text-[10.5px] text-slate-400 italic">
                        Would clear if: {f.wouldClearIf}
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'documents' && (
        <div className="space-y-4">
          <div className="gov-card p-5 rounded-xl border border-white/10">
            <h3 className="text-sm font-bold text-white mb-4">Submitted Documentary Evidences</h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {application.documents.map((doc) => (
                <div
                  key={doc.id}
                  className="p-4 rounded-xl bg-slate-900/60 border border-white/10 space-y-3 text-xs"
                >
                  <div className="flex items-start justify-between gap-2">
                    <div className="flex items-center gap-2">
                      <FileText className="w-4 h-4 text-blue-400 shrink-0" />
                      <div>
                        <span className="font-bold text-white block">{doc.name}</span>
                        <span className="text-[11px] text-slate-400 font-mono">{doc.fileName}</span>
                      </div>
                    </div>
                    <StatusBadge status={doc.verificationStatus} />
                  </div>

                  <div className="space-y-1 pt-2 border-t border-white/5 text-[11px]">
                    <p className="text-slate-400">Issuer: <strong className="text-slate-300">{doc.issuer}</strong></p>
                    <p className="text-slate-400">Expiry: <strong className="text-slate-300">{doc.expiryDate || 'Perpetual / Not applicable'}</strong></p>
                    <p className="text-slate-400">OCR Confidence: <strong className="text-emerald-400">{(doc.confidence * 100).toFixed(0)}%</strong></p>
                  </div>

                  {doc.anomalies.length > 0 && (
                    <div className="p-2 rounded bg-rose-950/40 border border-rose-500/20 text-rose-300 text-[11px]">
                      <strong>Advisory Anomaly Detected:</strong> {doc.anomalies[0].title}
                    </div>
                  )}
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'findings' && (
        <div className="space-y-4">
          <div className="gov-card p-5 rounded-xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white">Rule Validation Findings</h3>
            {application.findings.map((f) => (
              <div key={f.id} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-blue-400 font-bold">{f.ruleId}</span>
                    <span className="font-bold text-white text-sm">{f.title}</span>
                  </div>
                  <SeverityBadge severity={f.severity} />
                </div>
                <p className="text-slate-300">{f.reason}</p>
                <div className="p-2.5 rounded bg-slate-950/60 border border-white/5 grid grid-cols-2 gap-2 text-[11px]">
                  <div>Submitted: <span className="text-rose-400 font-mono">{f.submittedValue}</span></div>
                  <div>Record Norm: <span className="text-emerald-400 font-mono">{f.recordValue}</span></div>
                </div>
                <p className="text-slate-400 text-[11px]">Recommendation: {f.recommendation}</p>
              </div>
            ))}
          </div>
        </div>
      )}

      {activeTab === 'issuer' && (
        <div className="space-y-4">
          <div className="gov-card p-5 rounded-xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white">Simulated Issuer Verification Logs</h3>
            <div className="space-y-3">
              {application.verificationEvents.map((evt) => (
                <div key={evt.id} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white">{evt.source}</span>
                    <StatusBadge status={evt.status} />
                  </div>
                  <p className="text-slate-300">{evt.message}</p>
                  <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
                    <span>Reference: <span className="font-mono text-blue-400">{evt.referenceNumber}</span></span>
                    <span>Checked: {formatDateTime(evt.timestamp)}</span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {activeTab === 'infrastructure' && (
        <div className="space-y-4">
          <div className="gov-card p-5 rounded-xl border border-white/10 space-y-4">
            <h3 className="text-sm font-bold text-white">Advisory Infrastructure Checks</h3>
            {application.infrastructure.map((inf) => (
              <div key={inf.id} className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs">
                <div className="flex items-center justify-between">
                  <span className="font-bold text-white text-sm">{inf.title}</span>
                  <span className="px-2 py-0.5 rounded text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
                    {inf.advisoryOutcome}
                  </span>
                </div>
                <p className="text-slate-300">{inf.reason}</p>
                <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400 pt-1 border-t border-white/5">
                  <div>Location: {inf.location}</div>
                  <div>Measured: {inf.measuredValue}</div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </AppShell>
  );
}
