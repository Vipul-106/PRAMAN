'use client';

import React from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { InfrastructureReview } from '@/components/infrastructure-review';
import { mockDatabase } from '@/lib/mock-data';
import AIOrbFace from '@/components/ui/ai-orb-face';

export default function CompliancePage() {
  const checks = mockDatabase.infrastructureChecks;

  return (
    <AppShell>
      <PageHeader
        title="Infrastructure Review"
        description="Advisory review of campus evidence, facilities and site requirements."
        breadcrumbs={[{ label: 'Compliance Review' }]}
        badge={
          <div className="flex items-center gap-2">
            <AIOrbFace size={105} state="listening" expression="alert" colors={{ body: '#fb7185', bodyEdge: '#ffe4e6', feature: '#4c0519' }} className="drop-shadow-[0_0_26px_rgba(251,113,133,0.35)]" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-indigo-500/10 text-indigo-400 border border-indigo-500/30">
              Advisory Screening Active
            </span>
          </div>
        }
      />

      <InfrastructureReview checks={checks} />
    </AppShell>
  );
}
