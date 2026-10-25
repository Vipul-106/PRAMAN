'use client';

import React, { useState, useMemo, Suspense } from 'react';
import Link from 'next/link';
import { useSearchParams } from 'next/navigation';
import { AppShell } from '@/components/app-shell';
import { PageHeader } from '@/components/page-header';
import { CategoryBadge } from '@/components/status-badge';
import { getApplications } from '@/lib/mock-data';
import { ApplicationCategory, ApplicationWorkflowStatus } from '@/lib/types';
import { formatDate } from '@/lib/format';
import {
  Search,
  Filter,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  ArrowUpDown,
} from 'lucide-react';

function ApplicationsContent() {
  const searchParams = useSearchParams();
  const initialSearch = searchParams.get('search') || '';

  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'priority' | 'date'>('priority');

  const allApps = useMemo(() => getApplications(), []);

  const filteredApps = useMemo(() => {
    return allApps
      .filter((app) => {
        if (selectedCategory !== 'ALL' && app.category !== selectedCategory) {
          return false;
        }
        if (selectedStatus !== 'ALL' && app.status !== selectedStatus) {
          return false;
        }
        if (search.trim()) {
          const q = search.toLowerCase();
          const matchRef = app.referenceNumber.toLowerCase().includes(q);
          const matchInst = app.institutionName.toLowerCase().includes(q);
          const matchCode = app.institutionId.toLowerCase().includes(q);
          const matchRegion = app.region.toLowerCase().includes(q);
          if (!matchRef && !matchInst && !matchCode && !matchRegion) {
            return false;
          }
        }
        return true;
      })
      .sort((a, b) => {
        if (sortBy === 'priority') {
          return b.priorityScore - a.priorityScore;
        }
        return new Date(b.submittedAt).getTime() - new Date(a.submittedAt).getTime();
      });
  }, [allApps, selectedCategory, selectedStatus, search, sortBy]);

  const handleResetFilters = () => {
    setSearch('');
    setSelectedCategory('ALL');
    setSelectedStatus('ALL');
    setSortBy('priority');
  };

  const getPriorityScoreBadge = (score: number) => {
    if (score >= 75) return 'bg-rose-500/15 text-rose-400 border-rose-500/30';
    if (score >= 40) return 'bg-amber-500/15 text-amber-400 border-amber-500/30';
    return 'bg-emerald-500/15 text-emerald-400 border-emerald-500/30';
  };

  return (
    <div className="space-y-6">
      <PageHeader
        title="Application Scrutiny Queue"
        description="Filterable institutional application registry. Triage high-risk submissions, verify statutory documents, and examine findings."
        breadcrumbs={[{ label: 'Applications' }]}
      />

      {/* Filter and Control Bar */}
      <div className="gov-card p-4 rounded-xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search input */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, college, region, code..."
              className="w-full bg-slate-900 border border-white/10 text-xs text-white rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filters */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Category Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-white/10 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Categories</option>
                <option value="EoA">EoA</option>
                <option value="New Programme">New Programme</option>
                <option value="Intake Change">Intake Change</option>
                <option value="Institutional Change">Institutional Change</option>
              </select>
            </div>

            {/* Status Filter */}
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <span>Status:</span>
              <select
                value={selectedStatus}
                onChange={(e) => setSelectedStatus(e.target.value)}
                className="bg-slate-900 border border-white/10 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Statuses</option>
                <option value="Ready for review">Ready for review</option>
                <option value="Action required">Action required</option>
                <option value="Verification pending">Verification pending</option>
                <option value="Escalated">Escalated</option>
                <option value="In review">In review</option>
              </select>
            </div>

            {/* Sort Toggle */}
            <button
              onClick={() => setSortBy(sortBy === 'priority' ? 'date' : 'priority')}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-900 border border-white/10 text-xs text-slate-300 hover:text-white"
            >
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort: {sortBy === 'priority' ? 'Risk Priority' : 'Date'}</span>
            </button>

            {/* Reset */}
            {(search || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                className="flex items-center gap-1 px-2.5 py-1.5 rounded-lg text-xs text-slate-400 hover:text-white hover:bg-white/5"
              >
                <RotateCcw className="w-3.5 h-3.5" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        <div className="flex items-center justify-between text-xs text-slate-400 pt-2 border-t border-white/5">
          <span>
            Showing <strong className="text-white">{filteredApps.length}</strong> of{' '}
            <strong className="text-white">{allApps.length}</strong> applications
          </span>
          <span className="text-[11px] italic">
            Automated scoring is an advisory triage aid.
          </span>
        </div>
      </div>

      {/* Applications Table */}
      {filteredApps.length === 0 ? (
        <div className="gov-card p-12 text-center rounded-xl border border-white/10 space-y-3">
          <p className="text-sm font-semibold text-slate-300">
            No applications match your filter criteria.
          </p>
          <button
            onClick={handleResetFilters}
            className="text-xs text-blue-400 hover:underline inline-flex items-center gap-1"
          >
            <RotateCcw className="w-3.5 h-3.5" />
            <span>Reset filters</span>
          </button>
        </div>
      ) : (
        <div className="gov-card rounded-xl border border-white/10 overflow-x-auto">
          <table className="w-full text-left text-xs border-collapse">
            <thead>
              <tr className="border-b border-white/10 bg-slate-900/50 text-slate-400 font-semibold uppercase tracking-wider text-[11px]">
                <th className="p-3.5">Application Ref</th>
                <th className="p-3.5">Institution Name</th>
                <th className="p-3.5">Category</th>
                <th className="p-3.5">Submitted</th>
                <th className="p-3.5">Priority</th>
                <th className="p-3.5">Primary Issue / Advisory Flag</th>
                <th className="p-3.5">Workflow Status</th>
                <th className="p-3.5 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5 text-slate-200">
              {filteredApps.map((app) => {
                const topFinding = app.findings[0];
                return (
                  <tr
                    key={app.id}
                    className="hover:bg-slate-900/40 transition-colors group"
                  >
                    <td className="p-3.5 font-mono font-bold text-blue-400 whitespace-nowrap">
                      {app.referenceNumber}
                    </td>
                    <td className="p-3.5 max-w-[220px]">
                      <div className="font-semibold text-white truncate" title={app.institutionName}>
                        {app.institutionName}
                      </div>
                      <div className="text-[11px] text-slate-400">
                        {app.region} Region &bull; {app.institutionId}
                      </div>
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <CategoryBadge category={app.category} />
                    </td>
                    <td className="p-3.5 whitespace-nowrap text-slate-400">
                      {formatDate(app.submittedAt)}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span
                        className={`inline-block px-2 py-0.5 rounded text-xs font-bold border ${getPriorityScoreBadge(
                          app.priorityScore
                        )}`}
                      >
                        {app.priorityScore}/100
                      </span>
                    </td>
                    <td className="p-3.5 max-w-[240px]">
                      {topFinding ? (
                        <div className="flex items-center gap-1.5 text-rose-300">
                          <ShieldAlert className="w-3.5 h-3.5 shrink-0" />
                          <span className="truncate" title={topFinding.title}>
                            {topFinding.title}
                          </span>
                        </div>
                      ) : (
                        <span className="text-emerald-400 text-[11px]">
                          Routine verification profile
                        </span>
                      )}
                    </td>
                    <td className="p-3.5 whitespace-nowrap">
                      <span className="px-2 py-0.5 rounded text-xs bg-slate-800 text-slate-300 border border-white/5 font-medium">
                        {app.status}
                      </span>
                    </td>
                    <td className="p-3.5 text-right whitespace-nowrap">
                      <Link
                        href={`/applications/${app.id}`}
                        className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600/40 text-blue-300 hover:text-white border border-blue-500/30 text-xs font-semibold transition-all"
                      >
                        <span>Open Case</span>
                        <ArrowRight className="w-3 h-3" />
                      </Link>
                    </td>
                  </tr>
                );
              })}
            </tbody>
          </table>
        </div>
      )}
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
