'use client';

import { useState, type ReactNode } from 'react';

interface FacetGroupProps {
  title: string;
  id: string;
  activeCount?: number;
  children: ReactNode;
}

export default function FacetGroup({ title, id, activeCount = 0, children }: FacetGroupProps) {
  const [open, setOpen] = useState(true);

  return (
    <div className="border-b border-gray-200 dark:border-gray-800 py-4 first:pt-0">
      <h3>
        <button
          type="button"
          onClick={() => setOpen(!open)}
          aria-expanded={open}
          aria-controls={`${id}-panel`}
          className="flex w-full items-center justify-between text-sm font-semibold text-gray-900 dark:text-white"
        >
          <span className="flex items-center gap-2">
            {title}
            {activeCount > 0 && (
              <span className="rounded-full bg-blue-600 px-1.5 text-xs font-medium leading-5 text-white tabular-nums">
                {activeCount}
              </span>
            )}
          </span>
          <svg
            className={`h-4 w-4 text-gray-500 transition-transform ${open ? 'rotate-180' : ''}`}
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 9l-7 7-7-7" />
          </svg>
        </button>
      </h3>
      <div id={`${id}-panel`} hidden={!open} className="mt-3">
        {children}
      </div>
    </div>
  );
}
