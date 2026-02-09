'use client';

import { useState, useEffect } from 'react';
import SelectedTags from './SelectedTags';
import TagSelector from './TagSelector';

interface RecipesSidebarProps {
  categories: string[];
  tags: string[];
  onFilterChange: (filters: FilterState) => void;
}

export interface FilterState {
  search: string;
  category: string;
  selectedTags: string[];
}

export default function RecipesSidebar({ categories, tags, onFilterChange }: RecipesSidebarProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);

  useEffect(() => {
    onFilterChange({ search, category, selectedTags });
  }, [search, category, selectedTags, onFilterChange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleRemoveTag = (tag: string) => {
    setSelectedTags((prev) => prev.filter((t) => t !== tag));
  };

  const handleClearTags = () => {
    setSelectedTags([]);
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setSelectedTags([]);
  };

  const hasActiveFilters = search || category || selectedTags.length > 0;

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
            value={search}
            onChange={(e) => setSearch(e.target.value)}
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
            value={category}
            onChange={(e) => setCategory(e.target.value)}
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
            tags={selectedTags}
            onRemove={handleRemoveTag}
            onClear={handleClearTags}
          />

          <TagSelector
            availableTags={tags}
            selectedTags={selectedTags}
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
