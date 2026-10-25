'use client';

import React from 'react';
import Link from 'next/link';
import { usePathname } from 'next/navigation';
import {
  LayoutDashboard,
  Inbox,
  FileCheck2,
  Building2,
  Scale,
  SlidersHorizontal,
  Activity,
  History,
  ShieldCheck,
  AlertCircle,
} from 'lucide-react';
import { mockDatabase } from '@/lib/mock-data';

interface SidebarNavProps {
  onItemClick?: () => void;
}

export function SidebarNav({ onItemClick }: SidebarNavProps) {
  const pathname = usePathname();

  const appsCount = mockDatabase.applications.length;
  const actionRequiredCount = mockDatabase.applications.filter(
    (a) => a.status === 'Action required' || a.status === 'Escalated'
  ).length;

  const navItems = [
    {
      label: 'Overview',
      href: '/',
      icon: LayoutDashboard,
      badge: null,
    },
    {
      label: 'Application Queue',
      href: '/applications',
      icon: Inbox,
      badge: appsCount,
    },
    {
      label: 'Intake & Validation',
      href: '/intake',
      icon: FileCheck2,
      badge: 'Smart OCR',
    },
    {
      label: 'Issuer Verification',
      href: '/verification',
      icon: Building2,
      badge: '6 States',
    },
    {
      label: 'Compliance Review',
      href: '/compliance',
      icon: Scale,
      badge: 'Advisory',
    },
    {
      label: 'Rule Editor',
      href: '/rules',
      icon: SlidersHorizontal,
      badge: 'Dry Run',
    },
    {
      label: 'Benchmarks',
      href: '/benchmarks',
      icon: Activity,
      badge: null,
    },
    {
      label: 'Audit Trail',
      href: '/audit',
      icon: History,
      badge: 'SHA-256',
    },
  ];

  return (
    <aside className="w-60 bg-[#0b2226]/90 backdrop-blur-xl border-r border-[#2d545e]/60 flex flex-col h-full shrink-0">
      {/* Brand Header */}
      <div className="p-5 border-b border-[#c89666]/20 bg-transparent">
        <Link href="/" className="block group">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-[#e1b382] flex items-center justify-center shadow-lg shadow-black/20 border border-[#f3dec2]/40">
              <ShieldCheck className="w-5 h-5 text-[#12343b]" />
            </div>
            <div>
              <div className="flex items-center gap-1.5">
                <span className="text-base font-bold tracking-wider text-white group-hover:text-blue-400 transition-colors">
                  P.R.A.M.A.N.
                </span>
                <span className="text-[10px] uppercase font-bold px-1.5 py-0.2 bg-blue-500/20 text-blue-300 border border-blue-500/30 rounded">
                  SIH &apos;26
                </span>
              </div>
              <p className="text-[10px] text-slate-400 font-medium tracking-tight leading-none mt-1">
                AICTE Regulatory Engine
              </p>
            </div>
          </div>
        </Link>
        <p className="hidden">
          Platform for Regulatory Approval, Monitoring & Authentication Network
        </p>
      </div>

      {/* Navigation Links */}
      <nav className="flex-1 px-3 py-6 space-y-1.5 overflow-y-auto">
        <div className="px-3 pb-2 text-[10px] font-bold uppercase tracking-[0.16em] text-slate-500">
          Command Operations
        </div>
        {navItems.map((item) => {
          const isActive =
            item.href === '/'
              ? pathname === '/'
              : pathname.startsWith(item.href);
          const Icon = item.icon;

          return (
            <Link
              key={item.href}
              href={item.href}
              onClick={onItemClick}
              className={`flex items-center justify-between px-3 py-2.5 rounded-lg text-xs font-medium transition-colors duration-200 group ${
                isActive
                  ? 'bg-blue-500/10 text-blue-200 border border-blue-400/20 shadow-sm shadow-blue-950/30'
                  : 'text-slate-400 hover:text-slate-100 hover:bg-slate-900/80 border border-transparent'
              }`}
            >
              <div className="flex items-center gap-3">
                <Icon
                  className={`w-4 h-4 transition-colors ${
                    isActive
                      ? 'text-blue-400'
                      : 'text-slate-400 group-hover:text-slate-200'
                  }`}
                />
                <span>{item.label}</span>
              </div>
              {item.badge !== null && (
                <span
                  className={`text-[10px] font-semibold px-1.5 py-0.5 rounded-md ${
                    typeof item.badge === 'number'
                      ? 'bg-slate-800 text-slate-300 border border-white/5'
                      : 'bg-indigo-500/10 text-indigo-300 border border-indigo-500/20'
                  }`}
                >
                  {item.badge}
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* Urgent Action Banner */}
      {actionRequiredCount > 0 && (
        <div className="px-4 py-3 mx-3 mb-3 rounded-lg bg-amber-500/[0.06] border border-amber-500/20">
          <div className="flex items-center gap-2 text-amber-300 text-xs font-semibold">
            <AlertCircle className="w-3.5 h-3.5" />
            <span>{actionRequiredCount} Cases Need Triage</span>
          </div>
          <p className="text-[11px] text-slate-400 mt-1">
            Potential anomalies or expired certificates require human scrutiny.
          </p>
        </div>
      )}

      {/* Bottom Legal / Prototype Disclaimer */}
      <div className="p-3.5 border-t border-slate-800/80 bg-slate-950">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
          <span className="text-[11px] font-semibold text-slate-300">
            Decision-Support Mode
          </span>
        </div>
        <p className="hidden">
          AI recommendations are strictly advisory. Competent officials retain final authority.
        </p>
      </div>
    </aside>
  );
}
