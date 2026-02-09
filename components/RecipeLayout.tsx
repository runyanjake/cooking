'use client';

import { useState, useCallback, ReactNode } from 'react';
import RecipesSidebar, { type FilterState } from './RecipesSidebar';

interface RecipeLayoutProps {
  children: ReactNode;
  categories: string[];
  tags: string[];
  onFilterChange?: (filters: FilterState) => void;
  showFilters?: boolean;
}

export default function RecipeLayout({
  children,
  categories,
  tags,
  onFilterChange,
  showFilters = true
}: RecipeLayoutProps) {
  const [sidebarOpen, setSidebarOpen] = useState(false);

  const handleFilterChange = useCallback((filters: FilterState) => {
    if (onFilterChange) {
      onFilterChange(filters);
    }
  }, [onFilterChange]);

  return (
    <div className="min-h-screen">
      {/* Mobile Overlay */}
      {sidebarOpen && (
        <div
          className="lg:hidden fixed inset-0 bg-black bg-opacity-50 z-40"
          onClick={() => setSidebarOpen(false)}
          aria-hidden="true"
        />
      )}

      {/* Mobile menu button - only visible on mobile */}
      <div className="lg:hidden sticky top-0 z-30 bg-white dark:bg-gray-900 border-b border-gray-200 dark:border-gray-700 p-4">
        <button
          onClick={() => setSidebarOpen(true)}
          className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors"
          aria-label="Open filters sidebar"
          aria-expanded={sidebarOpen}
          aria-controls="recipes-sidebar"
        >
          <span aria-hidden="true">☰</span>
          <span>Filters</span>
        </button>
      </div>

      <div className="flex">
        {/* Sidebar - Always visible on desktop (lg+), slide-out on mobile */}
        <aside
          id="recipes-sidebar"
          className={`
            fixed lg:relative z-50 lg:z-0
            bg-white dark:bg-gray-900 border-r border-gray-200 dark:border-gray-700
            w-64 lg:w-64
            h-screen lg:h-auto
            transition-transform duration-300 ease-in-out
            ${sidebarOpen ? 'translate-x-0' : '-translate-x-full lg:translate-x-0'}
          `}
          aria-label="Recipe filters"
        >
          <div className="h-full lg:sticky lg:top-0 flex flex-col p-4 overflow-y-auto">
            {/* Mobile close button */}
            <button
              onClick={() => setSidebarOpen(false)}
              className="lg:hidden absolute top-4 right-4 text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-200 text-xl"
              aria-label="Close filters sidebar"
            >
              <span aria-hidden="true">✕</span>
            </button>

            {/* Sidebar content */}
            {showFilters && (
              <RecipesSidebar
                categories={categories}
                tags={tags}
                onFilterChange={handleFilterChange}
              />
            )}
          </div>
        </aside>

        {/* Main content */}
        <main className="flex-1 p-6">
          {children}
        </main>
      </div>
    </div>
  );
}
