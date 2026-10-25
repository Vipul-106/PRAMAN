// P.R.A.M.A.N. — Demo Role Capability Matrix
// NOTE: Client-side prototype simulation only. Real deployments require centralized server auth.

import { OfficerRole, OfficerActionType } from './types';

export interface RoleCapability {
  canViewCases: boolean;
  canReviewEvidence: boolean;
  canAcknowledge: boolean;
  canDismissWithReason: boolean;
  canRequestClarification: boolean;
  canEscalate: boolean;
  canEditRules: boolean;
  canRunDryRun: boolean;
  canVerifyAuditChain: boolean;
  canTriggerIssuerRetry: boolean;
  roleBadgeColor: string;
  description: string;
}

export const ROLE_CAPABILITIES: Record<OfficerRole, RoleCapability> = {
  Officer: {
    canViewCases: true,
    canReviewEvidence: true,
    canAcknowledge: true,
    canDismissWithReason: true,
    canRequestClarification: true,
    canEscalate: true,
    canEditRules: false,
    canRunDryRun: false,
    canVerifyAuditChain: true,
    canTriggerIssuerRetry: true,
    roleBadgeColor: 'bg-blue-500/10 text-blue-400 border-blue-500/30',
    description: 'Scrutiny Officer: Performs case triage, evidence examination, clarification requests, and escalation.',
  },
  Reviewer: {
    canViewCases: true,
    canReviewEvidence: true,
    canAcknowledge: true,
    canDismissWithReason: false, // Reviewer routes dismissals through Officer or Admin
    canRequestClarification: true,
    canEscalate: true,
    canEditRules: false,
    canRunDryRun: false,
    canVerifyAuditChain: true,
    canTriggerIssuerRetry: true,
    roleBadgeColor: 'bg-violet-500/10 text-violet-400 border-violet-500/30',
    description: 'Senior Scrutiny Reviewer: Analyzes escalated cases, validates anomaly evidence, and advises committee.',
  },
  Administrator: {
    canViewCases: true,
    canReviewEvidence: true,
    canAcknowledge: true,
    canDismissWithReason: true,
    canRequestClarification: true,
    canEscalate: true,
    canEditRules: true,
    canRunDryRun: true,
    canVerifyAuditChain: true,
    canTriggerIssuerRetry: true,
    roleBadgeColor: 'bg-amber-500/10 text-amber-400 border-amber-500/30',
    description: 'Regulatory System Administrator: Manages demo rule configurations, runs dry-run simulations, and inspects audit integrity.',
  },
};

/**
 * Checks if a given role is allowed to perform a specific case action
 */
export function isActionAllowed(role: OfficerRole, action: OfficerActionType): boolean {
  const caps = ROLE_CAPABILITIES[role];
  switch (action) {
    case 'acknowledge':
      return caps.canAcknowledge;
    case 'dismiss':
      return caps.canDismissWithReason;
    case 'clarification':
      return caps.canRequestClarification;
    case 'escalate':
      return caps.canEscalate;
    default:
      return false;
  }
}
