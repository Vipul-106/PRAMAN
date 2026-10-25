'use client';

import React from 'react';
import { OfficerRole } from '@/lib/types';
import { ROLE_CAPABILITIES } from '@/lib/permissions';
import { ShieldCheck, UserCheck, ShieldAlert } from 'lucide-react';

interface RoleSwitcherProps {
  currentRole: OfficerRole;
  onRoleChange: (role: OfficerRole) => void;
}

export function RoleSwitcher({ currentRole, onRoleChange }: RoleSwitcherProps) {
  const roles: OfficerRole[] = ['Officer', 'Reviewer', 'Administrator'];

  const getRoleIcon = (role: OfficerRole) => {
    switch (role) {
      case 'Officer':
        return <UserCheck className="w-3.5 h-3.5 text-blue-400" />;
      case 'Reviewer':
        return <ShieldCheck className="w-3.5 h-3.5 text-violet-400" />;
      case 'Administrator':
        return <ShieldAlert className="w-3.5 h-3.5 text-amber-400" />;
    }
  };

  return (
    <div className="flex items-center gap-1.5 p-1 bg-slate-900/80 border border-slate-800 backdrop-blur-md rounded-lg">
      <span className="text-[11px] font-medium text-slate-400 px-2 uppercase tracking-wider hidden sm:inline-block">
        Demo Role:
      </span>
      {roles.map((role) => {
        const isActive = currentRole === role;
        return (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-medium transition-all ${
              isActive
                ? 'bg-blue-600/30 text-white border border-blue-500/40 shadow-sm'
                : 'text-slate-400 hover:text-slate-200 hover:bg-white/5'
            }`}
            title={ROLE_CAPABILITIES[role].description}
          >
            {getRoleIcon(role)}
            <span>{role}</span>
          </button>
        );
      })}
    </div>
  );
}

export function RoleBanner({ role }: { role: OfficerRole }) {
  const capability = ROLE_CAPABILITIES[role];
  return (
    <div className="bg-slate-900/60 border border-white/5 px-4 py-2 rounded-lg flex items-center justify-between text-xs text-slate-300">
      <div className="flex items-center gap-2">
        <span className={`px-2 py-0.5 rounded text-[11px] font-semibold border ${capability.roleBadgeColor}`}>
          Active: {role}
        </span>
        <span className="text-slate-400 hidden md:inline">{capability.description}</span>
      </div>
      <span className="text-[11px] text-slate-400 italic">
        Simulation mode (no live IAM)
      </span>
    </div>
  );
}
