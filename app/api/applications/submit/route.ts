// P.R.A.M.A.N. — Application Submission API Route
// Integration-style endpoint for external systems / university ERP integration simulation.
// NOTE: Synthetic demo adapter. No production authentication or external services contacted.

import { NextRequest, NextResponse } from 'next/server';
import { getInstitutionById, mockDatabase } from '@/lib/mock-data';
import { ApplicationCategory, ApplicationRecord, DocumentRecord } from '@/lib/types';
import { getCategoryChecklist, validateApplication } from '@/lib/validation-engine';

const SUPPORTED_CATEGORIES: ApplicationCategory[] = [
  'EoA',
  'New Programme',
  'Intake Change',
  'Institutional Change',
];

interface IncomingSubmissionPayload {
  referenceNumber?: string;
  institutionId?: string;
  category?: ApplicationCategory;
  requestedIntake?: number;
  previousApprovedIntake?: number;
  terPaymentStatus?: 'Paid' | 'Unpaid' | 'Partial' | 'Exempt';
  documents?: Array<{
    type: string;
    fileName?: string;
    referenceNumber?: string;
    expiryDate?: string | null;
  }>;
}

export async function GET() {
  return NextResponse.json({
    name: 'P.R.A.M.A.N. Intake & Validation API',
    version: '1.0.0-prototype',
    dataMode: 'SYNTHETIC DEMO DATA',
    endpoint: 'POST /api/applications/submit',
    documentation: 'Simulates institutional submission and returns immediate statutory checklist & explainable findings.',
    supportedCategories: SUPPORTED_CATEGORIES,
    examplePayload: {
      referenceNumber: 'AICTE/NR/2026/DEMO-9901',
      institutionId: 'SYN-INST-101',
      category: 'EoA',
      documents: [
        {
          type: 'fire_safety_certificate',
          fileName: 'fire_noc_2026.pdf',
          referenceNumber: 'UPFS/2026/9901',
          expiryDate: '2028-06-30',
        },
      ],
    },
  });
}

export async function POST(request: NextRequest) {
  let body: IncomingSubmissionPayload;

  // 1. Safe JSON parsing with size / syntax guard
  try {
    body = await request.json();
  } catch {
    return NextResponse.json(
      {
        success: false,
        dataMode: 'SYNTHETIC DEMO DATA',
        error: 'Malformed JSON payload. Ensure headers include Content-Type: application/json and request body is valid JSON.',
      },
      { status: 400 }
    );
  }

  // 2. Validate required fields
  const { referenceNumber, institutionId, category } = body;

  if (!referenceNumber || typeof referenceNumber !== 'string' || referenceNumber.trim() === '') {
    return NextResponse.json(
      {
        success: false,
        dataMode: 'SYNTHETIC DEMO DATA',
        error: "Missing required parameter: 'referenceNumber' must be a non-empty string.",
      },
      { status: 422 }
    );
  }

  if (!institutionId || typeof institutionId !== 'string' || institutionId.trim() === '') {
    return NextResponse.json(
      {
        success: false,
        dataMode: 'SYNTHETIC DEMO DATA',
        error: "Missing required parameter: 'institutionId' must be provided.",
      },
      { status: 422 }
    );
  }

  if (!category || !SUPPORTED_CATEGORIES.includes(category)) {
    return NextResponse.json(
      {
        success: false,
        dataMode: 'SYNTHETIC DEMO DATA',
        error: `Unsupported application category '${category}'. Supported categories are: ${SUPPORTED_CATEGORIES.join(
          ', '
        )}`,
      },
      { status: 422 }
    );
  }

  // 3. Match against synthetic institutional records
  const inst = getInstitutionById(institutionId);
  if (!inst) {
    return NextResponse.json(
      {
        success: false,
        dataMode: 'SYNTHETIC DEMO DATA',
        error: `Institution ID '${institutionId}' not found in synthetic institutional database. Available demo IDs: SYN-INST-101 to SYN-INST-108.`,
      },
      { status: 404 }
    );
  }

  // 4. Construct synthetic application document records
  const rawDocs = body.documents || [];
  const transformedDocs: DocumentRecord[] = rawDocs.map((d, index) => ({
    id: `DOC-SUB-${index + 1}`,
    name: d.fileName || `Document ${index + 1}`,
    type: d.type,
    required: true,
    uploaded: true,
    expiryDate: d.expiryDate || null,
    issuer: 'Declared Issuing Authority',
    verificationStatus: 'verification_pending',
    fileName: d.fileName || `doc_${index + 1}.pdf`,
    pageCount: 1,
    confidence: 0.95,
    extractedFields: [],
    anomalies: [],
  }));

  const synthApp: ApplicationRecord = {
    id: `APP-SUB-${Date.now().toString().slice(-4)}`,
    referenceNumber: referenceNumber.trim(),
    institutionId: inst.id,
    institutionName: inst.name,
    region: inst.region,
    category,
    submittedAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    status: 'Ready for review',
    priorityScore: 25,
    priorityBreakdown: {
      baseScore: 25,
      factors: [
        {
          factor: 'New API submission intake',
          weight: 25,
          contribution: 25,
          explanation: 'Initial triage score assigned upon automated intake verification.',
        },
      ],
      totalScore: 25,
    },
    programmes: inst.programmes,
    requestedIntake: body.requestedIntake || inst.approvedIntake,
    previousApprovedIntake: body.previousApprovedIntake || inst.approvedIntake,
    terPaymentStatus: body.terPaymentStatus || inst.terPaymentStatus,
    documents: transformedDocs,
    findings: [],
    verificationEvents: [],
    infrastructure: [],
    actions: [],
  };

  // 5. Run validation engine
  const checklist = getCategoryChecklist(category);
  const uploadedTypeSet = new Set(transformedDocs.map((d) => d.type));
  const missing = checklist.requiredDocumentTypes.filter((t) => !uploadedTypeSet.has(t));
  const received = checklist.requiredDocumentTypes.filter((t) => uploadedTypeSet.has(t));

  const findings = validateApplication(synthApp);

  const verificationSummary = {
    verified: 0,
    pending: transformedDocs.length,
    manualReviewRequired: 0,
  };

  return NextResponse.json(
    {
      success: true,
      dataMode: 'SYNTHETIC DEMO DATA',
      applicationId: synthApp.id,
      referenceNumber: synthApp.referenceNumber,
      institution: {
        id: inst.id,
        name: inst.name,
        code: inst.code,
        region: inst.region,
        state: inst.state,
      },
      checklist: {
        required: checklist.requiredDocumentTypes,
        received,
        missing,
      },
      findings,
      verificationSummary,
      message:
        'Synthetic validation completed. All AI-assisted findings are advisory and require human officer scrutiny.',
    },
    { status: 200 }
  );
}
