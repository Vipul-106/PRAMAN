'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { getAuditEvents } from '@/lib/mock-data';
import { AuditEvent } from '@/lib/types';
import { verifyAuditChain, ChainVerificationResult } from '@/lib/audit';
import { formatDateTime, truncateHash } from '@/lib/format';
import {
  History,
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  Lock,
  ArrowRight,
  Info,
  RotateCcw,
} from 'lucide-react';

export default function AuditPage() {
  const [events, setEvents] = useState<AuditEvent[]>(getAuditEvents());
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const filteredEvents = events.filter((e) => {
    if (selectedRole !== 'ALL' && e.actorRole !== selectedRole) return false;
    if (search.trim()) {
      const q = search.toLowerCase();
      const matchAction = e.action.toLowerCase().includes(q);
      const matchDetails = e.details.toLowerCase().includes(q);
      const matchActor = e.actorName.toLowerCase().includes(q);
      const matchApp = e.applicationId.toLowerCase().includes(q);
      if (!matchAction && !matchDetails && !matchActor && !matchApp) return false;
    }
    return true;
  });

  const handleVerifyChain = async () => {
    setIsVerifying(true);
    const result = await verifyAuditChain(events);
    setIsVerifying(false);
    setVerificationResult(result);
  };

  const handleSimulateTamper = () => {
    if (events.length > 2) {
      const tampered = [...events];
      tampered[2] = {
        ...tampered[2],
        details: 'TAMPERED IN DEMO: Institutional record modified without authorization.',
      };
      setEvents(tampered);
      setVerificationResult(null);
    }
  };

  const handleResetAudit = () => {
    setEvents(getAuditEvents());
    setVerificationResult(null);
  };

  return (
    <AppShell>
      <PageHeader
        title="Verifiable Cryptographic Audit Trail"
        description="Append-only regulatory decision-support log secured by sequential SHA-256 block linking and tamper verification."
        breadcrumbs={[{ label: 'Audit Trail' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            SHA-256 Hash Chained
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <button
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="inline-flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-blue-600 hover:bg-blue-500 text-white text-xs font-semibold shadow-md shadow-blue-600/20 transition-all disabled:opacity-50"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Chain Integrity'}</span>
            </button>
            <button
              onClick={handleSimulateTamper}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-500/30 text-xs font-semibold transition-all"
              title="Demonstrates detection of unauthorized payload modification"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Simulate Tamper Test</span>
            </button>
            <button
              onClick={handleResetAudit}
              className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 hover:bg-slate-800 text-slate-300 border border-white/10 text-xs font-semibold transition-all"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset</span>
            </button>
          </div>
        }
      />

      {/* Verification Result Banner */}
      {verificationResult && (
        <div
          className={`p-4 rounded-xl border flex items-start gap-3 transition-all ${
            verificationResult.passed
              ? 'bg-emerald-950/40 border-emerald-500/30 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/30 text-rose-300'
          }`}
        >
          {verificationResult.passed ? (
            <CheckCircle2 className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
          ) : (
            <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
          )}
          <div className="space-y-1">
            <h4 className="text-xs font-bold uppercase tracking-wider">
              {verificationResult.passed
                ? 'Integrity Check Passed (Local Demo Chain)'
                : 'Integrity Violation Detected'}
            </h4>
            <p className="text-xs">
              {verificationResult.passed
                ? `Successfully verified all ${verificationResult.eventsChecked} consecutive audit blocks. Sequence continuity and recomputed SHA-256 hashes match recorded signatures.`
                : `Tampering detected at event block ${verificationResult.failedEventId}: ${verificationResult.failureReason}`}
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="gov-card p-4 rounded-xl border border-white/10 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, details, application..."
            className="w-full bg-slate-900 border border-white/10 text-xs text-white rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Actor Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="bg-slate-900 border border-white/10 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
          >
            <option value="ALL">All Roles</option>
            <option value="Officer">Officer</option>
            <option value="Reviewer">Reviewer</option>
            <option value="Administrator">Administrator</option>
          </select>
        </div>
      </div>

      {/* Event Timeline / Blocks */}
      <div className="space-y-3">
        {filteredEvents.map((event, index) => (
          <div
            key={event.id}
            className="gov-card p-4 rounded-xl border border-white/10 space-y-2 hover:border-white/20 transition-all text-xs"
          >
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2">
              <div className="flex items-center gap-2">
                <span className="font-mono text-blue-400 font-bold bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  Block #{index + 1} &bull; {event.id}
                </span>
                <span className="font-bold text-white uppercase tracking-wider text-[11px]">
                  {event.action.replace(/_/g, ' ')}
                </span>
                <span className="text-[10px] px-2 py-0.5 rounded bg-slate-800 text-slate-300 font-semibold">
                  {event.actorRole}
                </span>
              </div>
              <span className="text-slate-400 text-[11px] font-mono">
                {formatDateTime(event.timestamp)}
              </span>
            </div>

            <p className="text-slate-200">{event.details}</p>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-2 p-2.5 rounded-lg bg-slate-950/60 border border-white/5 font-mono text-[10.5px]">
              <div className="truncate">
                <span className="text-slate-500">Prev Hash: </span>
                <span className="text-slate-400">{event.previousHash}</span>
              </div>
              <div className="truncate">
                <span className="text-slate-500">Event Hash: </span>
                <span className="text-emerald-400">{event.eventHash}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-1 border-t border-white/5">
              <span>Actor: <strong className="text-slate-300">{event.actorName}</strong></span>
              <span>Target: <span className="font-mono text-blue-400">{event.applicationId}</span></span>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
