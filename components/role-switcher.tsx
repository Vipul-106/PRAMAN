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
    <div className="flex items-center gap-1.5 p-1.5 bg-[#0b2226]/60 border border-[#c89666]/20 backdrop-blur-md rounded-full">
      <span className="text-[11px] font-medium text-slate-400 px-2 uppercase tracking-wider hidden sm:inline-block">
        Demo Role:
      </span>
      {roles.map((role) => {
        const isActive = currentRole === role;
        return (
          <button
            key={role}
            onClick={() => onRoleChange(role)}
            className={`flex items-center gap-1.5 px-2.5 py-1 rounded text-xs font-semibold transition-all ${
              isActive
                ? 'bg-[#e1b382] text-[#12343b]'
                : 'bg-[#1c3e45] text-[#e1b382] border border-[#2d545e] hover:bg-[#24505a]'
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
    <div className="bg-transparent border-b border-[#c89666]/15 px-1 py-2 rounded-none flex items-center justify-between text-[11px] text-slate-300">
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
