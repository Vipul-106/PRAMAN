'use client';

import React, { useState } from 'react';
import { DocumentRecord, ExtractedField, BoundingBox } from '@/lib/types';
import { ZoomIn, ZoomOut, FileText, ChevronLeft, ChevronRight, Stamp, ShieldCheck } from 'lucide-react';

interface DocumentPreviewProps {
  document: DocumentRecord;
  activeFieldKey?: string | null;
  onSelectField?: (field: ExtractedField) => void;
  highlightedBbox?: BoundingBox | null;
}

export function DocumentPreview({
  document,
  activeFieldKey,
  onSelectField,
  highlightedBbox,
}: DocumentPreviewProps) {
  const [currentPage, setCurrentPage] = useState(1);
  const [zoomLevel, setZoomLevel] = useState<1 | 1.25 | 1.5>(1);

  const totalPages = document.pageCount || 1;

  const handleZoomIn = () => {
    setZoomLevel((prev) => (prev === 1 ? 1.25 : 1.5));
  };

  const handleZoomOut = () => {
    setZoomLevel((prev) => (prev === 1.5 ? 1.25 : 1));
  };

  const pageFields = document.extractedFields.filter((f) => (f.page || 1) === currentPage);

  return (
    <div className="gov-card rounded-xl border border-white/10 flex flex-col h-full overflow-hidden bg-slate-950">
      {/* Document Viewer Header Toolbar */}
      <div className="p-3 border-b border-white/10 bg-slate-900/90 flex items-center justify-between gap-3 text-xs">
        <div className="flex items-center gap-2 min-w-0">
          <FileText className="w-4 h-4 text-blue-400 shrink-0" />
          <span className="font-bold text-white truncate" title={document.name}>
            {document.name}
          </span>
          <span className="text-[10px] px-1.5 py-0.5 rounded bg-blue-500/20 text-blue-300 font-mono">
            {document.fileName}
          </span>
        </div>

        {/* Zoom and Page Controls */}
        <div className="flex items-center gap-2 shrink-0">
          <div className="flex items-center gap-1 bg-slate-950 border border-white/10 rounded-lg px-2 py-1 text-slate-300">
            <button
              onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
              disabled={currentPage <= 1}
              className="hover:text-white disabled:opacity-30 transition-colors p-0.5"
              aria-label="Previous page"
            >
              <ChevronLeft className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] px-1">
              Page {currentPage} of {totalPages}
            </span>
            <button
              onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
              disabled={currentPage >= totalPages}
              className="hover:text-white disabled:opacity-30 transition-colors p-0.5"
              aria-label="Next page"
            >
              <ChevronRight className="w-3.5 h-3.5" />
            </button>
          </div>

          <div className="flex items-center gap-1 bg-slate-950 border border-white/10 rounded-lg px-1.5 py-1 text-slate-300">
            <button
              onClick={handleZoomOut}
              disabled={zoomLevel === 1}
              className="hover:text-white disabled:opacity-30 p-0.5"
              title="Zoom out"
            >
              <ZoomOut className="w-3.5 h-3.5" />
            </button>
            <span className="font-mono text-[11px] w-8 text-center">{Math.round(zoomLevel * 100)}%</span>
            <button
              onClick={handleZoomIn}
              disabled={zoomLevel === 1.5}
              className="hover:text-white disabled:opacity-30 p-0.5"
              title="Zoom in"
            >
              <ZoomIn className="w-3.5 h-3.5" />
            </button>
          </div>
        </div>
      </div>

      {/* Simulated Document Canvas */}
      <div className="flex-1 overflow-auto p-4 flex items-center justify-center bg-slate-900/40 relative min-h-[380px]">
        <div
          className="relative bg-white text-slate-900 shadow-2xl rounded-sm transition-transform duration-200 border border-slate-300 origin-top"
          style={{
            width: '100%',
            maxWidth: '520px',
            minHeight: '680px',
            transform: `scale(${zoomLevel})`,
            padding: '2rem 1.75rem',
            fontFamily: 'serif',
          }}
        >
          {/* Watermark / Synthetic Preview Notice */}
          <div className="absolute inset-0 flex items-center justify-center pointer-events-none opacity-[0.06] select-none rotate-[-35deg]">
            <span className="text-5xl font-black uppercase tracking-widest text-slate-900">
              SYNTHETIC PREVIEW
            </span>
          </div>

          {/* Official Letterhead Simulation */}
          <div className="text-center border-b-2 border-slate-800 pb-3 mb-4">
            <div className="flex items-center justify-center gap-2 mb-1">
              <Stamp className="w-5 h-5 text-amber-700" />
              <span className="text-[11px] font-sans font-bold uppercase tracking-wider text-slate-700">
                GOVERNMENT OF INDIA &bull; COMPETENT REGULATORY ISSUANCE
              </span>
            </div>
            <h4 className="text-base font-bold uppercase text-slate-900 tracking-tight font-sans">
              {document.issuer}
            </h4>
            <p className="text-[10px] text-slate-600 font-sans mt-0.5">
              Statutory Approval & Compliance Clearance Certificate
            </p>
          </div>

          {/* Certificate Metadata Row */}
          <div className="flex justify-between items-center text-[10px] font-sans text-slate-600 mb-4 pb-2 border-b border-slate-200">
            <div>
              <span>Doc Ref: </span>
              <strong className="font-mono text-slate-900 font-bold">{document.fileName}</strong>
            </div>
            <div>
              <span>Validity: </span>
              <strong className="text-slate-900">{document.expiryDate || 'Perpetual / 2026-27'}</strong>
            </div>
          </div>

          {/* Render Extracted Fields with Normalized Bounding Box Overlays */}
          <div className="relative font-sans text-xs space-y-3.5 my-4">
            {highlightedBbox && (
              <div
                className="absolute border-2 border-dashed border-rose-500 bg-rose-500/10 rounded pointer-events-none z-10"
                style={{
                  left: `${highlightedBbox.x * 100}%`,
                  top: `${highlightedBbox.y * 100}%`,
                  width: `${highlightedBbox.width * 100}%`,
                  height: `${highlightedBbox.height * 100}%`,
                }}
              />
            )}
            <div className="p-2.5 rounded bg-slate-50 border border-slate-200 text-[11px] leading-relaxed">
              This is to formally certify that the institution specified hereunder has complied with the
              stipulated norms and standards under statutory verification protocols for academic session 2026-27.
            </div>

            <div className="space-y-2.5 pt-1">
              {pageFields.map((field) => {
                const isSelected = activeFieldKey === field.key;

                return (
                  <div
                    key={field.key}
                    onClick={() => onSelectField && onSelectField(field)}
                    className={`relative p-2 rounded cursor-pointer transition-all border ${
                      isSelected
                        ? 'bg-blue-100/90 border-blue-600 ring-2 ring-blue-500/50 shadow-sm'
                        : 'bg-slate-100/70 border-slate-200 hover:border-blue-400 hover:bg-blue-50/50'
                    }`}
                  >
                    <div className="flex items-center justify-between text-[10px] text-slate-500 mb-0.5 font-medium">
                      <span>{field.label}</span>
                      <span className="font-mono font-bold text-blue-700">
                        Confidence: {(field.confidence * 100).toFixed(0)}%
                      </span>
                    </div>
                    <div className="text-xs font-semibold text-slate-900 font-mono">
                      {field.value}
                    </div>

                    {/* Visual indicator of bounding box match */}
                    {isSelected && (
                      <div className="mt-1 flex items-center gap-1 text-[9.5px] font-sans text-blue-800">
                        <span className="w-1.5 h-1.5 rounded-full bg-blue-600 animate-pulse" />
                        <span>OCR Region BBox [x: {field.bbox.x}, y: {field.bbox.y}, w: {field.bbox.width}, h: {field.bbox.height}]</span>
                      </div>
                    )}
                  </div>
                );
              })}
            </div>

            {/* Official Seal / Signature Stamp */}
            <div className="pt-8 flex justify-between items-end text-[10px] text-slate-600">
              <div className="border border-dashed border-slate-400 rounded p-2 text-center w-28 bg-slate-50">
                <Stamp className="w-4 h-4 mx-auto text-slate-500 mb-0.5" />
                <span className="block font-bold text-slate-700 text-[9px] uppercase">Official Seal</span>
                <span className="text-[8px] text-slate-500">Verified Stamp</span>
              </div>
              <div className="text-right space-y-1">
                <div className="h-6 border-b border-slate-400 w-32 ml-auto" />
                <span className="block font-bold text-slate-800">Competent Authority Signatory</span>
                <span className="block text-[9px] text-slate-500">Digitally Verified Hash Signed</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Footer Info */}
      <div className="p-2.5 px-4 bg-slate-900/90 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-400">
        <span className="flex items-center gap-1.5">
          <ShieldCheck className="w-3.5 h-3.5 text-emerald-400" />
          <span>Synthetic Document Extraction Preview &bull; Click any field to inspect OCR bounding box</span>
        </span>
        <span className="font-mono text-slate-500">Confidence Avg: {(document.confidence * 100).toFixed(0)}%</span>
      </div>
    </div>
  );
}
