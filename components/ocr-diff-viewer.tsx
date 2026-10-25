'use client';

import React, { useState } from 'react';
import { DocumentRecord, ExtractedField, InstitutionRecord } from '@/lib/types';
import { DocumentPreview } from './document-preview';
import {
  CheckCircle2,
  AlertTriangle,
  Database,
  Sparkles,
} from 'lucide-react';

interface OCRDiffViewerProps {
  document: DocumentRecord;
  institution?: InstitutionRecord;
  onSelectFindingField?: (fieldKey: string) => void;
  selectedFieldKey?: string;
}

export function OCRDiffViewer({
  document,
  institution,
  onSelectFindingField,
  selectedFieldKey: externalSelectedKey,
}: OCRDiffViewerProps) {
  const [internalSelectedKey, setInternalSelectedKey] = useState<string | null>(
    document.extractedFields[0]?.key || null
  );

  const activeKey = externalSelectedKey || internalSelectedKey;

  const handleFieldSelect = (field: ExtractedField) => {
    setInternalSelectedKey(field.key);
    if (onSelectFindingField) {
      onSelectFindingField(field.key);
    }
  };

  // Determine comparison status for each extracted field against institutional records
  const getComparisonStatus = (field: ExtractedField) => {
    if (!institution) return { status: 'unknown', text: 'No Institutional Record' };

    // Check specific fields
    if (field.key === 'institution_name') {
      const match = institution.name.toLowerCase().trim() === field.value.toLowerCase().trim();
      return {
        status: match ? 'match' : 'mismatch',
        recordVal: institution.name,
        label: match ? 'Exact Institutional Match' : 'Name Inconsistency Detected',
      };
    }

    if (field.key === 'institution_id' || field.key === 'aicte_permanent_id') {
      const match = institution.id === field.value || institution.code === field.value;
      return {
        status: match ? 'match' : 'mismatch',
        recordVal: institution.id,
        label: match ? 'ID Matched in Central Registry' : 'Identifier Collision / Discrepancy',
      };
    }

    if (field.key === 'approved_intake' || field.key === 'intake_capacity') {
      const numericVal = parseInt(field.value.replace(/[^0-9]/g, ''), 10);
      const match = numericVal === institution.approvedIntake;
      return {
        status: match ? 'match' : 'mismatch',
        recordVal: `${institution.approvedIntake} Seats`,
        label: match ? 'Seats Conform to Approved Quota' : 'Intake Discrepancy vs Approved Registry',
      };
    }

    if (field.key === 'faculty_count') {
      const count = parseInt(field.value.replace(/[^0-9]/g, ''), 10);
      const match = count === institution.facultyCount;
      return {
        status: match ? 'match' : 'mismatch',
        recordVal: `${institution.facultyCount} Registered Faculty`,
        label: match ? 'Roster Count Verified' : 'Faculty Count Deficit Flagged',
      };
    }

    if (field.key === 'ter_payment_status') {
      const match = field.value.toLowerCase().includes(institution.terPaymentStatus.toLowerCase());
      return {
        status: match ? 'match' : 'mismatch',
        recordVal: institution.terPaymentStatus,
        label: match ? 'Fee Settlement Verified' : 'Fee Status Conflict',
      };
    }

    // Default: if marked matchesRecord on the field
    if (field.matchesRecord === false) {
      return {
        status: 'mismatch',
        recordVal: field.recordValue || 'Discrepant with AICTE Baseline',
        label: 'Statutory Mismatch Flagged',
      };
    }

    return {
      status: 'match',
      recordVal: field.recordValue || field.value,
      label: 'Conforms to Documentary Standards',
    };
  };

  return (
    <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
      {/* Left 6 Columns: Document Preview with Bounding Boxes */}
      <div className="lg:col-span-6 h-[720px]">
        <DocumentPreview
          document={document}
          activeFieldKey={activeKey}
          onSelectField={handleFieldSelect}
        />
      </div>

      {/* Right 6 Columns: Institutional Record Comparison & Diff Analysis */}
      <div className="lg:col-span-6 flex flex-col h-[720px] gov-card rounded-xl border border-white/10 overflow-hidden bg-slate-950">
        {/* Header */}
        <div className="p-3 border-b border-white/10 bg-slate-900/90 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Database className="w-4 h-4 text-emerald-400" />
            <h4 className="text-xs font-bold text-white">
              Institutional Baseline Cross-Reference
            </h4>
          </div>
          <span className="text-[10px] px-2 py-0.5 rounded-full bg-emerald-500/10 text-emerald-400 border border-emerald-500/30 font-semibold">
            Registry Source: {institution ? institution.code : 'Central Registry'}
          </span>
        </div>

        {/* Legend */}
        <div className="px-4 py-2 border-b border-white/5 bg-slate-900/40 flex items-center gap-4 text-[11px]">
          <span className="flex items-center gap-1.5 text-emerald-400">
            <span className="w-2 h-2 rounded-full bg-emerald-400" />
            <span>Verified Agreement</span>
          </span>
          <span className="flex items-center gap-1.5 text-rose-400">
            <span className="w-2 h-2 rounded-full bg-rose-400" />
            <span>Discrepancy / Mismatch</span>
          </span>
          <span className="flex items-center gap-1.5 text-amber-400">
            <span className="w-2 h-2 rounded-full bg-amber-400" />
            <span>Uncertain / Scrutiny Needed</span>
          </span>
        </div>

        {/* Comparison List */}
        <div className="flex-1 overflow-y-auto p-4 space-y-3">
          {document.extractedFields.map((field) => {
            const comparison = getComparisonStatus(field);
            const isSelected = activeKey === field.key;

            const isMatch = comparison.status === 'match';
            const isMismatch = comparison.status === 'mismatch';

            return (
              <div
                key={field.key}
                onClick={() => handleFieldSelect(field)}
                className={`p-3.5 rounded-xl border cursor-pointer transition-all ${
                  isSelected
                    ? 'border-blue-500 bg-blue-950/30 ring-1 ring-blue-500/50 shadow-lg'
                    : isMismatch
                    ? 'border-rose-500/30 bg-rose-950/15 hover:border-rose-500/60'
                    : 'border-white/10 bg-slate-900/60 hover:border-white/20'
                }`}
              >
                <div className="flex items-start justify-between gap-2 mb-2">
                  <div>
                    <span className="text-xs font-bold text-white block">{field.label}</span>
                    <span className="text-[10.5px] text-slate-400 font-mono">Field Key: {field.key}</span>
                  </div>

                  <span
                    className={`px-2 py-0.5 rounded text-[10.5px] font-semibold border flex items-center gap-1 ${
                      isMismatch
                        ? 'bg-rose-500/10 text-rose-300 border-rose-500/30'
                        : isMatch
                        ? 'bg-emerald-500/10 text-emerald-300 border-emerald-500/30'
                        : 'bg-amber-500/10 text-amber-300 border-amber-500/30'
                    }`}
                  >
                    {isMismatch ? (
                      <AlertTriangle className="w-3 h-3 text-rose-400" />
                    ) : (
                      <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    )}
                    <span>{comparison.label}</span>
                  </span>
                </div>

                {/* Split Values Comparison */}
                <div className="grid grid-cols-2 gap-2 text-xs">
                  {/* Left: Submitted in Uploaded Document */}
                  <div className="p-2 rounded-lg bg-slate-950/70 border border-white/5 space-y-1">
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      OCR Extracted (Document)
                    </span>
                    <div className="font-mono font-semibold text-white break-words">
                      {field.value}
                    </div>
                    <div className="text-[10px] text-blue-400 font-mono">
                      Confidence: {(field.confidence * 100).toFixed(0)}%
                    </div>
                  </div>

                  {/* Right: Institutional Record in Database */}
                  <div
                    className={`p-2 rounded-lg border space-y-1 ${
                      isMismatch
                        ? 'bg-rose-950/30 border-rose-500/30 text-rose-200'
                        : 'bg-slate-950/70 border-white/5 text-slate-200'
                    }`}
                  >
                    <span className="text-[10px] uppercase font-bold text-slate-400 tracking-wider">
                      Official Institutional Record
                    </span>
                    <div className="font-mono font-semibold break-words">
                      {comparison.recordVal || 'No matching record'}
                    </div>
                    <div className="text-[10px] text-slate-400">
                      Source: AICTE Master DB
                    </div>
                  </div>
                </div>

                {/* If selected, show deep inspection banner */}
                {isSelected && (
                  <div className="mt-3 pt-2.5 border-t border-white/10 flex items-center justify-between text-[11px] text-slate-300">
                    <span className="text-blue-300 flex items-center gap-1">
                      <Sparkles className="w-3.5 h-3.5" />
                      Active field focused in Document Preview on the left
                    </span>
                    <span className="font-mono text-slate-500">
                      Page {field.page || 1} BBox Active
                    </span>
                  </div>
                )}
              </div>
            );
          })}
        </div>

        {/* Footer */}
        <div className="p-3 bg-slate-900/90 border-t border-white/10 text-xs text-slate-400 flex items-center justify-between">
          <span>Click any card to illuminate OCR coordinate bounding box</span>
          <span className="text-[11px] text-slate-500 font-medium">Deterministic Local Evaluation</span>
        </div>
      </div>
    </div>
  );
}
