'use client';

import type { FilterState } from '@/lib/types';

interface ActiveFiltersProps {
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

interface Chip {
  key: string;
  label: string;
  remove: FilterState;
}

export default function ActiveFilters({ filters, onFilterChange }: ActiveFiltersProps) {
  const chips: Chip[] = [
    ...(filters.search
      ? [{ key: 'search', label: `“${filters.search}”`, remove: { ...filters, search: '' } }]
      : []),
    ...(filters.category
      ? [{ key: 'category', label: filters.category.charAt(0).toUpperCase() + filters.category.slice(1), remove: { ...filters, category: '' } }]
      : []),
    ...filters.selectedTags.map((tag) => ({
      key: `tag-${tag}`,
      label: tag,
      remove: { ...filters, selectedTags: filters.selectedTags.filter((t) => t !== tag) },
    })),
  ];

  if (chips.length === 0) return null;

  return (
    <div className="flex flex-wrap items-center gap-2" aria-label="Active filters">
      {chips.map((chip) => (
        <button
          key={chip.key}
          type="button"
          onClick={() => onFilterChange(chip.remove)}
          className="inline-flex items-center gap-1.5 rounded-full border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-1 pl-3 pr-2 text-sm text-gray-800 dark:text-gray-200 hover:border-gray-400 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors"
          aria-label={`Remove filter: ${chip.label}`}
        >
          {chip.label}
          <svg className="h-3.5 w-3.5 text-gray-500" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>
      ))}
      <button
        type="button"
        onClick={() => onFilterChange({ search: '', category: '', selectedTags: [] })}
        className="px-1 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
      >
        Clear all
      </button>
    </div>
  );
}
