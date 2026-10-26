'use client';

import React from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { IssuerVerificationPanel } from '@/components/issuer-verification-panel';
import { useSession } from '@/lib/session-context';
import AIOrbFace from '@/components/ui/ai-orb-face';

export default function VerificationPage() {
  const { verificationEvents } = useSession();

  return (
    <AppShell>
      <PageHeader
        title="Issuer Verification Hub"
        description="Track issuer checks, retries and cases routed for manual scrutiny."
        breadcrumbs={[{ label: 'Issuer Verification' }]}
        badge={
          <div className="flex items-center gap-2">
            <AIOrbFace size={100} state="thinking" expression="focused" colors={{ body: '#38bdf8', bodyEdge: '#e0f2fe', feature: '#082f49' }} className="drop-shadow-[0_0_24px_rgba(56,189,248,0.35)]" />
            <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
              6 Status States Active
            </span>
          </div>
        }
      />

      <IssuerVerificationPanel events={verificationEvents} />
    </AppShell>
  );
}
