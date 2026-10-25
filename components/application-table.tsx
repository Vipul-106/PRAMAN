'use client';

import React, { useState, useMemo } from 'react';
import Link from 'next/link';
import { ApplicationRecord, ApplicationWorkflowStatus } from '@/lib/types';
import { CategoryBadge } from '@/components/status-badge';
import { formatDate } from '@/lib/format';
import {
  Search,
  ArrowRight,
  RotateCcw,
  ShieldAlert,
  ArrowUpDown,
  Filter,
  CheckCircle2,
} from 'lucide-react';

interface ApplicationTableProps {
  applications: ApplicationRecord[];
  initialSearch?: string;
}

export function ApplicationTable({ applications, initialSearch = '' }: ApplicationTableProps) {
  const [search, setSearch] = useState(initialSearch);
  const [selectedCategory, setSelectedCategory] = useState<string>('ALL');
  const [selectedStatus, setSelectedStatus] = useState<string>('ALL');
  const [sortBy, setSortBy] = useState<'priority' | 'date'>('priority');

  const filteredApps = useMemo(() => {
    return applications
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
  }, [applications, selectedCategory, selectedStatus, search, sortBy]);

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

  const getStatusBadge = (status: ApplicationWorkflowStatus) => {
    switch (status) {
      case 'Ready for review':
        return 'bg-emerald-500/10 text-emerald-400 border-emerald-500/30';
      case 'Action required':
        return 'bg-rose-500/10 text-rose-400 border-rose-500/30';
      case 'Verification pending':
        return 'bg-amber-500/10 text-amber-400 border-amber-500/30';
      case 'Escalated':
        return 'bg-purple-500/10 text-purple-400 border-purple-500/30';
      case 'Clarification requested':
        return 'bg-blue-500/10 text-blue-400 border-blue-500/30';
      default:
        return 'bg-slate-500/10 text-slate-400 border-slate-500/30';
    }
  };

  return (
    <div className="space-y-4">
      {/* Search & Filter Toolbar */}
      <div className="gov-card p-4 rounded-xl border border-white/10 space-y-4">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          {/* Search box */}
          <div className="relative flex-1 max-w-md">
            <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search reference, institution, code, region..."
              className="w-full bg-slate-900 border border-white/10 text-xs text-white rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-blue-500"
            />
          </div>

          {/* Filter selects & reset */}
          <div className="flex flex-wrap items-center gap-2.5">
            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <Filter className="w-3.5 h-3.5" />
              <span>Category:</span>
              <select
                value={selectedCategory}
                onChange={(e) => setSelectedCategory(e.target.value)}
                className="bg-slate-900 border border-white/10 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="ALL">All Categories</option>
                <option value="EoA">Extension of Approval (EoA)</option>
                <option value="New Programme">New Programme</option>
                <option value="Intake Change">Intake Change</option>
                <option value="Institutional Change">Institutional Change</option>
              </select>
            </div>

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
                <option value="Clarification requested">Clarification requested</option>
                <option value="Escalated">Escalated</option>
              </select>
            </div>

            <div className="flex items-center gap-1.5 text-xs text-slate-400">
              <ArrowUpDown className="w-3.5 h-3.5" />
              <span>Sort:</span>
              <select
                value={sortBy}
                onChange={(e) => setSortBy(e.target.value as 'priority' | 'date')}
                className="bg-slate-900 border border-white/10 text-xs text-slate-200 rounded-lg px-2.5 py-1.5 focus:outline-none focus:border-blue-500"
              >
                <option value="priority">Priority Score (High &rarr; Low)</option>
                <option value="date">Submission Date (Newest)</option>
              </select>
            </div>

            {(search || selectedCategory !== 'ALL' || selectedStatus !== 'ALL') && (
              <button
                onClick={handleResetFilters}
                className="inline-flex items-center gap-1 px-2.5 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-300 text-xs transition-colors"
                title="Reset all filters"
              >
                <RotateCcw className="w-3 h-3" />
                <span>Reset</span>
              </button>
            )}
          </div>
        </div>

        {/* Count Indicator */}
        <div className="text-xs text-slate-400 flex items-center justify-between pt-2 border-t border-white/5">
          <span>
            Showing <strong className="text-slate-200">{filteredApps.length}</strong> of{' '}
            {applications.length} applications
          </span>
          <span className="text-[11px] text-slate-500">
            Triage score represents composite regulatory risk weight
          </span>
        </div>
      </div>

      {/* Main Table Container */}
      <div className="gov-card rounded-xl border border-white/10 overflow-hidden shadow-xl">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-xs">
            <thead className="bg-slate-950/80 text-slate-400 border-b border-white/10 text-[11px] uppercase font-semibold tracking-wider">
              <tr>
                <th className="py-3 px-4">Application Ref</th>
                <th className="py-3 px-4">Institution & Region</th>
                <th className="py-3 px-4">Category</th>
                <th className="py-3 px-4">Submitted</th>
                <th className="py-3 px-4 text-center">Priority</th>
                <th className="py-3 px-4">Primary Advisory Flag</th>
                <th className="py-3 px-4">Status</th>
                <th className="py-3 px-4 text-right">Action</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-white/5">
              {filteredApps.length === 0 ? (
                <tr>
                  <td colSpan={8} className="py-12 text-center text-slate-400 space-y-2">
                    <ShieldAlert className="w-8 h-8 text-amber-400 mx-auto" />
                    <p className="text-sm font-semibold text-slate-300">No applications match criteria</p>
                    <p className="text-xs text-slate-500">
                      Try broadening your search term or clearing active filters.
                    </p>
                    <button
                      onClick={handleResetFilters}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-white mt-2"
                    >
                      <RotateCcw className="w-3.5 h-3.5" />
                      <span>Reset Filters</span>
                    </button>
                  </td>
                </tr>
              ) : (
                filteredApps.map((app) => {
                  const topFinding = app.findings[0];

                  return (
                    <tr
                      key={app.id}
                      className="hover:bg-slate-900/50 transition-colors group"
                    >
                      {/* Application Reference */}
                      <td className="py-3.5 px-4 font-mono font-bold text-blue-400">
                        {app.referenceNumber}
                      </td>

                      {/* Institution Name & Details */}
                      <td className="py-3.5 px-4 max-w-xs">
                        <div className="font-semibold text-white truncate" title={app.institutionName}>
                          {app.institutionName}
                        </div>
                        <div className="text-[11px] text-slate-400 mt-0.5">
                          {app.region} Region &bull; Code: {app.institutionId}
                        </div>
                      </td>

                      {/* Category */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <CategoryBadge category={app.category} />
                      </td>

                      {/* Submitted Date */}
                      <td className="py-3.5 px-4 text-slate-400 whitespace-nowrap">
                        {formatDate(app.submittedAt)}
                      </td>

                      {/* Priority Score */}
                      <td className="py-3.5 px-4 text-center whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-1 rounded-md text-xs font-bold border ${getPriorityScoreBadge(
                            app.priorityScore
                          )}`}
                          title={`Triage score: ${app.priorityScore}/100`}
                        >
                          {app.priorityScore}
                        </span>
                      </td>

                      {/* Primary Issue / Finding */}
                      <td className="py-3.5 px-4 max-w-xs">
                        {topFinding ? (
                          <div className="flex items-center gap-1.5 text-rose-300">
                            <span className="w-1.5 h-1.5 rounded-full bg-rose-400 shrink-0" />
                            <span className="truncate" title={topFinding.title}>
                              {topFinding.title}
                            </span>
                          </div>
                        ) : (
                          <span className="text-emerald-400 flex items-center gap-1.5">
                            <CheckCircle2 className="w-3.5 h-3.5 shrink-0" />
                            <span>Standard compliance</span>
                          </span>
                        )}
                      </td>

                      {/* Workflow Status */}
                      <td className="py-3.5 px-4 whitespace-nowrap">
                        <span
                          className={`inline-block px-2.5 py-0.5 rounded-full text-[11px] font-semibold border ${getStatusBadge(
                            app.status
                          )}`}
                        >
                          {app.status}
                        </span>
                      </td>

                      {/* Open Case Action */}
                      <td className="py-3.5 px-4 text-right whitespace-nowrap">
                        <Link
                          href={`/applications/${app.id}`}
                          className="inline-flex items-center gap-1 px-3 py-1.5 rounded-lg bg-blue-600/20 hover:bg-blue-600 text-blue-300 hover:text-white border border-blue-500/30 transition-all font-semibold"
                        >
                          <span>Open Case</span>
                          <ArrowRight className="w-3.5 h-3.5" />
                        </Link>
                      </td>
                    </tr>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  );
}
