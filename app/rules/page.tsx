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
        title="Rule Configuration"
        description="Review policy thresholds and simulate changes before applying them."
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
