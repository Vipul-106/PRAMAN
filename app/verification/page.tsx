'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { StatusBadge } from '@/components/status-badge';
import { mockDatabase } from '@/lib/mock-data';
import { VerificationStatus, IssuerVerificationEvent } from '@/lib/types';
import { queryIssuerService, routeToManualConfirmation } from '@/lib/verification-engine';
import { formatDateTime } from '@/lib/format';
import {
  Building2,
  RefreshCw,
  ShieldAlert,
  Search,
  Filter,
  CheckCircle2,
  Info,
} from 'lucide-react';

export default function VerificationPage() {
  // Aggregate all verification events across seeded applications
  const initialEvents: IssuerVerificationEvent[] = mockDatabase.applications.flatMap(
    (app) => app.verificationEvents
  );

  const [events, setEvents] = useState<IssuerVerificationEvent[]>(initialEvents);
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [retryingId, setRetryingId] = useState<string | null>(null);

  const filteredEvents = events.filter((e) => {
    if (selectedStatus !== 'ALL' && e.status !== selectedStatus) return false;
    return true;
  });

  const handleRetry = (event: IssuerVerificationEvent) => {
    setRetryingId(event.id);
    setTimeout(() => {
      const result = queryIssuerService({
        documentId: event.documentId,
        documentName: event.documentName,
        issuerName: event.source,
        referenceNumber: event.referenceNumber,
        currentStatus: event.status,
        retryCount: event.retryCount,
      });

      setEvents((prev) =>
        prev.map((e) =>
          e.id === event.id
            ? {
                ...e,
                status: result.status,
                timestamp: result.timestamp,
                message: result.message,
                retryCount: result.retryCount,
                canRetry: result.canRetry,
              }
            : e
        )
      );
      setRetryingId(null);
    }, 600);
  };

  const handleManualRoute = (event: IssuerVerificationEvent) => {
    const updated = routeToManualConfirmation(
      event,
      'Officer routed to manual scrutiny due to catalog timeout.'
    );
    setEvents((prev) => prev.map((e) => (e.id === event.id ? updated : e)));
  };

  return (
    <AppShell>
      <PageHeader
        title="Issuer Verification Hub"
        description="Automated cross-registry verification against simulated state authorities (Fire Services, Revenue Bhoomi, PWD, NBA, and Universities)."
        breadcrumbs={[{ label: 'Issuer Verification' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            6 Status States Active
          </span>
        }
      />

      {/* Verification Notice Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">SIMULATED ISSUER ADAPTERS:</span>{' '}
          All external authority responses are deterministic fixtures simulated locally. No real external government endpoints or issuing authorities are contacted.
        </div>
      </div>

      {/* Filter Bar */}
      <div className="gov-card p-4 rounded-xl border border-white/10 flex items-center justify-between gap-4">
        <div className="flex items-center gap-2 text-xs text-slate-400">
          <Filter className="w-4 h-4" />
          <span>Filter by Status:</span>
          <select
            value={selectedStatus}
            onChange={(e) => setSelectedStatus(e.target.value)}
            className="bg-slate-900 border border-white/10 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All 6 Statuses</option>
            <option value="verified">Verified</option>
            <option value="mismatch_detected">Mismatch Detected</option>
            <option value="expired">Expired</option>
            <option value="verification_pending">Verification Pending</option>
            <option value="source_unavailable">Source Unavailable</option>
            <option value="manual_review_required">Manual Review Required</option>
          </select>
        </div>

        <span className="text-xs text-slate-400">
          Showing <strong>{filteredEvents.length}</strong> verification records
        </span>
      </div>

      {/* Events List */}
      <div className="gov-card rounded-xl border border-white/10 overflow-hidden divide-y divide-white/5">
        {filteredEvents.map((evt) => (
          <div key={evt.id} className="p-4 hover:bg-slate-900/40 transition-colors">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
              <div className="space-y-1">
                <div className="flex items-center gap-2">
                  <span className="text-sm font-bold text-white">{evt.source}</span>
                  <StatusBadge status={evt.status} />
                </div>
                <p className="text-xs text-slate-300">{evt.message}</p>
                <div className="flex items-center gap-3 text-[11px] text-slate-400 pt-1">
                  <span>Document: <strong className="text-slate-300">{evt.documentName}</strong></span>
                  <span>Reference: <span className="font-mono text-blue-400">{evt.referenceNumber}</span></span>
                  <span>Checked: {formatDateTime(evt.timestamp)}</span>
                  {evt.retryCount > 0 && (
                    <span className="text-amber-400">Retries: {evt.retryCount}</span>
                  )}
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex items-center gap-2 shrink-0">
                {evt.canRetry && (
                  <button
                    onClick={() => handleRetry(evt)}
                    disabled={retryingId === evt.id}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 border border-blue-500/30 text-xs font-semibold transition-all disabled:opacity-50"
                  >
                    <RefreshCw className={`w-3.5 h-3.5 ${retryingId === evt.id ? 'animate-spin' : ''}`} />
                    <span>{retryingId === evt.id ? 'Retrying...' : 'Retry Source'}</span>
                  </button>
                )}

                {evt.status !== 'verified' && evt.status !== 'manual_review_required' && (
                  <button
                    onClick={() => handleManualRoute(evt)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-indigo-600/20 hover:bg-indigo-600/40 text-indigo-300 border border-indigo-500/30 text-xs font-semibold transition-all"
                  >
                    <ShieldAlert className="w-3.5 h-3.5" />
                    <span>Route to Manual</span>
                  </button>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
