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
          title="Smart Document Intake & OCR Pipeline"
          description="Category-based checklist generation, simulated document classification, OCR field extraction with confidence scores, and rectification."
          breadcrumbs={[{ label: 'Intake Pipeline' }]}
        />

        <IntakePipeline />
      </div>
    </AppShell>
  );
}