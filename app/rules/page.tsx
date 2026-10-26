'use client';

import React from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { RuleEditor } from '@/components/rule-editor';
import { useSession } from '@/lib/session-context';
import AIOrbFace from '@/components/ui/ai-orb-face';

export default function RuleEditorPage() {
  const { currentRole } = useSession();

  return (
    <AppShell>
      <PageHeader
        title="Rule Configuration"
        description="Review policy thresholds and simulate changes before applying them."
        breadcrumbs={[{ label: 'Rule Editor' }]}
        badge={
          <div className="flex items-center gap-2">
            <AIOrbFace size={100} state="idle" expression="doubtful" colors={{ body: '#fbbf24', bodyEdge: '#fef3c7', feature: '#422006' }} className="drop-shadow-[0_0_24px_rgba(251,191,36,0.3)]" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              Role: {currentRole}
            </span>
          </div>
        }
      />

      <RuleEditor currentRole={currentRole} />
    </AppShell>
  );
}
