'use client';

import React from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { InfrastructureReview } from '@/components/infrastructure-review';
import { mockDatabase } from '@/lib/mock-data';

export default function CompliancePage() {
  const checks = mockDatabase.infrastructureChecks;

  return (
    <AppShell>
      <PageHeader
        title="Infrastructure & Evidence Compliance Screening"
        description="Advisory documentary screening for campus geotagging, laboratory equipment density, and architectural floor-plan area norms."
        breadcrumbs={[{ label: 'Compliance Review' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
            Advisory Screening Active
          </span>
        }
      />

      <InfrastructureReview checks={checks} />
    </AppShell>
  );
}
