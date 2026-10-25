'use client';

import React from 'react';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { IssuerVerificationPanel } from '@/components/issuer-verification-panel';
import { useSession } from '@/lib/session-context';

export default function VerificationPage() {
  const { verificationEvents } = useSession();

  return (
    <AppShell>
      <PageHeader
        title="Issuer Verification Hub"
        description="Automated cross-registry verification against simulated state authorities (Fire Services, Revenue Bhoomi, PWD, NBA, and Universities)."
        breadcrumbs={[{ label: 'Issuer Verification' }]}
        badge={
          <span className="px-2.5 py-0.5 rounded-full text-xs font-semibold bg-blue-500/10 text-blue-400 border border-blue-500/30">
            6 Status States Active
          </span>
        }
      />

      <IssuerVerificationPanel events={verificationEvents} />
    </AppShell>
  );
}
