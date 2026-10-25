'use client';

import React, { Suspense } from 'react';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { ApplicationTable } from '@/components/application-table';
import { useSession } from '@/lib/session-context';

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';
  const { applications } = useSession();

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Scrutiny Queue"
        description="Filterable institutional application registry. Triage high-risk submissions, verify statutory documents, and examine findings."
        breadcrumbs={[{ label: 'Applications' }]}
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
