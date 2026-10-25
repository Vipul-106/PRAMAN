// P.R.A.M.A.N. — Advisory Document Anomaly Engine
// Provides explainable anomaly signals for officer verification.
// CRITICAL SAFEGUARD: Signals are preliminary indicators requiring human verification, NEVER proof of forgery.

import { DocumentAnomaly, DocumentRecord, BoundingBox } from './types';

export interface AnomalyReportItem {
  anomalyId: string;
  documentId: string;
  documentName: string;
  type: DocumentAnomaly['type'];
  severity: DocumentAnomaly['severity'];
  title: string;
  description: string;
  region?: BoundingBox;
  advisoryNote: string;
  evidenceSummary: string;
}

/**
 * Evaluates a document for potential visual, structural, or metadata anomalies.
 * Note: Operates on synthetic document properties in this prototype.
 */
export function inspectDocumentAnomalies(doc: DocumentRecord): AnomalyReportItem[] {
  const reports: AnomalyReportItem[] = [];

  // 1. Metadata edit-trace check
  if (doc.metadata?.hasEditTraces) {
    reports.push({
      anomalyId: `ANOM-REP-${doc.id}-EDIT`,
      documentId: doc.id,
      documentName: doc.name,
      type: 'metadata_edit',
      severity: 'critical',
      title: 'Potential Metadata / Producer Anomaly',
      description: 'Potential anomaly — requires human verification. PDF producer attributes indicate desktop publishing or photo editing software was used on the file.',
      advisoryNote: 'Advisory finding: Request certified copy directly from the issuing authority or original hardcopy.',
      evidenceSummary: `Creator: ${doc.metadata.creator || 'Unknown'} | Producer: ${doc.metadata.producer || 'Unknown'}`,
      region: { x: 0.1, y: 0.1, width: 0.8, height: 0.1 },
    });
  }

  // 2. Pre-seeded ELA / localized compression regions
  for (const anom of doc.anomalies) {
    if (anom.type === 'ela_heatmap') {
      reports.push({
        anomalyId: anom.id,
        documentId: doc.id,
        documentName: doc.name,
        type: 'ela_heatmap',
        severity: anom.severity,
        title: anom.title,
        description: 'Potential anomaly — requires human verification. Localized error-level analysis indicates compression gradient inconsistency.',
        advisoryNote: 'Advisory finding: Inspect numerals and surrounding stamp background closely with optical magnification.',
        evidenceSummary: 'High-frequency error-level delta exceeding 32% relative threshold.',
        region: anom.region,
      });
    } else if (anom.type === 'cross_reuse') {
      reports.push({
        anomalyId: anom.id,
        documentId: doc.id,
        documentName: doc.name,
        type: 'cross_reuse',
        severity: anom.severity,
        title: anom.title,
        description: 'Potential anomaly — requires human verification. Cryptographic fingerprint matches another submission in the database.',
        advisoryNote: 'Advisory finding: Cross-institutional comparison required before drawing any regulatory conclusion.',
        evidenceSummary: `Fingerprint collision: ${doc.metadata?.fingerprint || 'fp_duplicate_collision'}`,
        region: anom.region,
      });
    } else if (anom.type === 'date_anomaly') {
      reports.push({
        anomalyId: anom.id,
        documentId: doc.id,
        documentName: doc.name,
        type: 'date_anomaly',
        severity: anom.severity,
        title: anom.title,
        description: 'Potential anomaly — requires human verification. Certificate issuance or expiry dates conflict with required academic calendar.',
        advisoryNote: 'Advisory finding: Check with state issuing authority whether renewal order is pending dispatch.',
        evidenceSummary: `Extracted date: ${doc.expiryDate || 'N/A'} conflicts with 2026-06-30 minimum threshold.`,
        region: anom.region,
      });
    }
  }

  return reports;
}
