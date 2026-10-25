'use client';

import React, { useState } from 'react';
import Link from 'next/link';
import { useRouter } from 'next/navigation';
import { OfficerRole } from '@/lib/types';
import { RoleSwitcher } from './role-switcher';
import {
  Search,
  Bell,
  Menu,
  Database,
} from 'lucide-react';
import { mockDatabase } from '@/lib/mock-data';

interface TopBarProps {
  currentRole: OfficerRole;
  onRoleChange: (role: OfficerRole) => void;
  onMobileMenuToggle?: () => void;
}

export function TopBar({
  currentRole,
  onRoleChange,
  onMobileMenuToggle,
}: TopBarProps) {
  const router = useRouter();
  const [searchQuery, setSearchQuery] = useState('');
  const [showAlertsPopover, setShowAlertsPopover] = useState(false);

  const activeAlerts = mockDatabase.alerts.filter((a) => !a.dismissed);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      router.push(`/applications?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <header className="h-16 border-b border-slate-800/80 bg-slate-950/85 backdrop-blur-xl sticky top-0 z-30 px-4 md:px-6 flex items-center justify-between gap-4 shadow-[0_8px_30px_rgba(2,6,23,0.18)]">
      {/* Left section: mobile hamburger & search */}
      <div className="flex items-center gap-3 flex-1 max-w-lg">
        {onMobileMenuToggle && (
          <button
            onClick={onMobileMenuToggle}
            className="md:hidden p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/70 transition-colors"
            aria-label="Toggle navigation"
          >
            <Menu className="w-5 h-5" />
          </button>
        )}

        {/* Global Search Bar */}
        <form onSubmit={handleSearchSubmit} className="relative w-full max-w-sm">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            placeholder="Search application ref, college, region..."
            className="w-full bg-slate-900/70 border border-slate-800 text-xs text-slate-200 placeholder-slate-500 rounded-lg pl-9 pr-3 py-2 focus:outline-none focus:border-blue-400/60 focus:ring-2 focus:ring-blue-500/20 transition-colors"
          />
        </form>
      </div>

      {/* Right section: demo tag, role switcher, alerts, user */}
      <div className="flex items-center gap-3">
        {/* Synthetic Demo Data Pill */}
        <div className="hidden lg:flex items-center gap-1.5 px-2.5 py-1 rounded-full bg-amber-500/10 border border-amber-500/30 text-amber-300 text-xs font-medium">
          <Database className="w-3.5 h-3.5" />
          <span>SYNTHETIC DEMO DATA</span>
        </div>

        {/* Role Switcher */}
        <RoleSwitcher currentRole={currentRole} onRoleChange={onRoleChange} />

        {/* Alerts Bell & Dropdown */}
        <div className="relative">
          <button
            onClick={() => setShowAlertsPopover(!showAlertsPopover)}
            className="relative p-2 text-slate-400 hover:text-white rounded-lg hover:bg-slate-800/70 transition-colors"
            title="System alerts"
          >
            <Bell className="w-4 h-4" />
            {activeAlerts.length > 0 && (
              <span className="absolute top-1 right-1 w-2 h-2 rounded-full bg-rose-500 ring-2 ring-slate-950" />
            )}
          </button>

          {showAlertsPopover && (
            <div className="absolute right-0 mt-2 w-80 sm:w-96 bg-slate-900/95 backdrop-blur-xl border border-slate-800/80 rounded-xl shadow-2xl p-4 z-50">
              <div className="flex items-center justify-between pb-3 border-b border-white/10">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-semibold text-white">Operational Alerts</span>
                  <span className="flex items-center gap-1.5 text-[10px] px-1.5 py-0.5 rounded bg-rose-500/10 border border-rose-500/20 text-rose-300 font-bold">
                    <span className="w-1.5 h-1.5 rounded-full bg-rose-400" />
                    {activeAlerts.length} Active
                  </span>
                </div>
                <Link
                  href="/applications"
                  onClick={() => setShowAlertsPopover(false)}
                  className="text-xs text-blue-400 hover:underline"
                >
                  View queue
                </Link>
              </div>

              <div className="divide-y divide-white/5 max-h-72 overflow-y-auto mt-2">
                {activeAlerts.map((alert) => (
                  <Link
                    key={alert.id}
                    href={`/applications/${alert.applicationId}`}
                    onClick={() => setShowAlertsPopover(false)}
                    className="block py-2.5 hover:bg-slate-800/50 px-2 rounded-lg transition-colors group"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-semibold text-rose-300">
                        {alert.title}
                      </span>
                      <span className="text-[10px] text-slate-500">
                        {alert.applicationRef}
                      </span>
                    </div>
                    <p className="text-xs text-slate-300 mt-1 line-clamp-2">
                      {alert.message}
                    </p>
                    <p className="text-[10px] text-slate-500 mt-1">
                      {alert.institutionName}
                    </p>
                  </Link>
                ))}
              </div>
            </div>
          )}
        </div>

        {/* User Pill */}
        <div className="flex items-center gap-2 pl-2 border-l border-white/10">
          <div className="w-8 h-8 rounded-full bg-gradient-to-tr from-slate-700 to-slate-800 border border-white/10 flex items-center justify-center text-xs font-bold text-white shadow-inner">
            {currentRole === 'Officer' ? 'OF' : currentRole === 'Reviewer' ? 'RV' : 'AD'}
          </div>
          <div className="hidden xl:block text-left">
            <p className="text-xs font-medium text-white leading-tight">
              {currentRole === 'Officer'
                ? 'Officer R. Sharma'
                : currentRole === 'Reviewer'
                ? 'Reviewer S. Sen'
                : 'Admin P. Ramani'}
            </p>
            <p className="text-[10px] text-slate-400 leading-tight">AICTE Northern Reg.</p>
          </div>
        </div>
      </div>
    </header>
  );
}
