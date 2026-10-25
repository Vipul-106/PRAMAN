'use client';

import React, { useState } from 'react';
import { SidebarNav } from './sidebar-nav';
import { TopBar } from './top-bar';
import { RoleBanner } from './role-switcher';
import { ShieldCheck, Info } from 'lucide-react';

import { useSession } from '@/lib/session-context';

interface AppShellProps {
  children: React.ReactNode;
}

export function AppShell({ children }: AppShellProps) {
  const { currentRole, setCurrentRole } = useSession();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  return (
    <div className="relative z-10 flex h-screen w-screen overflow-hidden bg-transparent text-slate-100 font-sans selection:bg-blue-500/30">
      {/* Desktop Persistent Left Sidebar */}
      <div className="hidden md:flex h-full shrink-0">
        <SidebarNav />
      </div>

      {/* Mobile Drawer Overlay */}
      {mobileMenuOpen && (
        <div
          className="fixed inset-0 bg-slate-950/80 backdrop-blur-md z-50 md:hidden flex"
          onClick={() => setMobileMenuOpen(false)}
        >
          <div
            className="w-72 h-full bg-slate-950 border-r border-slate-800/80 shadow-2xl"
            onClick={(e) => e.stopPropagation()}
          >
            <SidebarNav onItemClick={() => setMobileMenuOpen(false)} />
          </div>
        </div>
      )}

      {/* Main Content Workspace Column */}
      <div className="flex-1 flex flex-col min-w-0 h-full overflow-hidden">
        {/* Top Header Bar */}
        <TopBar
          currentRole={currentRole}
          onRoleChange={setCurrentRole}
          onMobileMenuToggle={() => setMobileMenuOpen(!mobileMenuOpen)}
        />

        {/* Dynamic Role Capability Banner */}
        <div className="px-5 md:px-10 py-2 bg-slate-900/30 border-b border-slate-800/70">
          <RoleBanner role={currentRole} />
        </div>

        {/* Scrollable Main Viewport */}
        <main className="flex-1 overflow-y-auto px-5 md:px-10 py-7 md:py-10 space-y-8 bg-[radial-gradient(ellipse_at_top,_rgba(200,150,102,0.08),_transparent_48%)]">
          <div className="mx-auto w-full max-w-[1500px] space-y-8">
            {children}
          </div>

          {/* Persistent Statutory Decision-Support Disclaimer Footer */}
          <footer className="mx-auto w-full max-w-[1500px] mt-0 pt-6 pb-6 border-t border-slate-800/80 text-slate-400 text-xs space-y-2">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <ShieldCheck className="w-4 h-4 text-blue-400 shrink-0" />
                <span className="font-semibold text-slate-300">
                  P.R.A.M.A.N. — Platform for Regulatory Approval, Monitoring & Authentication Network
                </span>
                <span className="px-1.5 py-0.5 rounded text-[10px] bg-amber-500/10 border border-amber-500/30 text-amber-300 font-bold uppercase">
                  Synthetic Prototype
                </span>
              </div>
              <span className="text-[11px] text-slate-400">
                SIH 2026 AICTE Decision-Support Architecture
              </span>
            </div>

            <div className="p-3 rounded-lg bg-slate-900/60 backdrop-blur-md border border-slate-800/80 text-[11px] text-slate-400 leading-relaxed flex items-start gap-2.5">
              <Info className="w-4 h-4 text-slate-400 shrink-0 mt-0.5" />
              <div>
                <p>
                  <strong>REGULATORY DISCLAIMER:</strong> This prototype is an AI-assisted decision-support tool designed for authorized scrutiny officers. All findings, extraction confidences, and anomaly scores are strictly advisory indicators requiring human verification. No automated approval or rejection is performed. Final statutory scrutiny and regulatory decisions remain exclusively with competent authorities under the prevailing Approval Process Handbook (APH).
                </p>
                <p className="mt-1 text-slate-400">
                  All institutional records, certificates, and registry responses are synthetic fixtures generated for demonstration purposes. No live external authorities or real applicant data are accessed.
                </p>
              </div>
            </div>
          </footer>
        </main>
      </div>
    </div>
  );
}
