// P.R.A.M.A.N. — Mock Data Accessor & Query Helpers
import mockDataRaw from '@/data/mockData.json';
import {
  MockDatabase,
  ApplicationRecord,
  InstitutionRecord,
  ValidationRule,
  SystemAlert,
  BenchmarkMetrics,
  AuditEvent,
  InfrastructureFinding,
  ApplicationCategory,
  VerificationStatus,
} from './types';

export const mockDatabase: MockDatabase = mockDataRaw as unknown as MockDatabase;

/**
 * Returns all applications with optional filtering
 */
export function getApplications(filters?: {
  status?: string;
  category?: ApplicationCategory;
  search?: string;
  minPriority?: number;
}): ApplicationRecord[] {
  let apps = [...mockDatabase.applications];

  if (!filters) return apps;

  if (filters.category && filters.category !== ('ALL' as unknown as ApplicationCategory)) {
    apps = apps.filter((a) => a.category === filters.category);
  }

  if (filters.status && filters.status !== 'ALL') {
    apps = apps.filter((a) => a.status === filters.status);
  }

  if (filters.search) {
    const q = filters.search.toLowerCase();
    apps = apps.filter(
      (a) =>
        a.referenceNumber.toLowerCase().includes(q) ||
        a.institutionName.toLowerCase().includes(q) ||
        a.institutionId.toLowerCase().includes(q) ||
        a.region.toLowerCase().includes(q)
    );
  }

  if (typeof filters.minPriority === 'number') {
    apps = apps.filter((a) => a.priorityScore >= (filters.minPriority ?? 0));
  }

  return apps;
}

/**
 * Finds a single application by ID or reference number
 */
export function getApplicationById(idOrRef: string): ApplicationRecord | undefined {
  return mockDatabase.applications.find(
    (a) => a.id === idOrRef || a.referenceNumber.toLowerCase() === idOrRef.toLowerCase()
  );
}

/**
 * Finds an institution by ID or Code
 */
export function getInstitutionById(idOrCode: string): InstitutionRecord | undefined {
  return mockDatabase.institutions.find(
    (i) => i.id === idOrCode || i.code.toLowerCase() === idOrCode.toLowerCase()
  );
}

/**
 * Returns list of validation rules, optionally filtered by enabled status
 */
export function getValidationRules(onlyEnabled = false): ValidationRule[] {
  if (onlyEnabled) {
    return mockDatabase.rules.filter((r) => r.enabled);
  }
  return [...mockDatabase.rules];
}

/**
 * Returns active system alerts
 */
export function getSystemAlerts(includeDismissed = false): SystemAlert[] {
  if (!includeDismissed) {
    return mockDatabase.alerts.filter((a) => !a.dismissed);
  }
  return [...mockDatabase.alerts];
}

/**
 * Returns the benchmark metrics dataset
 */
export function getBenchmarkMetrics(): BenchmarkMetrics {
  return { ...mockDatabase.benchmark };
}

/**
 * Returns full audit log
 */
export function getAuditEvents(): AuditEvent[] {
  return [...mockDatabase.auditEvents];
}

/**
 * Returns infrastructure findings
 */
export function getInfrastructureFindings(applicationId?: string): InfrastructureFinding[] {
  if (applicationId) {
    return mockDatabase.infrastructureChecks.filter((i) => i.applicationId === applicationId);
  }
  return [...mockDatabase.infrastructureChecks];
}

/**
 * Computes dashboard aggregate metrics deterministically from seeded data
 */
export function getCommandCenterMetrics() {
  const apps = mockDatabase.applications;
  const inQueue = apps.length;
  const actionRequired = apps.filter(
    (a) => a.status === 'Action required' || a.status === 'Escalated'
  ).length;

  let pendingIssuerChecks = 0;
  let potentialAnomalies = 0;

  apps.forEach((a) => {
    a.documents.forEach((d) => {
      if (d.verificationStatus === 'verification_pending' || d.verificationStatus === 'source_unavailable') {
        pendingIssuerChecks++;
      }
      if (d.anomalies && d.anomalies.length > 0) {
        potentialAnomalies += d.anomalies.length;
      }
    });
  });

  const inspectionRecommended = mockDatabase.infrastructureChecks.filter(
    (i) => i.advisoryOutcome === 'Recommend inspection'
  ).length;

  // Status distribution
  const statusDistribution: Record<VerificationStatus, number> = {
    verified: 0,
    mismatch_detected: 0,
    expired: 0,
    verification_pending: 0,
    source_unavailable: 0,
    manual_review_required: 0,
  };

  apps.forEach((a) => {
    a.documents.forEach((d) => {
      if (statusDistribution[d.verificationStatus] !== undefined) {
        statusDistribution[d.verificationStatus]++;
      }
    });
  });

  return {
    inQueue,
    actionRequired,
    pendingIssuerChecks,
    potentialAnomalies,
    inspectionRecommended,
    statusDistribution,
  };
}
