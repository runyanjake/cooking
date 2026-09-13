'use client';

import { useState, useCallback, useEffect, ReactNode } from 'react';
import RecipesSidebar from './RecipesSidebar';
import type { FacetCounts, FilterState } from '@/lib/types';

interface RecipeLayoutProps {
  children: ReactNode;
  categories: string[];
  tags: string[];
  facetCounts: FacetCounts;
  resultCount: number;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function RecipeLayout({
  children,
  categories,
  tags,
  facetCounts,
  resultCount,
  filters,
  onFilterChange,
}: RecipeLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFilterChange = useCallback((newFilters: FilterState) => {
    onFilterChange(newFilters);
  }, [onFilterChange]);

  // Close the mobile drawer on Escape
  useEffect(() => {
    if (!sidebarOpen) return;
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setSidebarOpen(false);
    };
    document.addEventListener('keydown', handleKeyDown);
    return () => document.removeEventListener('keydown', handleKeyDown);
  }, [sidebarOpen]);

  const activeFilterCount =
    (filters.search ? 1 : 0) + (filters.category ? 1 : 0) + filters.selectedTags.length;

  return (
    <div>
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
          className="inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-700 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-800 transition-colors"
          aria-expanded={sidebarOpen}
          aria-controls="recipes-sidebar"
        >
          <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M7 12h10M10 18h4" />
          </svg>
          <span>Filters</span>
          {activeFilterCount > 0 && (
            <span className="rounded-full bg-blue-600 px-1.5 text-xs leading-5 text-white tabular-nums">
              {activeFilterCount}
            </span>
          )}
        </button>
      </div>

      <div className="flex lg:gap-10">
        {/* Sidebar - sticky column on desktop (lg+), slide-out drawer on mobile */}
        <aside
          id="recipes-sidebar"
          className={`
            fixed inset-y-0 left-0 z-50 w-80 max-w-[85vw]
            bg-white dark:bg-gray-900
            transition-transform duration-300 ease-in-out
            lg:sticky lg:top-8 lg:z-0 lg:w-64 lg:max-w-none lg:shrink-0 lg:self-start
            lg:max-h-[calc(100vh-4rem)] lg:bg-transparent lg:translate-x-0 lg:transition-none
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full'}
          `}
          aria-label="Recipe filters"
        >
          <div className="flex h-full flex-col lg:max-h-[calc(100vh-4rem)]">
            {/* Mobile drawer header */}
            <div className="lg:hidden flex items-center justify-between px-4 py-3 border-b border-gray-200 dark:border-gray-800">
              <span className="text-base font-semibold text-gray-900 dark:text-white">Filters</span>
              <button
                onClick={() => setSidebarOpen(false)}
                className="p-1 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 rounded-md hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors"
                aria-label="Close filters"
              >
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                </svg>
              </button>
            </div>

            <div className="flex-1 overflow-y-auto p-4 lg:p-0 lg:pr-2">
              <RecipesSidebar
                categories={categories}
                tags={tags}
                facetCounts={facetCounts}
                filters={filters}
                onFilterChange={handleFilterChange}
              />
            </div>

            {/* Mobile drawer footer */}
            <div className="lg:hidden border-t border-gray-200 dark:border-gray-800 p-4">
              <button
                onClick={() => setSidebarOpen(false)}
                className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
              >
                Show {resultCount} {resultCount === 1 ? 'recipe' : 'recipes'}
              </button>
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
