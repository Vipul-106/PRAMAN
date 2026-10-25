'use client';

import React from 'react';
import { VerificationStatus, Severity, ApplicationCategory } from '@/lib/types';
import {
  formatVerificationStatus,
  getVerificationStatusColor,
  getSeverityColor,
  getCategoryBadgeStyle,
} from '@/lib/format';
import { CheckCircle2, AlertTriangle, Clock, XCircle, ShieldAlert, HelpCircle } from 'lucide-react';

interface StatusBadgeProps {
  status: VerificationStatus;
  showIcon?: boolean;
  className?: string;
}

export function StatusBadge({ status, showIcon = true, className = '' }: StatusBadgeProps) {
  const colors = getVerificationStatusColor(status);
  const label = formatVerificationStatus(status);

  const renderIcon = () => {
    switch (status) {
      case 'verified':
        return <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />;
      case 'mismatch_detected':
        return <XCircle className="w-3.5 h-3.5 text-rose-400" />;
      case 'expired':
        return <AlertTriangle className="w-3.5 h-3.5 text-rose-400" />;
      case 'verification_pending':
        return <Clock className="w-3.5 h-3.5 text-amber-400 animate-pulse" />;
      case 'source_unavailable':
        return <HelpCircle className="w-3.5 h-3.5 text-amber-400" />;
      case 'manual_review_required':
        return <ShieldAlert className="w-3.5 h-3.5 text-indigo-400" />;
      default:
        return null;
    }
  };

  return (
    <span
      className={`tan-badge inline-flex items-center gap-1.5 rounded-md px-2.5 py-0.5 text-xs font-semibold ${colors.bg} ${colors.text} ${colors.border} ${className}`}
    >
      <span className={`w-1.5 h-1.5 rounded-full ${colors.dot}`} />
      {showIcon && renderIcon()}
      <span>{label}</span>
    </span>
  );
}

export function SeverityBadge({ severity }: { severity: Severity }) {
  const colors = getSeverityColor(severity);
  return (
    <span
      className={`tan-badge inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold tracking-wide uppercase ${colors.bg} ${colors.text} ${colors.border}`}
    >
      {severity}
    </span>
  );
}

export function CategoryBadge({ category }: { category: ApplicationCategory }) {
  const style = getCategoryBadgeStyle(category);
  return (
    <span
      className={`tan-badge inline-flex items-center rounded-md px-2.5 py-0.5 text-xs font-semibold ${style}`}
    >
      {category}
    </span>
  );
}
