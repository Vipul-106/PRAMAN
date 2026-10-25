'use client';

import React from 'react';
import Link from 'next/link';
import { ChevronRight } from 'lucide-react';

interface BreadcrumbItem {
  label: string;
  href?: string;
}

interface PageHeaderProps {
  title: string;
  description?: string;
  subtitle?: string;
  breadcrumbs?: BreadcrumbItem[];
  actions?: React.ReactNode;
  badge?: React.ReactNode;
}

export function PageHeader({
  title,
  description,
  subtitle,
  breadcrumbs,
  actions,
  badge,
}: PageHeaderProps) {
  const desc = description || subtitle;
  return (
    <div className="mb-6 space-y-2">
      {breadcrumbs && breadcrumbs.length > 0 && (
        <nav className="flex items-center gap-1.5 text-xs text-slate-400">
          <Link href="/" className="hover:text-slate-200 transition-colors">
            Command Center
          </Link>
          {breadcrumbs.map((crumb, idx) => (
            <React.Fragment key={idx}>
              <ChevronRight className="w-3.5 h-3.5 text-slate-600" />
              {crumb.href ? (
                <Link
                  href={crumb.href}
                  className="hover:text-slate-200 transition-colors"
                >
                  {crumb.label}
                </Link>
              ) : (
                <span className="text-slate-300 font-medium">{crumb.label}</span>
              )}
            </React.Fragment>
          ))}
        </nav>
      )}

      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="text-2xl font-bold tracking-tight text-white">
              {title}
            </h1>
            {badge}
          </div>
          {desc && (
            <p className="text-xs sm:text-sm text-slate-400 mt-1 max-w-3xl">
              {desc}
            </p>
          )}
        </div>

        {actions && <div className="flex items-center gap-2.5 shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
