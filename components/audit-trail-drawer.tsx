'use client';

import React from 'react';
import { AuditEvent } from '@/lib/types';
import { formatDateTime } from '@/lib/format';
import {
  X,
  Lock,
  User,
  Clock,
  Hash,
  Link as LinkIcon,
  Copy,
  Check,
} from 'lucide-react';

interface AuditTrailDrawerProps {
  event: AuditEvent | null;
  isOpen: boolean;
  onClose: () => void;
}

export function AuditTrailDrawer({ event, isOpen, onClose }: AuditTrailDrawerProps) {
  const [copiedHash, setCopiedHash] = React.useState<string | null>(null);

  if (!isOpen || !event) return null;

  const handleCopy = (text: string, key: string) => {
    navigator.clipboard.writeText(text);
    setCopiedHash(key);
    setTimeout(() => setCopiedHash(null), 1500);
  };

  return (
    <div
      className="fixed inset-0 z-50 flex justify-end bg-black/70 backdrop-blur-sm animate-in fade-in duration-150"
      onClick={onClose}
    >
      <div
        className="w-full max-w-lg h-full bg-slate-950 border-l border-white/10 shadow-2xl overflow-y-auto p-6 space-y-6 flex flex-col justify-between"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="space-y-6">
          {/* Header */}
          <div className="flex items-start justify-between pb-4 border-b border-white/10">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <span className="font-mono text-xs font-bold text-blue-400 bg-blue-500/10 px-2 py-0.5 rounded border border-blue-500/20">
                  {event.id}
                </span>
                <span className="text-[11px] px-2 py-0.5 rounded bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>SHA-256 Chained</span>
                </span>
              </div>
              <h3 className="text-base font-bold text-white tracking-tight">{event.action}</h3>
            </div>

            <button
              onClick={onClose}
              className="p-1.5 rounded-lg text-slate-400 hover:text-white hover:bg-white/10 transition-colors"
              aria-label="Close drawer"
            >
              <X className="w-5 h-5" />
            </button>
          </div>

          {/* Actor & Timestamp */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <User className="w-3 h-3 text-blue-400" />
                <span>Officer / Actor</span>
              </span>
              <p className="font-semibold text-white">{event.actorName}</p>
              <p className="text-[10.5px] text-slate-400 font-mono">Role: {event.actorRole}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                <Clock className="w-3 h-3 text-emerald-400" />
                <span>Timestamp</span>
              </span>
              <p className="font-semibold text-white">{formatDateTime(event.timestamp)}</p>
              <p className="text-[10.5px] text-slate-400 font-mono">UTC Indexed</p>
            </div>
          </div>

          {/* Details */}
          <div className="glass-card p-4 rounded-xl transition-all duration-200 space-y-2">
            <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
              Event Details & Rationale
            </span>
            <p className="text-xs text-slate-200 leading-relaxed font-sans">{event.details}</p>
          </div>

          {/* Target Application & Rules */}
          <div className="grid grid-cols-2 gap-3 text-xs">
            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Target Application</span>
              <p className="font-mono text-blue-400 font-semibold">{event.applicationId}</p>
            </div>

            <div className="p-3 rounded-xl bg-slate-900/40 border border-white/5 space-y-1">
              <span className="text-[10px] uppercase font-bold text-slate-400">Referenced Rules</span>
              <p className="font-mono text-slate-300">
                {event.ruleIds && event.ruleIds.length > 0 ? event.ruleIds.join(', ') : 'Global / None'}
              </p>
            </div>
          </div>

          {/* Cryptographic Hashes */}
          <div className="space-y-3 pt-2 border-t border-white/10 text-xs">
            <h4 className="font-bold text-white text-xs flex items-center gap-1.5">
              <Hash className="w-4 h-4 text-purple-400" />
              <span>Cryptographic Block Verification</span>
            </h4>

            {/* Previous Hash */}
            <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-slate-400 flex items-center gap-1">
                  <LinkIcon className="w-3 h-3 text-slate-500" />
                  <span>Previous Block Hash (Pointers Link)</span>
                </span>
                <button
                  onClick={() => handleCopy(event.previousHash, 'prev')}
                  className="text-slate-400 hover:text-white p-1"
                  title="Copy hash"
                >
                  {copiedHash === 'prev' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="font-mono text-[11px] text-slate-300 break-all bg-slate-950 p-2 rounded border border-white/5 select-all">
                {event.previousHash}
              </p>
            </div>

            {/* Current Event Hash */}
            <div className="p-3 rounded-xl bg-slate-900 border border-white/5 space-y-1.5">
              <div className="flex items-center justify-between">
                <span className="text-[10px] uppercase font-bold text-emerald-400 flex items-center gap-1">
                  <Lock className="w-3 h-3" />
                  <span>Current Event SHA-256 Hash</span>
                </span>
                <button
                  onClick={() => handleCopy(event.eventHash, 'curr')}
                  className="text-slate-400 hover:text-white p-1"
                  title="Copy hash"
                >
                  {copiedHash === 'curr' ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                </button>
              </div>
              <p className="font-mono text-[11px] text-emerald-300 break-all bg-slate-950 p-2 rounded border border-emerald-500/20 select-all">
                {event.eventHash}
              </p>
            </div>
          </div>
        </div>

        {/* Footer */}
        <div className="pt-4 border-t border-white/10 text-[11px] text-slate-400 flex items-center justify-between">
          <span>Verifiable Local Demo Ledger</span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 text-xs font-medium"
          >
            Close
          </button>
        </div>
      </div>
    </div>
  );
}
