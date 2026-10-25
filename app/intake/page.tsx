'use client';

import React from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { IntakePipeline } from '@/components/intake-pipeline';

export default function IntakePage() {
  return (
    <AppShell>
      <div className="space-y-6">
        <PageHeader
          title="Document Intake"
          description="Extract, validate and review submitted documents."
          breadcrumbs={[{ label: 'Intake Pipeline' }]}
        />

        <IntakePipeline />
      </div>
    </AppShell>
  );
}
