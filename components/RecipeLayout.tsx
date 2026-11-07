'use client';

import { useState, useCallback, ReactNode } from 'react';
import Sidebar from './Sidebar';
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

  const closeSidebar = useCallback(() => setSidebarOpen(false), []);

  const activeFilterCount =
    (filters.search ? 1 : 0) + (filters.category ? 1 : 0) + filters.selectedTags.length;

  return (
    <div>
      {/* Mobile filter button */}
      <div className="lg:hidden mb-4">
        <button
          type="button"
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
        <Sidebar
          id="recipes-sidebar"
          title="Filters"
          open={sidebarOpen}
          onClose={closeSidebar}
          footer={
            <button
              type="button"
              onClick={closeSidebar}
              className="w-full rounded-lg bg-blue-600 px-4 py-2.5 text-sm font-semibold text-white hover:bg-blue-700 transition-colors"
            >
              Show {resultCount} {resultCount === 1 ? 'recipe' : 'recipes'}
            </button>
          }
        >
          <RecipesSidebar
            categories={categories}
            tags={tags}
            facetCounts={facetCounts}
            filters={filters}
            onFilterChange={handleFilterChange}
          />
        </Sidebar>

        {/* Main content */}
        <div className="flex-1 min-w-0">
          {children}
        </div>
      </div>
    </div>
  );
}
