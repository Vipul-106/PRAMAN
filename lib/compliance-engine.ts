// P.R.A.M.A.N. — Advisory Infrastructure & Compliance Engine
// Evaluates photographic evidence, geo-coordinates, and floor-plan area measurements.
// SAFEGUARD: All outcomes are strictly advisory recommendations for human inspection.

import { InfrastructureFinding, ApplicationRecord } from './types';

export interface InfrastructureAssessmentSummary {
  totalChecks: number;
  passCount: number;
  attentionCount: number;
  mismatchCount: number;
  advisoryInspectionRecommended: boolean;
  findings: InfrastructureFinding[];
}

/**
 * Assesses photographic and blueprint evidence for an application.
 * All results are purely advisory.
 */
export function assessApplicationInfrastructure(
  app: ApplicationRecord
): InfrastructureAssessmentSummary {
  const findings = app.infrastructure || [];

  let passCount = 0;
  let attentionCount = 0;
  let mismatchCount = 0;

  for (const f of findings) {
    if (f.result === 'Pass') passCount++;
    else if (f.result === 'Attention') attentionCount++;
    else if (f.result === 'Mismatch') mismatchCount++;
  }

  const advisoryInspectionRecommended =
    mismatchCount > 0 ||
    findings.some((f) => f.advisoryOutcome === 'Recommend inspection');

  return {
    totalChecks: findings.length,
    passCount,
    attentionCount,
    mismatchCount,
    advisoryInspectionRecommended,
    findings,
  };
}
