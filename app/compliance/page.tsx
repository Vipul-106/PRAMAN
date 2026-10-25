'use client';

import React from 'react';
import Link from 'next/link';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { mockDatabase } from '@/lib/mock-data';
import { formatDate } from '@/lib/format';
import {
  Building,
  MapPin,
  CheckCircle2,
  AlertTriangle,
  Info,
  ExternalLink,
  Shield,
  Layers,
} from 'lucide-react';

export default function CompliancePage() {
  const checks = mockDatabase.infrastructureChecks;

  const getOutcomeBadge = (outcome: string) => {
    switch (outcome) {
      case 'No discrepancy indicated':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Needs additional evidence':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Recommend inspection':
      default:
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
    }
  };

  return (
    <AppShell>
      <PageHeader
        title="Infrastructure & Evidence Compliance Screening"
        description="Advisory documentary screening for campus geotagging, laboratory equipment density, and architectural floor-plan area norms."
        breadcrumbs={[{ label: 'Compliance Review' }]}
      />

      {/* Statutory Advisory Notice */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div>
          <span className="font-semibold text-white">ADVISORY SCREENING SAFEGUARD:</span> Visual and documentary screening results are preliminary aids to triage cases. Visual inspection alone cannot establish statutory compliance; competent authorities determine physical inspection requirements.
        </div>
      </div>

      {/* Summary Cards */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="gov-card p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Total Infrastructure Checks
          </span>
          <p className="text-2xl font-bold text-white">{checks.length}</p>
          <span className="text-[11px] text-slate-500">Photographs, Blueprints & Surveys</span>
        </div>
        <div className="gov-card p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Clearance Conforming
          </span>
          <p className="text-2xl font-bold text-emerald-400">
            {checks.filter((c) => c.advisoryOutcome === 'No discrepancy indicated').length}
          </p>
          <span className="text-[11px] text-slate-500">Dimensions & Geotags match norms</span>
        </div>
        <div className="gov-card p-4 rounded-xl border border-white/10 space-y-1">
          <span className="text-xs text-slate-400 font-semibold uppercase tracking-wider">
            Recommend Physical Inspection
          </span>
          <p className="text-2xl font-bold text-rose-400">
            {checks.filter((c) => c.advisoryOutcome === 'Recommend inspection').length}
          </p>
          <span className="text-[11px] text-slate-500">Area deficit or uncalibrated equipment</span>
        </div>
      </div>

      {/* Infrastructure Items Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {checks.map((item) => (
          <div
            key={item.id}
            className="gov-card p-5 rounded-xl border border-white/10 space-y-3"
          >
            <div className="flex items-start justify-between gap-2">
              <div className="space-y-0.5">
                <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                  {item.evidenceType.replace('_', ' ')}
                </span>
                <h4 className="text-sm font-bold text-white">{item.title}</h4>
              </div>
              <span className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getOutcomeBadge(item.advisoryOutcome)}`}>
                {item.advisoryOutcome}
              </span>
            </div>

            <p className="text-xs text-slate-300 leading-relaxed">{item.reason}</p>

            <div className="p-3 rounded-lg bg-slate-900/80 border border-white/5 space-y-1.5 text-xs">
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Declared Dimension:</span>
                <span className="font-semibold text-slate-200">{item.declaredValue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Measured from Evidence:</span>
                <span className="font-semibold text-blue-400">{item.measuredValue}</span>
              </div>
              <div className="flex items-center justify-between">
                <span className="text-slate-400">Mandated Minimum Threshold:</span>
                <span className="font-semibold text-slate-300">{item.threshold}</span>
              </div>
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-400 pt-2 border-t border-white/5">
              <div className="flex items-center gap-1.5">
                <MapPin className="w-3.5 h-3.5 text-slate-500" />
                <span>{item.location}</span>
              </div>
              <Link
                href={`/applications/${item.applicationId}`}
                className="text-blue-400 hover:underline flex items-center gap-1 font-medium"
              >
                <span>View Case</span>
                <ExternalLink className="w-3 h-3" />
              </Link>
            </div>
          </div>
        ))}
      </div>
    </AppShell>
  );
}
