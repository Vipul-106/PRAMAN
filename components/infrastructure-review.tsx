'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { InfrastructureFinding } from '@/lib/types';
import {
  Info,
  ExternalLink,
  Layers,
  Image as ImageIcon,
  Compass,
  FileText,
} from 'lucide-react';

interface InfrastructureReviewProps {
  checks: InfrastructureFinding[];
}

export function InfrastructureReview({ checks }: InfrastructureReviewProps) {
  const [filterType, setFilterType] = useState<string>('ALL');

  const filteredChecks = checks.filter((c) => {
    if (filterType !== 'ALL' && c.evidenceType !== filterType) return false;
    return true;
  });

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
    <div className="space-y-6">
      {/* Statutory Safeguard Notice */}
      <div className="p-4 rounded-xl bg-slate-900/80 border border-white/10 flex items-start gap-3 text-xs text-slate-300">
        <Info className="w-5 h-5 text-indigo-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white uppercase tracking-wider text-[11px]">
            ADVISORY SCREENING SAFEGUARD: PHYSICAL INSPECTION RETAINED
          </p>
          <p className="leading-relaxed">
            Visual/documentary screening only; physical inspection may still be required. Image metadata,
            computer-vision screening, and floor-plan area calculations are automated triage aids to flag
            potential deficiency risks. Final infrastructure clearance requires authorized Expert Visiting
            Committee (EVC) verification under the Approval Process Handbook.
          </p>
        </div>
      </div>

      {/* Aggregate Overview Metrics */}
      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
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
          <span className="text-[11px] text-slate-500">Area deficit or uncalibrated evidence</span>
        </div>
      </div>

      {/* Filter Tabs */}
      <div className="flex items-center gap-2 border-b border-white/10 pb-2 text-xs">
        {['ALL', 'photograph', 'floor_plan', 'land_certificate'].map((type) => (
          <button
            key={type}
            onClick={() => setFilterType(type)}
            className={`px-3 py-1.5 rounded-lg font-semibold transition-all ${
              filterType === type
                ? 'bg-blue-600/30 text-white border border-blue-500/40'
                : 'text-slate-400 hover:text-white hover:bg-white/5 border border-transparent'
            }`}
          >
            {type === 'ALL'
              ? 'All Evidence'
              : type === 'photograph'
              ? 'Photographs'
              : type === 'floor_plan'
              ? 'Floor Plans'
              : 'Land Surveys'}
          </button>
        ))}
      </div>

      {/* Evidence Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        {filteredChecks.map((item) => {
          const isPhoto = item.evidenceType === 'photograph';
          const isFloorPlan = item.evidenceType === 'floor_plan';

          return (
            <div
              key={item.id}
              className="gov-card p-5 rounded-xl border border-white/10 space-y-3.5 bg-slate-900/80 transition-all hover:border-white/20"
            >
              <div className="flex items-start justify-between gap-2">
                <div className="space-y-0.5">
                  <div className="flex items-center gap-2">
                    {isPhoto ? (
                      <ImageIcon className="w-4 h-4 text-blue-400" />
                    ) : isFloorPlan ? (
                      <Layers className="w-4 h-4 text-purple-400" />
                    ) : (
                      <FileText className="w-4 h-4 text-emerald-400" />
                    )}
                    <span className="text-[10.5px] uppercase font-bold text-slate-400 tracking-wider">
                      {item.evidenceType.replace('_', ' ')}
                    </span>
                  </div>
                  <h4 className="text-sm font-bold text-white">{item.title}</h4>
                </div>

                <span
                  className={`px-2.5 py-1 rounded-full text-xs font-semibold border ${getOutcomeBadge(
                    item.advisoryOutcome
                  )}`}
                >
                  {item.advisoryOutcome}
                </span>
              </div>

              {/* Reason Explanation */}
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-950/60 p-3 rounded-lg border border-white/5">
                {item.reason}
              </p>

              {/* Technical Screening Metrics */}
              <div className="grid grid-cols-2 gap-2 text-[11px] p-2.5 rounded-lg bg-slate-950/40 border border-white/5">
                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-semibold">Declared by College:</span>
                  <span className="font-mono text-white">{item.declaredValue}</span>
                </div>

                <div className="space-y-0.5">
                  <span className="text-slate-400 block font-semibold">Measured / Verified:</span>
                  <span
                    className={`font-mono font-bold ${
                      item.result === 'Pass'
                        ? 'text-emerald-400'
                        : item.result === 'Mismatch'
                        ? 'text-rose-400'
                        : 'text-amber-400'
                    }`}
                  >
                    {item.measuredValue}
                  </span>
                </div>

                <div className="col-span-2 pt-1 border-t border-white/5 flex items-center justify-between text-slate-400">
                  <span className="flex items-center gap-1">
                    <Compass className="w-3 h-3 text-slate-500" />
                    <span>Location: {item.location}</span>
                  </span>
                  <span className="font-mono text-slate-400">{item.hasGps ? 'GPS Geotagged' : 'Missing Geotag'}</span>
                </div>
              </div>

              {/* Footer link to application */}
              <div className="pt-2 border-t border-white/5 flex items-center justify-between text-xs">
                <span className="text-[11px] text-slate-500 font-mono">
                  File: {item.fileName}
                </span>

                <Link
                  href={`/applications/${item.applicationId}`}
                  className="inline-flex items-center gap-1 text-blue-400 hover:text-blue-300 font-semibold"
                >
                  <span>Open Case Workspace</span>
                  <ExternalLink className="w-3 h-3" />
                </Link>
              </div>
            </div>
          );
        })}
      </div>
    </div>
  );
}
