'use client';

import React from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { RuleEditor } from '@/components/rule-editor';
import { useSession } from '@/lib/session-context';

export default function RuleEditorPage() {
  const { currentRole } = useSession();

  return (
    <AppShell>
      <PageHeader
        title="Regulatory Rule Configuration & Dry-Run Simulator"
        description="Inspect active regulatory rules, simulate parameter alterations against the synthetic dataset, and review impact before session enforcement."
        breadcrumbs={[{ label: 'Rule Editor' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            Role: {currentRole}
          </span>
        }
      />

      <RuleEditor currentRole={currentRole} />
    </AppShell>
  );
}
