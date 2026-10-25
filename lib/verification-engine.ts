// P.R.A.M.A.N. — Simulated Issuer Verification Engine
// Implements deterministic mock issuer adapters with retry recovery and manual routing.
// WARNING: Simulated prototype adapters only. No external services or authorities are contacted.

import {
  VerificationStatus,
  IssuerVerificationEvent,
} from './types';

export interface IssuerQueryRequest {
  documentId: string;
  documentName: string;
  issuerName: string;
  referenceNumber: string;
  currentStatus: VerificationStatus;
  retryCount: number;
}

export interface IssuerQueryResult {
  status: VerificationStatus;
  source: string;
  timestamp: string;
  message: string;
  referenceNumber: string;
  retryCount: number;
  canRetry: boolean;
  statusChanged: boolean;
}

/**
 * Deterministic simulator for issuer registry queries.
 * Handles the special case of DOC-103-01 (Bhoomi Land Registry), which recovers on retry.
 */
export function queryIssuerService(request: IssuerQueryRequest): IssuerQueryResult {
  const now = new Date().toISOString();
  const nextRetry = request.retryCount + 1;

  // Case 1: Specific simulated recovery case for DOC-103-01 (Land Registry Bhoomi)
  if (request.documentId === 'DOC-103-01' || request.referenceNumber.includes('BHM-RTC')) {
    // If it was source_unavailable and retried, it successfully connects!
    return {
      status: 'verified',
      source: 'Karnataka Bhoomi Land Registry Service (Simulated)',
      timestamp: now,
      message: 'Connection re-established with Bhoomi server on retry. RTC record authenticated for Sy. No. 142/2B; title confirmed.',
      referenceNumber: request.referenceNumber,
      retryCount: nextRetry,
      canRetry: false,
      statusChanged: true,
    };
  }

  // Case 2: Mismatch cases remain mismatched with updated timestamp
  if (request.currentStatus === 'mismatch_detected') {
    return {
      status: 'mismatch_detected',
      source: `${request.issuerName} Portal (Simulated)`,
      timestamp: now,
      message: `Registry re-queried. Discrepancy confirmed: Record parameters do not match council submission. Manual scrutiny required.`,
      referenceNumber: request.referenceNumber,
      retryCount: nextRetry,
      canRetry: false,
      statusChanged: false,
    };
  }

  // Case 3: Expired certificates remain expired
  if (request.currentStatus === 'expired') {
    return {
      status: 'expired',
      source: `${request.issuerName} Clearance Portal (Simulated)`,
      timestamp: now,
      message: `Re-query confirms: Statutory clearance expired prior to the required 2026-06-30 threshold.`,
      referenceNumber: request.referenceNumber,
      retryCount: nextRetry,
      canRetry: false,
      statusChanged: false,
    };
  }

  // Case 4: Verification pending resolves to verified
  if (request.currentStatus === 'verification_pending') {
    return {
      status: 'verified',
      source: `${request.issuerName} Registry (Simulated)`,
      timestamp: now,
      message: `Verification token received. Document reference ${request.referenceNumber} authenticated against authorized digital ledger.`,
      referenceNumber: request.referenceNumber,
      retryCount: nextRetry,
      canRetry: false,
      statusChanged: true,
    };
  }

  // Default case
  return {
    status: request.currentStatus,
    source: `${request.issuerName} (Simulated)`,
    timestamp: now,
    message: `Simulated check completed for reference ${request.referenceNumber}.`,
    referenceNumber: request.referenceNumber,
    retryCount: nextRetry,
    canRetry: false,
    statusChanged: false,
  };
}

/**
 * Routes an inconclusive or mismatched document to manual scrutiny
 */
export function routeToManualConfirmation(
  event: IssuerVerificationEvent,
  officerNote?: string
): IssuerVerificationEvent {
  return {
    ...event,
    status: 'manual_review_required',
    timestamp: new Date().toISOString(),
    message: `Routed to manual scrutiny by officer. Reason: ${
      officerNote || 'Statutory physical document verification required.'
    }`,
    canRetry: false,
  };
}
