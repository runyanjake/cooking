'use client';

import { useState, useMemo } from 'react';

interface RecipesSidebarProps {
  categories: string[];
  tags: string[];
  onFilterChange: (filters: FilterState) => void;
  isOpen: boolean;
  onToggle: () => void;
}

export interface FilterState {
  search: string;
  category: string;
  selectedTags: string[];
}

export default function RecipesSidebar({ categories, tags, onFilterChange, isOpen, onToggle }: RecipesSidebarProps) {
  const [search, setSearch] = useState('');
  const [category, setCategory] = useState('');
  const [selectedTags, setSelectedTags] = useState<string[]>([]);
  const [showAllTags, setShowAllTags] = useState(false);

  useMemo(() => {
    onFilterChange({ search, category, selectedTags });
  }, [search, category, selectedTags, onFilterChange]);

  const handleTagToggle = (tag: string) => {
    setSelectedTags((prev) =>
      prev.includes(tag) ? prev.filter((t) => t !== tag) : [...prev, tag]
    );
  };

  const handleClearFilters = () => {
    setSearch('');
    setCategory('');
    setSelectedTags([]);
  };

  const hasActiveFilters = search || category || selectedTags.length > 0;
  const displayedTags = showAllTags ? tags : tags.slice(0, 10);

  return (
    <aside>
      <button
        onClick={onToggle}
        className="lg:hidden w-full mb-3 px-3 py-2 text-sm font-medium bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center justify-center gap-2"
      >
        {isOpen ? '✕ Hide Filters' : '⚙️ Show Filters'}
      </button>

      <div className={`space-y-3 ${!isOpen ? 'hidden lg:block' : ''}`}>
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

        <div>
          <div className="flex items-center justify-between mb-1">
            <label className="block text-xs font-medium text-gray-700 dark:text-gray-300">
              Tags
            </label>
            {selectedTags.length > 0 && (
              <button
                onClick={() => setSelectedTags([])}
                className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
              >
                Clear
              </button>
            )}
          </div>
          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {displayedTags.map((tag) => (
              <label
                key={tag}
                className="flex items-center gap-1.5 py-0.5 px-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-800 cursor-pointer"
              >
                <input
                  type="checkbox"
                  checked={selectedTags.includes(tag)}
                  onChange={() => handleTagToggle(tag)}
                  className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                />
                <span className="text-xs text-gray-700 dark:text-gray-300">{tag}</span>
              </label>
            ))}
          </div>
          {tags.length > 10 && (
            <button
              onClick={() => setShowAllTags(!showAllTags)}
              className="text-xs text-blue-600 dark:text-blue-400 hover:underline mt-1"
            >
              {showAllTags ? 'Show less' : `Show ${tags.length - 10} more`}
            </button>
          )}
        </div>

        {hasActiveFilters && (
          <button
            onClick={handleClearFilters}
            className="w-full px-3 py-1.5 text-xs bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
          >
            Clear All Filters
          </button>
        )}
      </div>
    </aside>
  );
}
