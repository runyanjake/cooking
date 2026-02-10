'use client';

import { useState, useEffect } from 'react';
import SelectedTags from './SelectedTags';
import TagSelector from './TagSelector';
import type { FilterState } from '@/lib/types';

interface RecipesSidebarProps {
  categories: string[];
  tags: string[];
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

export default function RecipesSidebar({ categories, tags, filters, onFilterChange }: RecipesSidebarProps) {
  const [searchInput, setSearchInput] = useState(filters.search);

  // Sync external search changes (e.g. "Clear All" or URL-driven) to local input
  useEffect(() => {
    setSearchInput(filters.search);
  }, [filters.search]);

  // Debounce local search input → parent
  useEffect(() => {
    const timer = setTimeout(() => {
      if (searchInput !== filters.search) {
        onFilterChange({ ...filters, search: searchInput });
      }
    }, 300);
    return () => clearTimeout(timer);
  }, [searchInput, filters, onFilterChange]);

  const handleTagToggle = (tag: string) => {
    const selectedTags = filters.selectedTags.includes(tag)
      ? filters.selectedTags.filter((t) => t !== tag)
      : [...filters.selectedTags, tag];
    onFilterChange({ ...filters, selectedTags });
  };

  const handleRemoveTag = (tag: string) => {
    onFilterChange({ ...filters, selectedTags: filters.selectedTags.filter((t) => t !== tag) });
  };

  const handleClearTags = () => {
    onFilterChange({ ...filters, selectedTags: [] });
  };

  const handleClearFilters = () => {
    setSearchInput('');
    onFilterChange({ search: '', category: '', selectedTags: [] });
  };

  const hasActiveFilters = searchInput || filters.category || filters.selectedTags.length > 0;

  return (
    <section aria-label="Recipe filters">
      <div className="space-y-3">
        <div>
          <label htmlFor="search" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Search
          </label>
          <input
            type="text"
            id="search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search recipes..."
            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
          />
        </div>

        <div>
          <label htmlFor="category" className="block text-xs font-medium text-gray-700 dark:text-gray-300 mb-1">
            Category
          </label>
          <select
            id="category"
            value={filters.category}
            onChange={(e) => onFilterChange({ ...filters, category: e.target.value })}
            className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-900 dark:text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
          >
            <option value="">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>
                {cat.charAt(0).toUpperCase() + cat.slice(1)}
              </option>
            ))}
          </select>
        </div>

        <div className="space-y-2">
          <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
            Tags
          </label>

          <SelectedTags
            tags={filters.selectedTags}
            onRemove={handleRemoveTag}
            onClear={handleClearTags}
          />

          <TagSelector
            availableTags={tags}
            selectedTags={filters.selectedTags}
            onToggleTag={handleTagToggle}
          />
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="w-full px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
            aria-label="Clear all filters"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </section>
  );
}
