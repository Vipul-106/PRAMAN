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
    <div className="mb-6 space-y-3">
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

      <div className="flex flex-col lg:flex-row lg:items-center lg:justify-between gap-5">
        <div>
          <div className="flex items-center gap-3">
            <h1 className="page-title">
              {title}
            </h1>
            {badge}
          </div>
          {desc && (
            <p className="text-sm text-[#d7c0a2]/75 mt-2 max-w-3xl leading-6">
              {desc}
            </p>
          )}
        </div>

        {actions && <div className="flex flex-wrap items-center gap-3 lg:shrink-0">{actions}</div>}
      </div>
    </div>
  );
}
