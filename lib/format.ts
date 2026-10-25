// P.R.A.M.A.N. — Formatting & Localization Utilities
import { VerificationStatus, Severity, ApplicationCategory } from './types';

/**
 * Maps verification status to human-readable label
 */
export function formatVerificationStatus(status: VerificationStatus): string {
  switch (status) {
    case 'verified':
      return 'Verified';
    case 'mismatch_detected':
      return 'Mismatch detected';
    case 'expired':
      return 'Expired';
    case 'verification_pending':
      return 'Verification pending';
    case 'source_unavailable':
      return 'Source unavailable';
    case 'manual_review_required':
      return 'Manual review required';
    default:
      return status;
  }
}

/**
 * Returns color tokens for verification status
 */
export function getVerificationStatusColor(status: VerificationStatus): {
  bg: string;
  text: string;
  border: string;
  dot: string;
} {
  switch (status) {
    case 'verified':
      return {
        bg: 'bg-emerald-500/10',
        text: 'text-emerald-400',
        border: 'border-emerald-500/30',
        dot: 'bg-emerald-400',
      };
    case 'mismatch_detected':
    case 'expired':
      return {
        bg: 'bg-rose-500/10',
        text: 'text-rose-400',
        border: 'border-rose-500/30',
        dot: 'bg-rose-400',
      };
    case 'verification_pending':
    case 'source_unavailable':
      return {
        bg: 'bg-amber-500/10',
        text: 'text-amber-400',
        border: 'border-amber-500/30',
        dot: 'bg-amber-400 animate-pulse',
      };
    case 'manual_review_required':
      return {
        bg: 'bg-indigo-500/10',
        text: 'text-indigo-400',
        border: 'border-indigo-500/30',
        dot: 'bg-indigo-400',
      };
    default:
      return {
        bg: 'bg-slate-500/10',
        text: 'text-slate-400',
        border: 'border-slate-500/30',
        dot: 'bg-slate-400',
      };
  }
}

/**
 * Returns color tokens for severity
 */
export function getSeverityColor(severity: Severity): {
  bg: string;
  text: string;
  border: string;
} {
  switch (severity) {
    case 'critical':
      return {
        bg: 'bg-rose-950/50',
        text: 'text-rose-400',
        border: 'border-rose-800/60',
      };
    case 'high':
      return {
        bg: 'bg-rose-950/30',
        text: 'text-rose-300',
        border: 'border-rose-700/40',
      };
    case 'medium':
      return {
        bg: 'bg-amber-950/40',
        text: 'text-amber-300',
        border: 'border-amber-700/40',
      };
    case 'low':
      return {
        bg: 'bg-blue-950/40',
        text: 'text-blue-300',
        border: 'border-blue-700/40',
      };
    case 'info':
    default:
      return {
        bg: 'bg-slate-900/60',
        text: 'text-slate-300',
        border: 'border-slate-700/40',
      };
  }
}

/**
 * Formats ISO date string to readable format
 */
export function formatDate(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleDateString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
    });
  } catch {
    return isoString;
  }
}

/**
 * Formats ISO date string with time
 */
export function formatDateTime(isoString: string): string {
  try {
    const d = new Date(isoString);
    if (isNaN(d.getTime())) return isoString;
    return d.toLocaleString('en-IN', {
      day: '2-digit',
      month: 'short',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true,
    });
  } catch {
    return isoString;
  }
}

/**
 * Truncates hashes or reference strings safely
 */
export function truncateHash(hash: string, length = 12): string {
  if (!hash || hash.length <= length) return hash;
  return `${hash.slice(0, length / 2)}...${hash.slice(-length / 2)}`;
}

/**
 * Formats percentage with 1 decimal
 */
export function formatPercentage(val: number): string {
  return `${val.toFixed(1)}%`;
}

/**
 * Category badge styles
 */
export function getCategoryBadgeStyle(category: ApplicationCategory): string {
  switch (category) {
    case 'EoA':
      return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
    case 'New Programme':
      return 'bg-violet-500/10 text-violet-400 border-violet-500/30';
    case 'Intake Change':
      return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
    case 'Institutional Change':
      return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
    default:
      return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
  }
}
