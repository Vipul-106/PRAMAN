'use client';

import React, { useState, useRef } from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { Alert, AlertDescription, AlertTitle } from '@/components/ui/alert';
import { ApplicationCategory } from '@/lib/types';
import { Upload, FileText, CheckCircle2, AlertTriangle, ArrowRight, Eye, RefreshCw, Layers } from 'lucide-react';

interface SimulatedDoc {
  id: string;
  name: string;
  type: string;
  size: string;
  status: 'Classified' | 'Extracted' | 'Validated' | 'Processing';
  confidence: number;
  extractedFields: { key: string; label: string; value: string; confidence: number }[];
}

const CATEGORY_CHECKLISTS: Record<ApplicationCategory, { name: string; required: boolean }[]> = {
  'EoA': [
    { name: 'Fire Safety NOC Certificate', required: true },
    { name: 'Building Safety Certificate', required: true },
    { name: 'Land & Occupancy Certificate', required: true },
    { name: 'Faculty & Salary Affidavit', required: true },
    { name: 'TER Fee Payment Proof', required: true },
  ],
  'New Programme': [
    { name: 'Institutional Profile & Declaration', required: true },
    { name: 'Building Occupancy Certificate', required: true },
    { name: 'AICTE Approval / University Affiliation', required: true },
    { name: 'Detailed Project Report (DPR)', required: true },
    { name: 'Land Conversion Certificate', required: true },
    { name: 'Fire & Environmental Safety Clearances', required: true },
    { name: 'Fund Allocation & Financial Audit', required: true },
    { name: 'Laboratory & Infrastructure Masterplan', required: true },
  ],
  'Intake Change': [
    { name: 'Existing EoA Approval Letter', required: true },
    { name: 'Cadre Ratio & Faculty Readiness Sheet', required: true },
    { name: 'Built-up Area Infrastructure Proof', required: true },
    { name: 'Laboratory Equipment Readiness Return', required: true },
  ],
  'Institutional Change': [
    { name: 'Trust/Society Resolution Document', required: true },
    { name: 'No Objection Certificate (State Govt)', required: true },
    { name: 'University NOC / Affiliation Copy', required: true },
    { name: 'Land Ownership / Lease Transfer Deed', required: true },
  ]
};

const SAMPLE_DOCS: SimulatedDoc[] = [
  {
    id: 'sdoc-1',
    name: 'fire_noc_clearance_2026.pdf',
    type: 'Fire Safety Certificate',
    size: '1.8 MB',
    status: 'Validated',
    confidence: 0.96,
    extractedFields: [
      { key: 'cert_no', label: 'Certificate Number', value: 'FSC-MH-2026-8801', confidence: 0.98 },
      { key: 'issuer', label: 'Issuing Authority', value: 'State Fire Services Directorate', confidence: 0.95 },
      { key: 'expiry_date', label: 'Expiry Date', value: '31-Dec-2027', confidence: 0.97 },
      { key: 'building_name', label: 'Premises Approved', value: 'Block A & B Main Campus', confidence: 0.94 },
    ]
  },
  {
    id: 'sdoc-2',
    name: 'land_revenue_extract_712.pdf',
    type: 'Land Conversion Certificate',
    size: '3.4 MB',
    status: 'Extracted',
    confidence: 0.91,
    extractedFields: [
      { key: 'survey_no', label: 'Survey / Gat Number', value: 'Gat No. 142/1A', confidence: 0.93 },
      { key: 'area_acres', label: 'Total Area (Acres)', value: '10.5 Acres', confidence: 0.90 },
      { key: 'land_use', label: 'Approved Usage', value: 'Educational / Non-Agricultural', confidence: 0.92 },
    ]
  },
  {
    id: 'sdoc-3',
    name: 'building_safety_certificate.pdf',
    type: 'Building Safety Certificate',
    size: '2.1 MB',
    status: 'Validated',
    confidence: 0.94,
    extractedFields: [
      { key: 'engineer_reg', label: 'Structural Engineer Reg.', value: 'SE-PUNE-4409', confidence: 0.96 },
      { key: 'valid_until', label: 'Validity Period', value: '31-Mar-2028', confidence: 0.92 },
    ]
  }
];

export default function IntakePage() {
  const [selectedCategory, setSelectedCategory] = useState<ApplicationCategory>('New Programme');
  const [uploadedFiles, setUploadedFiles] = useState<SimulatedDoc[]>([]);
  const [selectedDoc, setSelectedDoc] = useState<SimulatedDoc | null>(null);
  const [isProcessing, setIsProcessing] = useState(false);
  const [dragActive, setDragActive] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const checklist = CATEGORY_CHECKLISTS[selectedCategory] || [];

  const handleLoadSamplePack = () => {
    setIsProcessing(true);
    setTimeout(() => {
      setUploadedFiles(SAMPLE_DOCS);
      setSelectedDoc(SAMPLE_DOCS[0]);
      setIsProcessing(false);
    }, 600);
  };

  const handleFileUpload = (files: FileList | null) => {
    if (!files || files.length === 0) return;
    setIsProcessing(true);

    const newDocs: SimulatedDoc[] = Array.from(files).map((file, idx) => ({
      id: `custom-${Date.now()}-${idx}`,
      name: file.name,
      type: file.name.toLowerCase().includes('fire') ? 'Fire Safety Certificate' : 'Statutory Document',
      size: `${(file.size / (1024 * 1024)).toFixed(1)} MB`,
      status: 'Validated',
      confidence: 0.92,
      extractedFields: [
        { key: 'doc_name', label: 'Document Name', value: file.name, confidence: 0.99 },
        { key: 'file_size', label: 'File Size', value: `${(file.size / 1024).toFixed(0)} KB`, confidence: 1.0 },
        { key: 'extracted_at', label: 'Extraction Timestamp', value: new Date().toLocaleTimeString(), confidence: 0.95 },
      ]
    }));

    setTimeout(() => {
      setUploadedFiles((prev) => [...newDocs, ...prev]);
      if (!selectedDoc) setSelectedDoc(newDocs[0]);
      setIsProcessing(false);
    }, 700);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setDragActive(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      handleFileUpload(e.dataTransfer.files);
    }
  };

  return (
    <AppShell>
      <div className="p-6 space-y-6">
        <PageHeader
          title="Smart Document Intake & OCR Pipeline"
          subtitle="Category-based checklist generation, simulated document classification, OCR field extraction with confidence scores, and rectification."
        />

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          {/* Category & Checklist Panel */}
          <div className="lg:col-span-4 space-y-6">
            <Card className="bg-slate-900 border-slate-800 text-slate-100">
              <CardHeader className="pb-3">
                <CardTitle className="text-base font-semibold flex items-center gap-2">
                  <Layers className="h-4 w-4 text-blue-400" />
                  Select Approval Category
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-2">
                {(['EoA', 'New Programme', 'Intake Change', 'Institutional Change'] as ApplicationCategory[]).map((cat) => (
                  <button
                    key={cat}
                    onClick={() => setSelectedCategory(cat)}
                    className={`w-full text-left px-4 py-3 rounded-lg border transition-all flex items-center justify-between ${
                      selectedCategory === cat
                        ? 'bg-blue-950/60 border-blue-500 text-blue-100 font-medium'
                        : 'bg-slate-950/40 border-slate-800 text-slate-400 hover:border-slate-700 hover:text-slate-200'
                    }`}
                  >
                    <span>{cat}</span>
                    {selectedCategory === cat && <CheckCircle2 className="h-4 w-4 text-blue-400" />}
                  </button>
                ))}
              </CardContent>
            </Card>

            <Card className="bg-slate-900 border-slate-800 text-slate-100">
              <CardHeader className="pb-3">
                <div className="flex items-center justify-between">
                  <CardTitle className="text-base font-semibold">Mandatory Statutory Checklist</CardTitle>
                  <Badge variant="outline" className="border-blue-500/40 text-blue-400 bg-blue-950/40">
                    {checklist.length} Required
                  </Badge>
                </div>
                <CardDescription className="text-xs text-slate-400">
                  Generated dynamically for {selectedCategory} under APH 2026-27 norms.
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2 max-h-72 overflow-y-auto pr-1">
                  {checklist.map((item, i) => {
                    const isMatched = uploadedFiles.some((f) => f.type.toLowerCase().includes(item.name.toLowerCase().slice(0, 8)));
                    return (
                      <div
                        key={i}
                        className="p-2.5 rounded-md bg-slate-950/50 border border-slate-800 flex items-center gap-3 text-xs"
                      >
                        <FileText className={`h-4 w-4 shrink-0 ${isMatched ? 'text-emerald-400' : 'text-slate-500'}`} />
                        <span className={`flex-1 ${isMatched ? 'text-slate-200 font-medium' : 'text-slate-400'}`}>
                          {item.name}
                        </span>
                        {isMatched ? (
                          <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] px-1.5 py-0">
                            Uploaded
                          </Badge>
                        ) : (
                          <Badge variant="outline" className="border-slate-700 text-slate-500 text-[10px] px-1.5 py-0">
                            Pending
                          </Badge>
                        )}
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Upload & Extraction Pipeline */}
          <div className="lg:col-span-8 space-y-6">
            <Card className="bg-slate-900 border-slate-800 text-slate-100">
              <CardHeader className="flex flex-row items-center justify-between pb-3">
                <div>
                  <CardTitle className="text-base font-semibold">Document Intake & Extraction</CardTitle>
                  <CardDescription className="text-xs text-slate-400">
                    Local in-memory file simulation. OCR field extraction and confidence parsing.
                  </CardDescription>
                </div>
                <Button
                  onClick={handleLoadSamplePack}
                  disabled={isProcessing}
                  size="sm"
                  className="bg-blue-600 hover:bg-blue-500 text-white font-medium text-xs gap-2"
                >
                  {isProcessing ? <RefreshCw className="h-3.5 w-3.5 animate-spin" /> : <Upload className="h-3.5 w-3.5" />}
                  Load Sample Pack
                </Button>
              </CardHeader>
              <CardContent className="space-y-4">
                {/* Drag and Drop Zone */}
                <input
                  type="file"
                  ref={fileInputRef}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  multiple
                  className="hidden"
                  accept=".pdf,.jpg,.jpeg,.png"
                />

                <div
                  onDragOver={(e) => { e.preventDefault(); setDragActive(true); }}
                  onDragLeave={() => setDragActive(false)}
                  onDrop={handleDrop}
                  onClick={() => fileInputRef.current?.click()}
                  className={`border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all ${
                    dragActive
                      ? 'border-blue-500 bg-blue-950/30'
                      : 'border-slate-800 bg-slate-950/40 hover:border-slate-700 hover:bg-slate-950/70'
                  }`}
                >
                  <div className="p-3 bg-slate-900 rounded-full w-fit mx-auto mb-3 border border-slate-800">
                    <Upload className="h-6 w-6 text-blue-400" />
                  </div>
                  <p className="text-sm font-medium text-slate-200">
                    Drop statutory PDF documents or photographs here
                  </p>
                  <p className="text-xs text-slate-500 mt-1">
                    Accepts PDF, JPG, PNG up to 10MB per file (Client-side simulation) or click to browse
                  </p>
                </div>

                {/* Pipeline Stages */}
                <div className="grid grid-cols-4 gap-3 pt-2 text-center text-xs">
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <p className="text-slate-400 font-medium">1. Received</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">MIME validation</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <p className="text-slate-400 font-medium">2. Classified</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Type matching</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <p className="text-slate-400 font-medium">3. Extracted</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Field bounding</p>
                  </div>
                  <div className="p-2.5 rounded-lg bg-slate-950/60 border border-slate-800">
                    <p className="text-slate-400 font-medium">4. Validated</p>
                    <p className="text-[10px] text-slate-500 mt-0.5">Rule comparison</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Uploaded Documents List & OCR Drawer */}
            {uploadedFiles.length > 0 && (
              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                {/* File list */}
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                  <CardHeader className="pb-3">
                    <CardTitle className="text-sm font-semibold">Processed Documents ({uploadedFiles.length})</CardTitle>
                  </CardHeader>
                  <CardContent className="space-y-2">
                    {uploadedFiles.map((doc) => (
                      <div
                        key={doc.id}
                        onClick={() => setSelectedDoc(doc)}
                        className={`p-3 rounded-lg border cursor-pointer transition-all flex items-center justify-between ${
                          selectedDoc?.id === doc.id
                            ? 'bg-blue-950/50 border-blue-500'
                            : 'bg-slate-950/40 border-slate-800 hover:border-slate-700'
                        }`}
                      >
                        <div className="space-y-1 overflow-hidden pr-2">
                          <p className="text-xs font-medium text-slate-200 truncate">{doc.name}</p>
                          <div className="flex items-center gap-2 text-[10px] text-slate-400">
                            <span>{doc.type}</span>
                            <span>•</span>
                            <span>{doc.size}</span>
                          </div>
                        </div>
                        <Badge className="bg-emerald-500/10 text-emerald-400 border-emerald-500/30 text-[10px] shrink-0">
                          {(doc.confidence * 100).toFixed(0)}% OCR
                        </Badge>
                      </div>
                    ))}
                  </CardContent>
                </Card>

                {/* Extracted Fields Drawer */}
                <Card className="bg-slate-900 border-slate-800 text-slate-100">
                  <CardHeader className="pb-3 flex flex-row items-center justify-between">
                    <div>
                      <CardTitle className="text-sm font-semibold">Extracted Key Fields</CardTitle>
                      <CardDescription className="text-[11px] text-slate-400">
                        {selectedDoc ? selectedDoc.type : 'Select a document'}
                      </CardDescription>
                    </div>
                    {selectedDoc && (
                      <Badge variant="outline" className="border-blue-500/30 text-blue-400 text-[10px]">
                        Confidence: {(selectedDoc.confidence * 100).toFixed(0)}%
                      </Badge>
                    )}
                  </CardHeader>
                  <CardContent className="space-y-3">
                    {selectedDoc ? (
                      selectedDoc.extractedFields.map((field, idx) => (
                        <div key={idx} className="p-2.5 rounded bg-slate-950/60 border border-slate-800 space-y-1">
                          <div className="flex justify-between text-[11px]">
                            <span className="text-slate-400">{field.label}</span>
                            <span className="text-blue-400">{(field.confidence * 100).toFixed(0)}% conf</span>
                          </div>
                          <p className="text-xs font-mono text-slate-200 font-semibold">{field.value}</p>
                        </div>
                      ))
                    ) : (
                      <div className="p-6 text-center text-xs text-slate-500">
                        Click on any processed document to inspect extracted fields.
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </AppShell>
  );
}