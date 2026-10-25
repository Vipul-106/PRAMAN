'use client';

import React, { useState } from 'react';
import { IssuerVerificationEvent } from '@/lib/types';
import { StatusBadge } from './status-badge';
import { formatDateTime } from '@/lib/format';
import { useSession } from '@/lib/session-context';
import {
  Building2,
  RefreshCw,
  Search,
  Filter,
  Info,
  Send,
} from 'lucide-react';

interface IssuerVerificationPanelProps {
  events: IssuerVerificationEvent[];
}

export function IssuerVerificationPanel({ events }: IssuerVerificationPanelProps) {
  const { retryIssuerVerification, routeIssuerToManual } = useSession();
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [search, setSearch] = useState('');
  const [retryingId, setRetryingId] = useState<string | null>(null);
  const [routingId, setRoutingId] = useState<string | null>(null);
  const [manualNote, setManualNote] = useState('');

  const filteredEvents = events.filter((e) => {
    if (selectedStatus !== 'ALL' && e.status !== selectedStatus) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchSource = e.source.toLowerCase().includes(q);
      const matchDoc = e.documentName.toLowerCase().includes(q);
      const matchRef = e.referenceNumber.toLowerCase().includes(q);
      if (!matchSource && !matchDoc && !matchRef) return false;
    }
    return true;
  });

  const handleRetry = async (event: IssuerVerificationEvent) => {
    setRetryingId(event.id);
    setTimeout(async () => {
      await retryIssuerVerification(event);
      setRetryingId(null);
    }, 600);
  };

  const handleConfirmManualRoute = async (event: IssuerVerificationEvent) => {
    await routeIssuerToManual(event, manualNote || 'Officer routed to manual scrutiny');
    setRoutingId(null);
    setManualNote('');
  };

  return (
    <div className="space-y-6">
      {/* Notice Banner */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-blue-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">SIMULATED ISSUER ADAPTERS:</span> All external authority
          responses are deterministic fixtures simulated locally. No real external government endpoints or
          issuing authorities are contacted. All 6 verification states are actively simulated.
        </div>
      </div>

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search authority, document, reference..."
            className="glass-input w-full rounded-lg px-3 py-2 text-sm pl-9 pr-3"
          />
        </div>

        <div className="flex flex-wrap items-center gap-2.5">
          <div className="flex items-center gap-1.5 text-xs text-slate-400">
            <Filter className="w-3.5 h-3.5" />
            <span>Status:</span>
            <select
              value={selectedStatus}
              onChange={(e) => setSelectedStatus(e.target.value)}
              className="glass-input rounded-lg px-3 py-2 text-sm"
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

          <span className="text-xs text-slate-500">
            Showing <strong>{filteredEvents.length}</strong> records
          </span>
        </div>
      </div>

      {/* Verification Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredEvents.map((evt) => {
          const isPending = evt.status === 'verification_pending';
          const isUnavailable = evt.status === 'source_unavailable';
          const isMismatch = evt.status === 'mismatch_detected';
          const isRoutingThis = routingId === evt.id;

          return (
            <div
              key={evt.id}
              className="glass-card p-5 rounded-xl transition-all duration-200 space-y-3.5"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-1.5">
                    <Building2 className="w-4 h-4 text-blue-400 shrink-0" />
                    <span className="font-bold text-white text-sm">{evt.source}</span>
                  </div>
                  <span className="text-xs text-slate-400 block">{evt.documentName}</span>
                </div>
                <StatusBadge status={evt.status} />
              </div>

              {/* Message Details */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/5">
                {evt.message}
              </p>

              {/* Technical Attributes */}
              <div className="grid grid-cols-2 gap-2 text-[11px] text-slate-400">
                <div>
                  <span>Registry Ref: </span>
                  <span className="font-mono text-blue-400 font-semibold">{evt.referenceNumber}</span>
                </div>
                <div>
                  <span>Retry Count: </span>
                  <span className="font-mono text-slate-200">{evt.retryCount} attempts</span>
                </div>
                <div className="col-span-2">
                  <span>Checked: </span>
                  <span className="text-slate-300">{formatDateTime(evt.timestamp)}</span>
                </div>
              </div>

              {/* Routing Modal Inline or Actions */}
              {isRoutingThis ? (
                <div className="p-3 rounded-lg bg-slate-950 border border-amber-500/30 space-y-2 text-xs">
                  <span className="font-bold text-amber-300 block">
                    Route to Manual Scrutiny
                  </span>
                  <input
                    type="text"
                    value={manualNote}
                    onChange={(e) => setManualNote(e.target.value)}
                    placeholder="Enter scrutiny directive (e.g. Request physical attested copy)..."
                    className="glass-input w-full rounded-lg px-3 py-2 text-sm"
                  />
                  <div className="flex items-center justify-end gap-2 pt-1">
                    <button
                      onClick={() => setRoutingId(null)}
                      className="px-2.5 py-1 rounded bg-slate-800 text-slate-300 text-[11px]"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => handleConfirmManualRoute(evt)}
                      className="px-2.5 py-1 rounded bg-amber-600 hover:bg-amber-500 text-white font-semibold text-[11px]"
                    >
                      Confirm Route
                    </button>
                  </div>
                </div>
              ) : (
                <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                  <span className="text-[11px] text-slate-500">
                    {evt.status === 'verified' ? 'Statutory clearance confirmed' : 'Scrutiny attention needed'}
                  </span>

                  <div className="flex items-center gap-2">
                    {/* Retry button for unavailable or pending */}
                    {(isUnavailable || isPending) && (
                      <button
                        onClick={() => handleRetry(evt)}
                        disabled={retryingId === evt.id}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all disabled:opacity-50"
                      >
                        <RefreshCw className={`w-3 h-3 ${retryingId === evt.id ? 'animate-spin' : ''}`} />
                        <span>Retry Query</span>
                      </button>
                    )}

                    {/* Manual route button for mismatch, unavailable, or pending */}
                    {(isMismatch || isUnavailable || isPending) && evt.status !== 'manual_review_required' && (
                      <button
                        onClick={() => setRoutingId(evt.id)}
                        className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-amber-500/10 hover:bg-amber-500/20 text-amber-300 border border-amber-500/30 text-xs font-medium transition-all"
                      >
                        <Send className="w-3 h-3" />
                        <span>Route to Manual</span>
                      </button>
                    )}
                  </div>
                </div>
              )}
            </div>
          );
        })}
      </div>
    </div>
  );
}
