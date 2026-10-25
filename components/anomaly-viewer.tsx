'use client';

import React, { useState } from 'react';
import { DocumentRecord } from '@/lib/types';
import {
  ShieldAlert,
  Flame,
  Fingerprint,
  Calendar,
  FileCode,
  CheckCircle2,
  ZoomIn,
} from 'lucide-react';

interface AnomalyViewerProps {
  document: DocumentRecord;
  institutionName?: string;
}

export function AnomalyViewer({ document, institutionName }: AnomalyViewerProps) {
  const [selectedAnomalyId, setSelectedAnomalyId] = useState<string | null>(
    document.anomalies[0]?.id || null
  );

  const anomalies = document.anomalies;

  return (
    <div className="space-y-6">
      {/* Statutory Safeguard Banner */}
      <div className="p-4 rounded-xl bg-rose-950/20 border border-rose-500/30 flex items-start gap-3 text-xs text-rose-200">
        <ShieldAlert className="w-5 h-5 text-rose-400 shrink-0 mt-0.5" />
        <div className="space-y-1">
          <p className="font-bold text-white uppercase tracking-wider text-[11px]">
            ADVISORY ANOMALY SIGNALS &bull; HUMAN VERIFICATION MANDATORY
          </p>
          <p className="leading-relaxed">
            All anomaly detection signals are automated triage indicators. They highlight potential
            digital modifications, compression anomalies, or metadata inconsistencies requiring expert
            human review. They do <strong>NOT</strong> constitute legal proof of tampering or forgery.
          </p>
        </div>
      </div>

      {anomalies.length === 0 && !document.metadata?.hasEditTraces ? (
        <div className="gov-card p-8 rounded-xl border border-white/10 text-center space-y-3">
          <CheckCircle2 className="w-10 h-10 text-emerald-400 mx-auto" />
          <h4 className="text-sm font-bold text-white">No Advisory Anomalies Detected</h4>
          <p className="text-xs text-slate-400 max-w-md mx-auto">
            Document metadata, font encoding, and structural compression profiles conform to standard
            statutory PDF production patterns.
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Left Column: Anomaly Categories & List */}
          <div className="lg:col-span-5 space-y-3">
            <h4 className="text-xs font-bold uppercase tracking-wider text-slate-400 mb-2">
              Detected Signal Categories ({anomalies.length})
            </h4>

            {/* Metadata Edit-Trace Card if present */}
            {document.metadata?.hasEditTraces && (
              <div
                onClick={() => setSelectedAnomalyId('metadata-edit')}
                className={`p-4 rounded-xl border cursor-pointer transition-all ${
                  selectedAnomalyId === 'metadata-edit'
                    ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500'
                    : 'bg-slate-900/80 border-rose-500/30 hover:border-rose-500/60'
                }`}
              >
                <div className="flex items-center gap-2 mb-1.5">
                  <FileCode className="w-4 h-4 text-rose-400" />
                  <span className="text-xs font-bold text-white">
                    Metadata / Producer Trace
                  </span>
                </div>
                <p className="text-[11.5px] text-slate-300">
                  Creator / Producer tags indicate modification with consumer editing software.
                </p>
                <span className="inline-block mt-2 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                  Potential anomaly — requires human verification
                </span>
              </div>
            )}

            {/* Seeded Anomalies List */}
            {anomalies.map((anom) => {
              const isSelected = selectedAnomalyId === anom.id;

              return (
                <div
                  key={anom.id}
                  onClick={() => setSelectedAnomalyId(anom.id)}
                  className={`p-4 rounded-xl border cursor-pointer transition-all ${
                    isSelected
                      ? 'bg-rose-950/40 border-rose-500 ring-1 ring-rose-500'
                      : 'bg-slate-900/80 border-rose-500/30 hover:border-rose-500/60'
                  }`}
                >
                  <div className="flex items-center justify-between gap-2 mb-1.5">
                    <div className="flex items-center gap-2">
                      {anom.type === 'ela_heatmap' && <Flame className="w-4 h-4 text-amber-400" />}
                      {anom.type === 'cross_reuse' && <Fingerprint className="w-4 h-4 text-purple-400" />}
                      {anom.type === 'date_anomaly' && <Calendar className="w-4 h-4 text-blue-400" />}
                      <span className="text-xs font-bold text-white">{anom.title}</span>
                    </div>
                    <span className="text-[10px] uppercase font-mono px-1.5 py-0.5 rounded bg-rose-500/20 text-rose-300 font-bold">
                      {anom.severity}
                    </span>
                  </div>

                  <p className="text-[11.5px] text-slate-300 leading-snug">
                    {anom.description}
                  </p>

                  <span className="inline-block mt-2 text-[10px] font-semibold text-rose-400 bg-rose-500/10 px-2 py-0.5 rounded border border-rose-500/20">
                    Potential anomaly — requires human verification
                  </span>
                </div>
              );
            })}
          </div>

          {/* Right Column: Detailed Forensic Simulator Display */}
          <div className="lg:col-span-7 gov-card rounded-xl border border-white/10 p-5 space-y-4 bg-slate-950">
            <div className="flex items-center justify-between pb-3 border-b border-white/10">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <ZoomIn className="w-4 h-4 text-blue-400" />
                <span>Forensic Inspection Visualizer</span>
              </h4>
              <span className="text-[11px] text-slate-400 font-mono">
                {institutionName ? `${institutionName} • ` : ''}{document.fileName}
              </span>
            </div>

            {/* ELA Heatmap Overlay Visualization */}
            <div className="relative rounded-lg overflow-hidden border border-slate-700 bg-slate-900 min-h-[300px] p-6 flex flex-col items-center justify-center">
              {/* Simulated Document Canvas Background */}
              <div className="w-full max-w-md bg-slate-950 border border-slate-800 rounded p-4 text-[11px] font-mono text-slate-400 space-y-2 relative">
                <div className="text-center font-bold text-slate-300 border-b border-slate-800 pb-2">
                  STATE FIRE & RESCUE SERVICES CLEARANCE
                </div>
                <div className="flex justify-between">
                  <span>Certificate ID:</span>
                  <span className="text-white">FS-2026-9021</span>
                </div>
                <div className="flex justify-between">
                  <span>Validity End:</span>
                  <span className="text-white">2028-06-30</span>
                </div>
                <div className="flex justify-between">
                  <span>Occupancy Capacity:</span>
                  <span className="text-white">600 Persons</span>
                </div>

                {/* Simulated ELA Thermal Gradient Overlay */}
                <div
                  className="absolute inset-x-8 top-16 h-28 rounded border-2 border-rose-500 pointer-events-none"
                  style={{
                    background:
                      'radial-gradient(ellipse at center, rgba(244,63,94,0.45) 0%, rgba(245,158,11,0.25) 50%, rgba(59,130,246,0.05) 100%)',
                    boxShadow: '0 0 25px rgba(244,63,94,0.4)',
                  }}
                >
                  <div className="absolute top-1 right-2 text-[9px] font-sans font-bold text-rose-300 bg-rose-950/80 px-1 rounded">
                    ELA Gradient Delta &gt; 38%
                  </div>
                </div>
              </div>

              {/* Heatmap Legend */}
              <div className="mt-4 flex items-center justify-center gap-4 text-[10px] text-slate-400">
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-rose-500" />
                  <span>High Compression Variance (Suspicious Inset)</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-amber-500" />
                  <span>Medium Transition</span>
                </span>
                <span className="flex items-center gap-1.5">
                  <span className="w-2.5 h-2.5 rounded-full bg-blue-500" />
                  <span>Uniform Baseline</span>
                </span>
              </div>
            </div>

            {/* Metadata & Fingerprint Comparison Details */}
            <div className="space-y-3 pt-2 text-xs">
              <h5 className="font-bold text-white text-xs">Technical Signal Breakdown</h5>
              <div className="grid grid-cols-2 gap-2 text-[11px]">
                <div className="p-2.5 rounded bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-slate-400 block font-semibold">Producer Tool:</span>
                  <span className="font-mono text-rose-300">{document.metadata?.producer || 'Adobe InDesign / Photoshop'}</span>
                </div>
                <div className="p-2.5 rounded bg-slate-900 border border-white/5 space-y-1">
                  <span className="text-slate-400 block font-semibold">Digital Hash:</span>
                  <span className="font-mono text-slate-300 truncate block">{document.metadata?.fingerprint || 'sha256_fp_synthetic_coll'}</span>
                </div>
              </div>

              {document.metadata?.fingerprint && (
                <div className="p-3 rounded-lg bg-purple-950/30 border border-purple-500/30 text-purple-200 text-[11.5px] space-y-1">
                  <div className="font-bold flex items-center gap-1.5">
                    <Fingerprint className="w-3.5 h-3.5" />
                    <span>Cross-Institutional Fingerprint Collision Warning</span>
                  </div>
                  <p>
                    Fingerprint matches another file submitted in regional cluster by fictional institution{' '}
                    <strong>SYN-INST-102 (Kalinga Polytechnic)</strong>. Scrutiny officer must verify if
                    both colleges share common management trust.
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
