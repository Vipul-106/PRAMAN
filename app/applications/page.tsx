'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { ApplicationTable } from '@/components/application-table';
import AIOrbFace from '@/components/ui/ai-orb-face';
import { useSession } from '@/lib/session-context';

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const { applications } = useSession();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Review"
        description="Prioritize institutional submissions and open cases for scrutiny."
        breadcrumbs={[{ label: 'Applications' }]}
        badge={<AIOrbFace size={100} state="idle" expression={{ left: { h: 0.58, w: 1.4 }, right: { h: 0.58, w: 1.4 } }} colors={{ body: '#a78bfa', bodyEdge: '#ede9fe', feature: '#2e1065' }} className="drop-shadow-[0_0_24px_rgba(167,139,250,0.35)]" />}
      />

      <ApplicationTable applications={applications} initialSearch={initialSearch} />
    </div>
  );
}

export default function ApplicationsPage() {
  return (
    <AppShell>
      <Suspense fallback={<div className="p-8 text-center text-slate-400">Loading queue...</div>}>
        <ApplicationsContent />
      </Suspense>
    </AppShell>
  );
}
