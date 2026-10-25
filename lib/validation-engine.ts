// P.R.A.M.A.N. — Deterministic Regulatory Validation Engine
// Implements explainable rule checks against synthetic records and configurable dry-run

import {
  ApplicationCategory,
  ApplicationRecord,
  InstitutionRecord,
  ValidationFinding,
  ValidationRule,
} from './types';
import { mockDatabase } from './mock-data';

export interface CategoryChecklist {
  requiredDocumentTypes: string[];
  mandatoryRuleIds: string[];
}

/**
 * Returns the mandated checklist for a given application category
 */
export function getCategoryChecklist(
  category: ApplicationCategory,
  activeRules: ValidationRule[] = mockDatabase.rules
): CategoryChecklist {
  const docTypes = mockDatabase.documentTypes
    .filter((dt) => dt.requiredCategories.includes(category))
    .map((dt) => dt.id);

  const ruleIds = activeRules
    .filter((r) => r.enabled)
    .map((r) => r.id);

  return {
    requiredDocumentTypes: docTypes,
    mandatoryRuleIds: ruleIds,
  };
}

/**
 * Evaluates an application against active rules and synthetic institutional records.
 * Deterministic pure function: does not mutate inputs.
 */
export function validateApplication(
  application: ApplicationRecord,
  rules: ValidationRule[] = mockDatabase.rules,
  institutions: InstitutionRecord[] = mockDatabase.institutions
): ValidationFinding[] {
  const findings: ValidationFinding[] = [];
  const enabledRules = rules.filter((r) => r.enabled);
  const inst = institutions.find((i) => i.id === application.institutionId);

  // 1. RULE-DOC-001: Mandatory Document Completeness
  const docRule = enabledRules.find((r) => r.id === 'RULE-DOC-001');
  if (docRule) {
    const checklist = getCategoryChecklist(application.category, enabledRules);
    const uploadedTypes = new Set(
      application.documents.filter((d) => d.uploaded).map((d) => d.type)
    );

    for (const requiredType of checklist.requiredDocumentTypes) {
      if (!uploadedTypes.has(requiredType)) {
        const dt = mockDatabase.documentTypes.find((d) => d.id === requiredType);
        const typeName = dt ? dt.name : requiredType;
        findings.push({
          id: `FND-${application.id}-DOC-${requiredType}`,
          ruleId: 'RULE-DOC-001',
          severity: 'critical',
          title: `Mandatory Document Missing: ${typeName}`,
          reason: `The statutory checklist for ${application.category} requires '${typeName}'.`,
          field: requiredType,
          submittedValue: 'Not uploaded',
          recordValue: 'Uploaded & readable document',
          evidence: {
            documentId: 'N/A',
            documentName: typeName,
          },
          recommendation: `Request applicant to upload a readable, digitally verifiable copy of ${typeName}.`,
          wouldClearIf: `Upload a verified ${typeName} document.`,
          status: 'active',
        });
      }
    }
  }

  // 2. RULE-DATE-002: Certificate Validity & Expiry
  const dateRule = enabledRules.find((r) => r.id === 'RULE-DATE-002');
  if (dateRule) {
    const thresholdDateStr =
      typeof dateRule.configurableThreshold === 'string'
        ? dateRule.configurableThreshold
        : '2026-06-30';
    const thresholdDate = new Date(thresholdDateStr);

    for (const doc of application.documents) {
      if (doc.expiryDate) {
        const expiry = new Date(doc.expiryDate);
        if (expiry < thresholdDate) {
          findings.push({
            id: `FND-${application.id}-EXP-${doc.id}`,
            ruleId: 'RULE-DATE-002',
            severity: 'high',
            title: `Statutory Clearance Expired: ${doc.name}`,
            reason: `Document expired on ${doc.expiryDate}, which is prior to the minimum required validity threshold (${thresholdDateStr}).`,
            field: 'expiryDate',
            submittedValue: doc.expiryDate,
            recordValue: `>= ${thresholdDateStr}`,
            evidence: {
              documentId: doc.id,
              documentName: doc.name,
              page: 1,
            },
            recommendation: 'Request renewed clearance certificate valid for the complete academic session.',
            wouldClearIf: `Upload renewal endorsement valid through at least ${thresholdDateStr}.`,
            status: 'active',
          });
        }
      }
    }
  }

  // 3. RULE-INST-003: Institution Identity Verification
  const instRule = enabledRules.find((r) => r.id === 'RULE-INST-003');
  if (instRule && inst) {
    for (const doc of application.documents) {
      for (const field of doc.extractedFields) {
        if (field.key === 'inst_name' && field.value && inst.name) {
          const normField = field.value.toLowerCase().replace(/[^a-z0-9]/g, '');
          const normInst = inst.name.toLowerCase().replace(/[^a-z0-9]/g, '');
          if (!normField.includes(normInst) && !normInst.includes(normField)) {
            findings.push({
              id: `FND-${application.id}-INST-${doc.id}`,
              ruleId: 'RULE-INST-003',
              severity: 'critical',
              title: `Institutional Name Discrepancy on ${doc.name}`,
              reason: `Extracted name '${field.value}' does not correspond to council registration record '${inst.name}'.`,
              field: 'institutionName',
              submittedValue: field.value,
              recordValue: inst.name,
              evidence: {
                documentId: doc.id,
                documentName: doc.name,
                page: field.page,
                bbox: field.bbox,
              },
              recommendation: 'Verify if recent trust amendment or name-change order exists in archives.',
              wouldClearIf: 'Provide AICTE gazetted name change order or rectify document upload.',
              status: 'active',
            });
          }
        }
      }
    }
  }

  // 4. RULE-INTK-004: Intake Expansion Ceiling & Accreditation Prerequisite
  const intkRule = enabledRules.find((r) => r.id === 'RULE-INTK-004');
  if (intkRule && inst) {
    if (application.category === 'Intake Change') {
      const expansion = application.requestedIntake - application.previousApprovedIntake;
      if (expansion > 0) {
        const expansionPct = (expansion / application.previousApprovedIntake) * 100;
        const maxThreshold = typeof intkRule.configurableThreshold === 'number'
          ? intkRule.configurableThreshold
          : 50;

        if (expansionPct > maxThreshold) {
          findings.push({
            id: `FND-${application.id}-INTK-CAP`,
            ruleId: 'RULE-INTK-004',
            severity: 'high',
            title: `Requested Intake Expansion Exceeds Ceiling (${expansionPct.toFixed(0)}%)`,
            reason: `Proposed intake expansion exceeds the configured maximum threshold of ${maxThreshold}%.`,
            field: 'requestedIntake',
            submittedValue: `${application.requestedIntake} seats (+${expansion})`,
            recordValue: `Max allowable: ${(application.previousApprovedIntake * (1 + maxThreshold / 100)).toFixed(0)} seats`,
            evidence: {
              documentId: application.documents[0]?.id || 'DOC-GEN',
              documentName: 'Application Proposal',
            },
            recommendation: 'Triage for special scrutiny committee review under expanded norms.',
            wouldClearIf: `Revise requested intake to not exceed ${maxThreshold}% expansion.`,
            status: 'active',
          });
        }
      }
    }
  }

  // 5. RULE-TER-005: Technical Education Regulatory (TER) Payment Clearance
  const terRule = enabledRules.find((r) => r.id === 'RULE-TER-005');
  if (terRule) {
    if (application.terPaymentStatus === 'Unpaid' || application.terPaymentStatus === 'Partial') {
      findings.push({
        id: `FND-${application.id}-TER`,
        ruleId: 'RULE-TER-005',
        severity: 'critical',
        title: `TER Processing Fee Deficient (${application.terPaymentStatus})`,
        reason: `Statutory technical education regulatory processing fee status is '${application.terPaymentStatus}'.`,
        field: 'terPaymentStatus',
        submittedValue: application.terPaymentStatus,
        recordValue: 'Paid or Exempt',
        evidence: {
          documentId: application.documents.find((d) => d.type === 'ter_payment_receipt')?.id || 'DOC-TER',
          documentName: 'TER Fee Receipt / Challan',
        },
        recommendation: 'Freeze progression until bank credit confirmation is obtained.',
        wouldClearIf: 'Remit full regulatory processing tariff via central portal.',
        status: 'active',
      });
    }
  }

  // 6. Include pre-seeded document-level anomaly findings if rule is enabled
  const xuseRule = enabledRules.find((r) => r.id === 'RULE-XUSE-006');
  const anomRule = enabledRules.find((r) => r.id === 'RULE-ANOM-007');

  for (const doc of application.documents) {
    for (const anom of doc.anomalies) {
      if (anom.type === 'cross_reuse' && xuseRule) {
        findings.push({
          id: `FND-${application.id}-XUSE-${doc.id}`,
          ruleId: 'RULE-XUSE-006',
          severity: anom.severity,
          title: anom.title,
          reason: anom.description,
          field: 'metadata.fingerprint',
          submittedValue: doc.metadata?.fingerprint || 'Duplicate Perceptual Hash',
          recordValue: 'Unique institutional submission',
          evidence: {
            documentId: doc.id,
            documentName: doc.name,
            page: 1,
            bbox: anom.region,
          },
          recommendation: 'Advisory flag: summon architect of record and verify physical premises.',
          wouldClearIf: 'Verification by independent council inspection team.',
          status: 'active',
        });
      } else if (
        (anom.type === 'metadata_edit' || anom.type === 'ela_heatmap') &&
        anomRule
      ) {
        findings.push({
          id: `FND-${application.id}-ANOM-${doc.id}-${anom.id}`,
          ruleId: 'RULE-ANOM-007',
          severity: anom.severity,
          title: anom.title,
          reason: anom.description,
          field: 'metadata.hasEditTraces',
          submittedValue: 'Digital manipulation artifacts detected',
          recordValue: 'Clean authenticated scan',
          evidence: {
            documentId: doc.id,
            documentName: doc.name,
            page: 1,
            bbox: anom.region,
          },
          recommendation: 'Advisory flag: require original hardcopy submission with issuing officer counter-signature.',
          wouldClearIf: 'Original document verification or certified true copy from municipal registrar.',
          status: 'active',
        });
      }
    }
  }

  return findings;
}

export interface DryRunResult {
  currentFindingsCount: number;
  proposedFindingsCount: number;
  addedFindings: ValidationFinding[];
  removedFindings: ValidationFinding[];
  affectedApplicationsCount: number;
  affectedApplicationIds: string[];
}

/**
 * Compares current findings with findings under proposed rule configurations.
 * Pure calculation: never alters state or database.
 */
export function dryRunRuleChange(
  proposedRules: ValidationRule[],
  applications: ApplicationRecord[] = mockDatabase.applications
): DryRunResult {
  const currentRules = mockDatabase.rules;
  let currentTotal = 0;
  let proposedTotal = 0;
  const added: ValidationFinding[] = [];
  const removed: ValidationFinding[] = [];
  const affectedApps = new Set<string>();

  for (const app of applications) {
    const curFindings = validateApplication(app, currentRules);
    const propFindings = validateApplication(app, proposedRules);

    currentTotal += curFindings.length;
    proposedTotal += propFindings.length;

    const curIds = new Set(curFindings.map((f) => f.id));
    const propIds = new Set(propFindings.map((f) => f.id));

    // Added in proposed
    for (const pf of propFindings) {
      if (!curIds.has(pf.id)) {
        added.push(pf);
        affectedApps.add(app.id);
      }
    }

    // Removed in proposed
    for (const cf of curFindings) {
      if (!propIds.has(cf.id)) {
        removed.push(cf);
        affectedApps.add(app.id);
      }
    }
  }

  return {
    currentFindingsCount: currentTotal,
    proposedFindingsCount: proposedTotal,
    addedFindings: added,
    removedFindings: removed,
    affectedApplicationsCount: affectedApps.size,
    affectedApplicationIds: Array.from(affectedApps),
  };
}
