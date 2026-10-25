// P.R.A.M.A.N. — Platform for Regulatory Approval, Monitoring & Authentication Network
// Core Domain Types (SIH 2026 AICTE Decision-Support Prototype)

export type ApplicationCategory =
  | 'EoA'
  | 'New Programme'
  | 'Intake Change'
  | 'Institutional Change';

export type VerificationStatus =
  | 'verified'
  | 'mismatch_detected'
  | 'expired'
  | 'verification_pending'
  | 'source_unavailable'
  | 'manual_review_required';

export type Severity = 'critical' | 'high' | 'medium' | 'low' | 'info';

export type OfficerRole = 'Officer' | 'Reviewer' | 'Administrator';

export type OfficerActionType =
  | 'acknowledge'
  | 'dismiss'
  | 'clarification'
  | 'escalate';

export type ApplicationWorkflowStatus =
  | 'Ready for review'
  | 'Action required'
  | 'Verification pending'
  | 'Escalated'
  | 'In review'
  | 'Clarification requested';

export interface BoundingBox {
  x: number; // 0 to 1 normalized
  y: number;
  width: number;
  height: number;
}

export interface ExtractedField {
  key: string;
  label: string;
  value: string;
  confidence: number; // 0.0 to 1.0
  page: number;
  bbox: BoundingBox;
  sourceText?: string;
  matchesRecord?: boolean;
  recordValue?: string;
}

export interface DocumentAnomaly {
  id: string;
  type: 'metadata_edit' | 'ela_heatmap' | 'cross_reuse' | 'date_anomaly' | 'identifier_mismatch';
  severity: Severity;
  title: string;
  description: string;
  region?: BoundingBox;
  details?: Record<string, string | number | boolean>;
}

export interface DocumentRecord {
  id: string;
  name: string;
  type: string;
  required: boolean;
  uploaded: boolean;
  expiryDate: string | null;
  issuer: string;
  verificationStatus: VerificationStatus;
  fileName: string;
  fileSizeKb?: number;
  pageCount: number;
  confidence: number;
  extractedFields: ExtractedField[];
  metadata?: {
    creator?: string;
    producer?: string;
    modificationDate?: string;
    creationDate?: string;
    hasEditTraces?: boolean;
    digitalSignatureValid?: boolean;
    fingerprint?: string;
  };
  anomalies: DocumentAnomaly[];
}

export interface ValidationFindingEvidence {
  documentId: string;
  documentName: string;
  page?: number;
  bbox?: BoundingBox;
  field?: string;
}

export interface ValidationFinding {
  id: string;
  ruleId: string;
  severity: Severity;
  title: string;
  reason: string;
  field: string;
  submittedValue: string;
  recordValue: string;
  evidence: ValidationFindingEvidence;
  recommendation: string;
  wouldClearIf: string;
  status: 'active' | 'acknowledged' | 'dismissed' | 'clarification_requested';
  dismissReason?: string;
  officerNote?: string;
}

export interface ValidationRule {
  id: string;
  title: string;
  category: 'document_presence' | 'identifier_match' | 'intake_compliance' | 'date_validity' | 'payment_status' | 'infrastructure' | 'cross_institution_reuse';
  enabled: boolean;
  severity: Severity;
  description: string;
  field: string;
  condition: string;
  explanation: string;
  configurableThreshold?: number | string;
}

export interface ProgrammeRecord {
  name: string;
  level: 'UG' | 'PG' | 'Diploma';
  currentApprovedIntake: number;
  requestedIntake: number;
  accreditationStatus: 'Accredited' | 'Eligible' | 'Not Accredited';
  nbaAccreditationExpiry?: string;
}

export interface InstitutionRecord {
  id: string;
  name: string;
  code: string;
  region: 'Northern' | 'North-West' | 'Western' | 'Central' | 'Eastern' | 'Southern' | 'South-West';
  state: string;
  type: 'Government' | 'Govt-Aided' | 'Private-Self-Financing' | 'University Managed';
  approvedIntake: number;
  programmes: ProgrammeRecord[];
  facultyCount: number;
  facultyStudentRatio: string;
  terPaymentStatus: 'Paid' | 'Unpaid' | 'Partial' | 'Exempt';
  complianceStatus: 'Compliant' | 'Deficiency Indicated' | 'Action Pending';
  deficienciesCount: number;
  landAreaAcres: number;
  builtUpAreaSqM: number;
  lastInspectionDate: string;
  trustOrSocietyName: string;
}

export interface IssuerVerificationEvent {
  id: string;
  documentId: string;
  documentName: string;
  source: string;
  timestamp: string;
  status: VerificationStatus;
  message: string;
  referenceNumber: string;
  retryCount: number;
  canRetry: boolean;
  rawDetails?: Record<string, string | number | boolean>;
}

export interface InfrastructureFinding {
  id: string;
  applicationId: string;
  evidenceType: 'photograph' | 'video' | 'floor_plan' | 'land_certificate';
  title: string;
  fileName: string;
  timestamp: string;
  location: string;
  hasGps: boolean;
  declaredValue: string;
  measuredValue: string;
  threshold: string;
  result: 'Pass' | 'Attention' | 'Mismatch';
  reason: string;
  advisoryOutcome: 'No discrepancy indicated' | 'Needs additional evidence' | 'Recommend inspection';
}

export interface PriorityFactor {
  factor: string;
  weight: number;
  contribution: number;
  explanation: string;
}

export interface PriorityBreakdown {
  baseScore: number;
  factors: PriorityFactor[];
  totalScore: number;
}

export interface OfficerActionRecord {
  id: string;
  timestamp: string;
  officerRole: OfficerRole;
  officerName: string;
  actionType: OfficerActionType;
  targetId: string; // finding id, alert id, or application id
  targetType: 'finding' | 'alert' | 'application';
  reason?: string;
  note?: string;
}

export interface ApplicationRecord {
  id: string;
  referenceNumber: string;
  institutionId: string;
  institutionName: string;
  region: string;
  category: ApplicationCategory;
  submittedAt: string;
  updatedAt: string;
  status: ApplicationWorkflowStatus;
  priorityScore: number;
  priorityBreakdown: PriorityBreakdown;
  programmes: ProgrammeRecord[];
  requestedIntake: number;
  previousApprovedIntake: number;
  terPaymentStatus: 'Paid' | 'Unpaid' | 'Partial' | 'Exempt';
  documents: DocumentRecord[];
  findings: ValidationFinding[];
  verificationEvents: IssuerVerificationEvent[];
  infrastructure: InfrastructureFinding[];
  actions: OfficerActionRecord[];
}

export interface SystemAlert {
  id: string;
  applicationId: string;
  applicationRef: string;
  institutionName: string;
  type: 'missing_doc' | 'expired_doc' | 'unavailable_source' | 'potential_anomaly' | 'infrastructure_gap';
  severity: Severity;
  title: string;
  message: string;
  timestamp: string;
  dismissed: boolean;
}

export interface BenchmarkMetrics {
  extractionAccuracyPct: number;
  validationAccuracyPct: number;
  anomalyPrecisionPct: number;
  anomalyRecallPct: number;
  issuerSuccessRatePct: number;
  avgVerificationTimeMs: number;
  alertLatencyMs: number;
  manualEffortReductionPct: number;
  sampleSize: number;
  testFixtureCount: number;
  methodologyNote: string;
  lastRunTimestamp: string;
  categoryBreakdown: {
    category: ApplicationCategory;
    accuracy: number;
    casesTested: number;
    avgLatencyMs: number;
  }[];
}

export interface AuditEvent {
  id: string;
  timestamp: string;
  actorRole: OfficerRole;
  actorName: string;
  action: string;
  applicationId: string;
  details: string;
  ruleIds: string[];
  sourceReferences: string[];
  previousHash: string;
  eventHash: string;
}

export interface MockDatabase {
  dataMode: string;
  generatedAt: string;
  applications: ApplicationRecord[];
  institutions: InstitutionRecord[];
  documentTypes: { id: string; name: string; requiredCategories: ApplicationCategory[] }[];
  rules: ValidationRule[];
  alerts: SystemAlert[];
  benchmark: BenchmarkMetrics;
  auditEvents: AuditEvent[];
  infrastructureChecks: InfrastructureFinding[];
}
