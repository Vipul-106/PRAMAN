'use client';

import React, { useState } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { AuditTrailDrawer } from '@/components/audit-trail-drawer';
import { AuditEvent } from '@/lib/types';
import { verifyAuditChain, ChainVerificationResult } from '@/lib/audit';
import { formatDateTime } from '@/lib/format';
import { useSession } from '@/lib/session-context';
import {
  ShieldCheck,
  ShieldAlert,
  Search,
  CheckCircle2,
  Lock,
  Info,
  RotateCcw,
  Eye,
} from 'lucide-react';
import { ThreeDButton } from '@/components/ui/three-d-button';

export default function AuditPage() {
  const { auditEvents, simulateTamper, resetAuditChain } = useSession();
  const [selectedEvent, setSelectedEvent] = useState<AuditEvent | null>(null);
  const [isDrawerOpen, setIsDrawerOpen] = useState(false);
  const [verificationResult, setVerificationResult] = useState<ChainVerificationResult | null>(null);
  const [isVerifying, setIsVerifying] = useState(false);
  const [search, setSearch] = useState('');
  const [selectedRole, setSelectedRole] = useState<string>('ALL');

  const filteredEvents = auditEvents.filter((e) => {
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
    const result = await verifyAuditChain(auditEvents);
    setIsVerifying(false);
    setVerificationResult(result);
  };

  const handleOpenEvent = (event: AuditEvent) => {
    setSelectedEvent(event);
    setIsDrawerOpen(true);
  };

  return (
    <AppShell>
      <PageHeader
        title="Audit Trail"
        description="A verifiable record of scrutiny activity, linked by SHA-256 hashes."
        breadcrumbs={[{ label: 'Audit Trail' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 flex items-center gap-1.5">
            <Lock className="w-3.5 h-3.5" />
            SHA-256 Hash Chained
          </span>
        }
        actions={
          <div className="flex items-center gap-2">
            <ThreeDButton
              onClick={handleVerifyChain}
              disabled={isVerifying}
              className="min-w-0 text-xs px-3 py-1 gap-1.5 bg-blue-600 text-white dark:bg-blue-600 dark:text-white"
            >
              <ShieldCheck className={`w-3.5 h-3.5 ${isVerifying ? 'animate-spin' : ''}`} />
              <span>{isVerifying ? 'Verifying Hashes...' : 'Verify Chain Integrity'}</span>
            </ThreeDButton>
            <ThreeDButton
              onClick={() => {
                simulateTamper();
                setVerificationResult(null);
              }}
              className="min-w-0 text-xs px-3 py-1 gap-1.5 bg-rose-900/80 text-rose-100 dark:bg-rose-900/80 dark:text-rose-100"
              title="Demonstrates detection of unauthorized payload modification"
            >
              <ShieldAlert className="w-3.5 h-3.5" />
              <span>Simulate Tamper Test</span>
            </ThreeDButton>
            <ThreeDButton
              onClick={() => {
                resetAuditChain();
                setVerificationResult(null);
              }}
              className="min-w-0 text-xs px-3 py-1 gap-1.5 bg-slate-800 text-slate-200 dark:bg-slate-800 dark:text-slate-200"
            >
              <RotateCcw className="w-3.5 h-3.5" />
              <span>Reset Chain</span>
            </ThreeDButton>
          </div>
        }
      />

      {/* Notice */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-emerald-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">IMMUTABLE BLOCK CHAINING:</span> Every officer action,
          rule dry run, and issuer query is cryptographically appended using sequential SHA-256 hashing.
          Modifying any previous block breaks pointer hashes and fails verification.
        </div>
      </div>

      {/* Verification Status Banner */}
      {verificationResult && (
        <div
          className={`p-4 rounded-xl border flex items-center gap-3 text-xs transition-all ${
            verificationResult.passed
              ? 'bg-emerald-950/40 border-emerald-500/40 text-emerald-300'
              : 'bg-rose-950/40 border-rose-500/40 text-rose-300'
          }`}
        >
          {verificationResult.passed ? (
            <CheckCircle2 className="w-6 h-6 text-emerald-400 shrink-0" />
          ) : (
            <ShieldAlert className="w-6 h-6 text-rose-400 shrink-0" />
          )}
          <div className="space-y-0.5">
            <span className="font-bold text-sm block">
              {verificationResult.passed
                ? 'Integrity check passed (local demo chain)'
                : 'Cryptographic Tampering Detected!'}
            </span>
            <p className="text-xs opacity-90">
              {verificationResult.passed
                ? `Successfully verified ${verificationResult.eventsChecked} sequential blocks. All previous-hash pointers and SHA-256 payload digests match expected values.`
                : `Tampering detected at event block ${verificationResult.failedEventId}: ${verificationResult.failureReason}`}
            </p>
          </div>
        </div>
      )}

      {/* Filter and Search Bar */}
      <div className="glass-card p-4 rounded-xl transition-all duration-200 flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search action, actor, details, application..."
            className="glass-input w-full rounded-lg px-3 py-2 text-sm pl-9 pr-3"
          />
        </div>

        <div className="flex items-center gap-2 text-xs text-slate-400">
          <span>Actor Role:</span>
          <select
            value={selectedRole}
            onChange={(e) => setSelectedRole(e.target.value)}
            className="glass-input rounded-lg px-3 py-2 text-sm"
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
            onClick={() => handleOpenEvent(event)}
            className="glass-card p-4 rounded-xl transition-all duration-200 space-y-2 text-xs cursor-pointer group"
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
              <div className="flex items-center gap-3">
                <span className="text-slate-400 text-[11px] font-mono">
                  {formatDateTime(event.timestamp)}
                </span>
                <span className="text-blue-400 opacity-0 group-hover:opacity-100 transition-opacity flex items-center gap-1 font-semibold text-[11px]">
                  <Eye className="w-3.5 h-3.5" />
                  <span>Inspect</span>
                </span>
              </div>
            </div>

            <p className="text-slate-200 leading-relaxed">{event.details}</p>

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

      {/* Drawer */}
      <AuditTrailDrawer
        event={selectedEvent}
        isOpen={isDrawerOpen}
        onClose={() => setIsDrawerOpen(false)}
      />
    </AppShell>
  );
}
