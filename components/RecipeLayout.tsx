'use client';

import { useState, useCallback, ReactNode } from 'react';
import RecipesSidebar from './RecipesSidebar';
import type { FilterState } from '@/lib/types';

interface RecipeLayoutProps {
  children: ReactNode;
  categories: string[];
  tags: string[];
  filters?: FilterState;
  onFilterChange?: (filters: FilterState) => void;
  showFilters?: boolean;
}

export default function RecipeLayout({
  children,
  categories,
  tags,
  filters,
  onFilterChange,
  showFilters = true
}: RecipeLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    if (onFilterChange) {
      onFilterChange(newFilters);
    }
  }, [onFilterChange]);

  return (
    <div className="min-h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black/50 z-40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="inline-flex items-center gap-2 px-4 py-2 text-sm font-medium text-gray-700 dark:text-gray-300 bg-gray-100 dark:bg-gray-800 rounded-lg hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          aria-label="Open filters sidebar"
          aria-expanded={sidebarOpen}
          aria-controls="recipes-sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.293A1 1 0 013 6.586V4z" />
          </svg>
          <span>Filters</span>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar - Always visible on desktop (lg+), slide-out drawer on mobile */}
        <aside
          id="recipes-sidebar"
          className={`
            fixed lg:relative z-50 lg:z-0
            top-0 bottom-0 left-0
            w-72 lg:w-64
            bg-white dark:bg-gray-900
            border-r border-gray-200 dark:border-gray-700
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          aria-label="Recipe filters"
        >
          <div className="h-full lg:sticky lg:top-0 flex flex-col overflow-y-auto">
            {/* Mobile sidebar header */}
            <div className="lg:hidden flex items-center justify-between p-4 border-b border-gray-200 dark:border-gray-700">
              <span className="text-sm font-semibold text-gray-900 dark:text-white">Filters</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close filters sidebar"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            {/* Sidebar content */}
            <div className="p-4">
              {showFilters && filters && (
                <RecipesSidebar
                  categories={categories}
                  tags={tags}
                  filters={filters}
                  onFilterChange={handleFilterChange}
                />
              )}
            </div>
          </div>
        </aside>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
