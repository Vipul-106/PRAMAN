'use client';

import React, { use, useState } from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { CategoryBadge, SeverityBadge } from '@/components/status-badge';
import { OCRDiffViewer } from '@/components/ocr-diff-viewer';
import { FindingCard } from '@/components/finding-card';
import { AnomalyViewer } from '@/components/anomaly-viewer';
import { IssuerVerificationPanel } from '@/components/issuer-verification-panel';
import { InfrastructureReview } from '@/components/infrastructure-review';
import { OfficerActionDialog } from '@/components/officer-action-dialog';
import { useSession } from '@/lib/session-context';
import { getInstitutionById } from '@/lib/mock-data';
import { formatDate, formatDateTime } from '@/lib/format';
import { ValidationFinding, OfficerActionType } from '@/lib/types';
import {
  AlertTriangle,
  Building2,
  CheckCircle2,
  ShieldAlert,
  ArrowLeft,
  Clock,
  Layers,
  History,
  ShieldCheck,
} from 'lucide-react';

import { Suspense } from 'react';

interface CaseWorkspacePageProps {
  params: Promise<{ id: string }>;
}

function CaseWorkspaceContent({ params }: CaseWorkspacePageProps) {
  const resolvedParams = use(params);
  const applicationId = resolvedParams.id;

  const { applications, currentRole, performOfficerAction } = useSession();
  const application = applications.find(
    (a) => a.id === applicationId || a.referenceNumber.toLowerCase() === applicationId.toLowerCase()
  );

  const institution = application ? getInstitutionById(application.institutionId) : undefined;

  const [activeTab, setActiveTab] = useState<
    'summary' | 'documents' | 'findings' | 'anomalies' | 'issuer' | 'infrastructure' | 'history'
  >('summary');

  // Selected document for OCR Diff view
  const [selectedDocId, setSelectedDocId] = useState<string | null>(null);

  // Officer Action Dialog State
  const [isActionDialogOpen, setIsActionDialogOpen] = useState(false);
  const [targetFinding, setTargetFinding] = useState<ValidationFinding | undefined>(undefined);

  if (!application) {
    return (
      <AppShell>
        <div className="glass-card p-12 text-center rounded-xl transition-all duration-200 space-y-4 max-w-xl mx-auto my-12">
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

  const activeDoc = application.documents.find((d) => d.id === selectedDocId) || application.documents[0];
  const hasAnomalies = application.documents.some((d) => d.anomalies.length > 0 || d.metadata?.hasEditTraces);

  const handleOpenActionDialog = (finding?: ValidationFinding) => {
    setTargetFinding(finding);
    setIsActionDialogOpen(true);
  };

  const handleConfirmOfficerAction = async (params: {
    actionType: OfficerActionType;
    reason?: string;
    note?: string;
  }) => {
    await performOfficerAction({
      applicationId: application.id,
      findingId: targetFinding?.id,
      actionType: params.actionType,
      reason: params.reason,
      note: params.note,
    });
  };

  const tabs = [
    { id: 'summary', label: 'Case Summary' },
    { id: 'documents', label: `Documents & OCR (${application.documents.length})` },
    { id: 'findings', label: `Advisory Findings (${application.findings.length})` },
    ...(hasAnomalies ? [{ id: 'anomalies', label: 'Anomaly Heatmap' }] : []),
    { id: 'issuer', label: `Issuer Checks (${application.verificationEvents.length})` },
    { id: 'infrastructure', label: `Infrastructure (${application.infrastructure.length})` },
    { id: 'history', label: `Officer Action History (${(application.actions || []).length})` },
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
              Triage Score: {application.priorityScore}/100
            </span>
            <span className="px-3 py-1 rounded-lg text-xs font-semibold bg-blue-950 text-blue-300 border border-blue-500/30">
              {application.status}
            </span>
            <button
              onClick={() => handleOpenActionDialog()}
              className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all"
            >
              <span>Record Case Action</span>
            </button>
          </div>
        }
      />

      {/* Case Workflow Stages Timeline */}
      <div className="glass-card p-4 rounded-xl transition-all duration-200 mb-6">
        <div className="flex items-center justify-between text-xs text-slate-400 mb-2">
          <span className="font-semibold text-slate-200">Regulatory Triage Stages</span>
          <span className="text-blue-400 font-mono text-[11px]">AICTE Automated Scrutiny Pipeline</span>
        </div>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 text-xs text-center font-medium">
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>1. Intake Validated</span>
          </div>
          <div className="p-2 rounded-lg bg-emerald-500/10 border border-emerald-500/30 text-emerald-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>2. OCR Extracted</span>
          </div>
          <div className="p-2 rounded-lg bg-blue-500/10 border border-blue-500/30 text-blue-400 flex items-center justify-center gap-1.5">
            <CheckCircle2 className="w-3.5 h-3.5" />
            <span>3. Rule Validated</span>
          </div>
          <div className="p-2 rounded-lg bg-amber-500/10 border border-amber-500/30 text-amber-400 flex items-center justify-center gap-1.5">
            <Clock className="w-3.5 h-3.5" />
            <span>4. Issuer Queried</span>
          </div>
          <div className="p-2 rounded-lg bg-indigo-500/10 border border-indigo-500/30 text-indigo-300 flex items-center justify-center gap-1.5">
            <Layers className="w-3.5 h-3.5" />
            <span>5. Infrastructure</span>
          </div>
          <div className="p-2 rounded-lg bg-purple-500/10 border border-purple-500/30 text-purple-300 flex items-center justify-center gap-1.5">
            <ShieldCheck className="w-3.5 h-3.5" />
            <span>6. Officer Triage</span>
          </div>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 mb-6 overflow-x-auto">
        {tabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id as typeof activeTab)}
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

      {/* 1. Summary */}
      {activeTab === 'summary' && (
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
          {/* Institutional Profile */}
          <div className="lg:col-span-2 space-y-6">
            <div className="glass-card p-5 rounded-xl transition-all duration-200 space-y-4">
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

            {/* Submitted Programmes */}
            <div className="glass-card p-5 rounded-xl transition-all duration-200 space-y-3">
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

          {/* Right Column: High-Priority Findings & Action Box */}
          <div className="space-y-6">
            <div className="glass-card p-5 rounded-xl transition-all duration-200 space-y-4">
              <div className="flex items-center justify-between">
                <h3 className="text-sm font-bold text-white flex items-center gap-2">
                  <AlertTriangle className="w-4 h-4 text-rose-400" />
                  <span>Advisory Finding Summary</span>
                </h3>
                <span className="text-xs text-rose-400 font-bold">{application.findings.length} Flags</span>
              </div>

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
                        <span className="font-semibold text-rose-300 truncate max-w-[180px]">
                          {f.title}
                        </span>
                        <SeverityBadge severity={f.severity} />
                      </div>
                      <p className="text-[11px] text-slate-400 leading-snug">
                        {f.reason}
                      </p>
                      <div className="pt-2 border-t border-white/5 flex items-center justify-between">
                        <span className="text-[10px] text-slate-500 font-mono capitalize">
                          Status: {f.status}
                        </span>
                        <button
                          onClick={() => handleOpenActionDialog(f)}
                          className="text-[10.5px] text-blue-400 hover:text-blue-300 font-semibold"
                        >
                          Take Action &rarr;
                        </button>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>

            {/* Quick Officer Triage Box */}
            <div className="glass-card p-5 rounded-xl transition-all duration-200 border border-blue-500/30 bg-blue-950/20 space-y-3 text-xs">
              <span className="text-xs font-bold text-white block">Officer Decision Guardrail</span>
              <p className="text-slate-300 leading-relaxed text-[11.5px]">
                Preliminary scrutiny requires logging acknowledgement, clarification request, dismissal with reason,
                or escalation. Final approval decisions are reserved for statutory council orders.
              </p>
              <button
                onClick={() => handleOpenActionDialog()}
                className="w-full py-2 rounded-lg bg-blue-600 hover:bg-blue-500 text-white font-semibold transition-all text-center block"
              >
                Open Officer Action Form
              </button>
            </div>
          </div>
        </div>
      )}

      {/* 2. Documents & OCR Split-Pane Diff Viewer */}
      {activeTab === 'documents' && activeDoc && (
        <div className="space-y-4">
          {/* Document Picker Tabs if multiple documents */}
          {application.documents.length > 1 && (
            <div className="flex items-center gap-2 overflow-x-auto pb-2">
              <span className="text-xs text-slate-400 font-semibold shrink-0">Select Document:</span>
              {application.documents.map((doc) => (
                <button
                  key={doc.id}
                  onClick={() => setSelectedDocId(doc.id)}
                  className={`px-3 py-1.5 rounded-lg text-xs font-semibold transition-all whitespace-nowrap ${
                    activeDoc.id === doc.id
                      ? 'bg-blue-600 text-white shadow'
                      : 'bg-slate-900 text-slate-400 hover:text-white border border-white/10'
                  }`}
                >
                  {doc.name}
                </button>
              ))}
            </div>
          )}

          {/* OCR / Institutional Record Split Pane */}
          <OCRDiffViewer document={activeDoc} institution={institution} />
        </div>
      )}

      {/* 3. Findings Tab */}
      {activeTab === 'findings' && (
        <div className="space-y-4">
          <div className="glass-card p-4 rounded-xl transition-all duration-200 flex items-center justify-between">
            <div>
              <h3 className="text-sm font-bold text-white">Rule Validation Discrepancies</h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Explainable findings linked to documentary evidence and institutional records.
              </p>
            </div>
            <span className="text-xs text-rose-400 font-bold px-2.5 py-1 rounded bg-rose-500/10 border border-rose-500/30">
              {application.findings.length} Active Discrepancies
            </span>
          </div>

          <div className="space-y-3">
            {application.findings.map((f) => {
              const doc = application.documents.find((d) => d.id === f.evidence.documentId);
              return (
                <FindingCard
                  key={f.id}
                  finding={f}
                  document={doc}
                  onOpenActionDialog={handleOpenActionDialog}
                />
              );
            })}
          </div>
        </div>
      )}

      {/* 4. Anomaly Heatmap Tab */}
      {activeTab === 'anomalies' && (
        <div className="space-y-4">
          <AnomalyViewer document={activeDoc} institutionName={application.institutionName} />
        </div>
      )}

      {/* 5. Issuer Checks Tab */}
      {activeTab === 'issuer' && (
        <div className="space-y-4">
          <IssuerVerificationPanel events={application.verificationEvents} />
        </div>
      )}

      {/* 6. Infrastructure Tab */}
      {activeTab === 'infrastructure' && (
        <div className="space-y-4">
          <InfrastructureReview checks={application.infrastructure} />
        </div>
      )}

      {/* 7. Officer Action History Tab */}
      {activeTab === 'history' && (
        <div className="glass-card p-5 rounded-xl transition-all duration-200 space-y-4">
          <div className="flex items-center justify-between pb-3 border-b border-white/10">
            <div>
              <h3 className="text-sm font-bold text-white flex items-center gap-2">
                <History className="w-4 h-4 text-blue-400" />
                <span>Audited Officer Decision Records</span>
              </h3>
              <p className="text-xs text-slate-400 mt-0.5">
                Every action taken on this case is cryptographically recorded into the verifiable audit ledger.
              </p>
            </div>
            <button
              onClick={() => handleOpenActionDialog()}
              className="px-3 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold"
            >
              Record New Action
            </button>
          </div>

          {(application.actions || []).length === 0 ? (
            <div className="p-8 text-center text-slate-400 space-y-2">
              <Clock className="w-8 h-8 text-slate-500 mx-auto" />
              <p className="text-xs font-medium">No officer actions recorded yet for this submission.</p>
              <p className="text-[11px] text-slate-500">
                Click &apos;Record New Action&apos; to acknowledge, dismiss, request clarification, or escalate.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {application.actions.map((act) => (
                <div
                  key={act.id}
                  className="p-4 rounded-xl bg-slate-900 border border-white/10 space-y-2 text-xs"
                >
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <span className="font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                        {act.id}
                      </span>
                      <span className="font-bold text-white capitalize">
                        {act.actionType}
                      </span>
                      <span className="text-[10.5px] px-2 py-0.5 rounded bg-slate-800 text-slate-300">
                        {act.officerRole} &bull; {act.officerName}
                      </span>
                    </div>
                    <span className="font-mono text-[11px] text-slate-400">
                      {formatDateTime(act.timestamp)}
                    </span>
                  </div>

                  {act.reason && (
                    <p className="text-slate-300 bg-slate-950 p-2.5 rounded border border-white/5">
                      <strong>Rationale / Message:</strong> {act.reason}
                    </p>
                  )}

                  {act.note && (
                    <p className="text-slate-400 italic text-[11px]">
                      Internal Note: {act.note}
                    </p>
                  )}
                </div>
              ))}
            </div>
          )}
        </div>
      )}

      {/* Officer Action Modal Dialog */}
      <OfficerActionDialog
        isOpen={isActionDialogOpen}
        onClose={() => setIsActionDialogOpen(false)}
        applicationId={application.id}
        findingId={targetFinding?.id}
        findingTitle={targetFinding?.title}
        currentRole={currentRole}
        onConfirmAction={handleConfirmOfficerAction}
      />
    </AppShell>
  );
}

export default function CaseWorkspacePage({ params }: CaseWorkspacePageProps) {
  return (
    <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading case workspace...</div>}>
      <CaseWorkspaceContent params={params} />
    </Suspense>
  );
}
