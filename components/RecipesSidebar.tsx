'use client';

import { useState, useEffect } from 'react';
import FacetGroup from './FacetGroup';
import type { FacetCounts, FilterState } from '@/lib/types';

interface RecipesSidebarProps {
  categories: string[];
  tags: string[];
  facetCounts: FacetCounts;
  filters: FilterState;
  onFilterChange: (filters: FilterState) => void;
}

const COLLAPSED_CATEGORY_COUNT = 8;
const COLLAPSED_TAG_COUNT = 10;

function capitalize(value: string): string {
  return value.charAt(0).toUpperCase() + value.slice(1);
}

function ShowMoreButton({ expanded, hiddenCount, onClick }: { expanded: boolean; hiddenCount: number; onClick: () => void }) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="mt-2 px-2 text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
    >
      {expanded ? 'Show less' : `Show ${hiddenCount} more`}
    </button>
  );
}

export default function RecipesSidebar({ categories, tags, facetCounts, filters, onFilterChange }: RecipesSidebarProps) {
  const [searchInput, setSearchInput] = useState(filters.search);
  const [tagQuery, setTagQuery] = useState('');
  const [showAllCategories, setShowAllCategories] = useState(false);
  const [showAllTags, setShowAllTags] = useState(false);

  // Sync external search changes (e.g. "Clear all" or URL-driven) to local input
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

  const allCategoriesCount = Object.values(facetCounts.categories).reduce((sum, n) => sum + n, 0);

  // Hide options that would lead to zero results, unless already selected
  const availableCategories = categories.filter(
    (cat) => (facetCounts.categories[cat] ?? 0) > 0 || cat === filters.category
  );
  const availableTags = tags.filter(
    (tag) => ((facetCounts.tags[tag] ?? 0) > 0 || filters.selectedTags.includes(tag)) &&
      tag.toLowerCase().includes(tagQuery.toLowerCase())
  );

  // Selected values stay visible even when their group is collapsed
  const visibleCategories = showAllCategories
    ? availableCategories
    : availableCategories.filter((cat, i) => i < COLLAPSED_CATEGORY_COUNT || cat === filters.category);
  const visibleTags = showAllTags || tagQuery
    ? availableTags
    : availableTags.filter((tag, i) => i < COLLAPSED_TAG_COUNT || filters.selectedTags.includes(tag));

  return (
    <section aria-label="Recipe filters">
      <div className="pb-4">
        <label htmlFor="recipe-search" className="sr-only">
          Search recipes
        </label>
        <div className="relative">
          <svg
            className="pointer-events-none absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
            aria-hidden="true"
          >
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-4.35-4.35M17 11A6 6 0 115 11a6 6 0 0112 0z" />
          </svg>
          <input
            type="search"
            id="recipe-search"
            value={searchInput}
            onChange={(e) => setSearchInput(e.target.value)}
            placeholder="Search recipes"
            autoComplete="off"
            className="w-full rounded-lg border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 py-2 pl-9 pr-9 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30 [&::-webkit-search-cancel-button]:appearance-none"
          />
          {searchInput && (
            <button
              type="button"
              onClick={() => {
                setSearchInput('');
                onFilterChange({ ...filters, search: '' });
              }}
              className="absolute right-2 top-1/2 -translate-y-1/2 rounded p-1 text-gray-400 hover:text-gray-700 dark:hover:text-gray-200"
              aria-label="Clear search"
            >
              <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
              </svg>
            </button>
          )}
        </div>
      </div>

      <FacetGroup title="Category" id="facet-category" activeCount={filters.category ? 1 : 0}>
        <fieldset>
          <legend className="sr-only">Category</legend>
          <div className="space-y-0.5">
            {[{ value: '', label: 'All categories', count: allCategoriesCount }]
              .concat(visibleCategories.map((cat) => ({
                value: cat,
                label: capitalize(cat),
                count: facetCounts.categories[cat] ?? 0,
              })))
              .map(({ value, label, count }) => {
                const checked = filters.category === value;
                return (
                  <label
                    key={value || 'all'}
                    className={`flex items-center justify-between rounded-md px-2 py-1.5 text-sm transition-colors
                      has-[:focus-visible]:ring-2 has-[:focus-visible]:ring-blue-500
                      ${checked
                        ? 'bg-blue-50 dark:bg-blue-950 font-medium text-blue-700 dark:text-blue-300'
                        : 'cursor-pointer text-gray-700 dark:text-gray-300 hover:bg-gray-100 dark:hover:bg-gray-800'}`}
                  >
                    <input
                      type="radio"
                      name="category"
                      value={value}
                      checked={checked}
                      onChange={() => onFilterChange({ ...filters, category: value })}
                      className="sr-only"
                    />
                    <span>{label}</span>
                    <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">{count}</span>
                  </label>
                );
              })}
          </div>
          {(showAllCategories ? availableCategories.length > COLLAPSED_CATEGORY_COUNT : visibleCategories.length < availableCategories.length) && (
            <ShowMoreButton
              expanded={showAllCategories}
              hiddenCount={availableCategories.length - visibleCategories.length}
              onClick={() => setShowAllCategories(!showAllCategories)}
            />
          )}
        </fieldset>
      </FacetGroup>

      <FacetGroup title="Tags" id="facet-tags" activeCount={filters.selectedTags.length}>
        <fieldset>
          <legend className="sr-only">Tags</legend>
          {tags.length > COLLAPSED_TAG_COUNT && (
            <div className="mb-2">
              <label htmlFor="tag-search" className="sr-only">Filter tags</label>
              <input
                id="tag-search"
                type="text"
                value={tagQuery}
                onChange={(e) => setTagQuery(e.target.value)}
                placeholder="Filter tags"
                autoComplete="off"
                className="w-full rounded-md border border-gray-300 dark:border-gray-700 bg-white dark:bg-gray-800 px-2.5 py-1.5 text-sm text-gray-900 dark:text-white placeholder-gray-500 focus:border-blue-500 focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              />
            </div>
          )}
          <div className="space-y-0.5">
            {visibleTags.map((tag) => {
              const checked = filters.selectedTags.includes(tag);
              const count = facetCounts.tags[tag] ?? 0;
              return (
                <label
                  key={tag}
                  className={`flex cursor-pointer items-center gap-2.5 rounded-md px-2 py-1.5 text-sm transition-colors hover:bg-gray-100 dark:hover:bg-gray-800
                    ${checked ? 'font-medium text-gray-900 dark:text-white' : 'text-gray-700 dark:text-gray-300'}`}
                >
                  <input
                    type="checkbox"
                    checked={checked}
                    onChange={() => handleTagToggle(tag)}
                    className="h-4 w-4 rounded border-gray-300 dark:border-gray-600 accent-blue-600"
                  />
                  <span className="flex-1 truncate">{tag}</span>
                  <span className="text-xs tabular-nums text-gray-500 dark:text-gray-400">{count}</span>
                </label>
              );
            })}
            {visibleTags.length === 0 && (
              <p className="px-2 py-1.5 text-sm text-gray-500 dark:text-gray-400">No matching tags</p>
            )}
          </div>
          {!tagQuery && (showAllTags ? availableTags.length > COLLAPSED_TAG_COUNT : visibleTags.length < availableTags.length) && (
            <ShowMoreButton
              expanded={showAllTags}
              hiddenCount={availableTags.length - visibleTags.length}
              onClick={() => setShowAllTags(!showAllTags)}
            />
          )}
        </fieldset>
      </FacetGroup>
    </section>
  );
}
