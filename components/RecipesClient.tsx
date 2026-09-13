'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import RecipeLayout from './RecipeLayout';
import RecipeGridCard from './RecipeGridCard';
import type { Recipe } from '@/lib/recipes';
import ActiveFilters from './ActiveFilters';
import type { FacetCounts, FilterState } from '@/lib/types';

interface RecipesClientProps {
  recipes: Recipe[];
  categories: string[];
  tags: string[];
}

function parseFiltersFromParams(searchParams: URLSearchParams): FilterState {
  return {
    search: searchParams.get('search') || '',
    category: searchParams.get('category') || '',
    selectedTags: searchParams.get('tags')
      ? [...new Set(searchParams.get('tags')!.split(',').filter(Boolean))]
      : [],
  };
}

function buildQueryString(filters: FilterState): string {
  const params = new URLSearchParams();
  if (filters.search) params.set('search', filters.search);
  if (filters.category) params.set('category', filters.category);
  if (filters.selectedTags.length > 0) params.set('tags', filters.selectedTags.join(','));
  const qs = params.toString();
  return qs ? `?${qs}` : '';
}

function matchesSearch(recipe: Recipe, search: string): boolean {
  if (!search) return true;
  const searchLower = search.toLowerCase();
  return (
    recipe.title.toLowerCase().includes(searchLower) ||
    recipe.description.toLowerCase().includes(searchLower) ||
    recipe.tags.some((tag) => tag.toLowerCase().includes(searchLower))
  );
}

function matchesCategory(recipe: Recipe, category: string): boolean {
  return !category || recipe.category === category;
}

function hasAllTags(recipe: Recipe, tags: string[]): boolean {
  return tags.every((tag) => recipe.tags.includes(tag));
}

export default function RecipesClient({ recipes, categories, tags }: RecipesClientProps) {
  const searchParams = useSearchParams();
  const router = useRouter();
  const pathname = usePathname();

  const [filters, setFilters] = useState<FilterState>(() =>
    parseFiltersFromParams(searchParams)
  );

  // Track internal updates to avoid reacting to our own URL changes
  const isInternalUpdate = useRef(false);

  // Sync URL → state on browser back/forward
  useEffect(() => {
    if (isInternalUpdate.current) {
      isInternalUpdate.current = false;
      return;
    }
    setFilters(parseFiltersFromParams(searchParams));
  }, [searchParams]);

  // Update filters and sync to URL
  const updateFilters = useCallback((newFilters: FilterState) => {
    isInternalUpdate.current = true;
    setFilters(newFilters);
    router.replace(`${pathname}${buildQueryString(newFilters)}`, { scroll: false });
  }, [router, pathname]);

  const searchMatches = useMemo(
    () => recipes.filter((recipe) => matchesSearch(recipe, filters.search)),
    [recipes, filters.search]
  );

  const filteredRecipes = useMemo(
    () => searchMatches.filter((recipe) =>
      matchesCategory(recipe, filters.category) && hasAllTags(recipe, filters.selectedTags)
    ),
    [searchMatches, filters.category, filters.selectedTags]
  );

  // Each facet's counts apply every filter except its own, so options show
  // how many results picking them would give
  const facetCounts = useMemo<FacetCounts>(() => {
    const counts: FacetCounts = { categories: {}, tags: {} };
    for (const recipe of searchMatches) {
      if (!hasAllTags(recipe, filters.selectedTags)) continue;
      counts.categories[recipe.category] = (counts.categories[recipe.category] ?? 0) + 1;
      if (!matchesCategory(recipe, filters.category)) continue;
      for (const tag of recipe.tags) {
        counts.tags[tag] = (counts.tags[tag] ?? 0) + 1;
      }
    }
    return counts;
  }, [searchMatches, filters.category, filters.selectedTags]);

  return (
    <RecipeLayout
      categories={categories}
      tags={tags}
      facetCounts={facetCounts}
      resultCount={filteredRecipes.length}
      filters={filters}
      onFilterChange={updateFilters}
    >
      <div className="mb-6 space-y-3">
        <p className="text-sm text-gray-600 dark:text-gray-400" aria-live="polite">
          {filteredRecipes.length === recipes.length
            ? `${recipes.length} recipes`
            : `${filteredRecipes.length} of ${recipes.length} recipes`}
        </p>
        <ActiveFilters filters={filters} onFilterChange={updateFilters} />
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeGridCard key={`${recipe.category}/${recipe.slug}`} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="rounded-lg border border-dashed border-gray-300 dark:border-gray-700 px-6 py-16 text-center">
          <h2 className="text-lg font-semibold text-gray-900 dark:text-white mb-1">
            No recipes match these filters
          </h2>
          <p className="text-sm text-gray-600 dark:text-gray-400 mb-4">
            Try removing a filter or searching for something else.
          </p>
          <button
            type="button"
            onClick={() => updateFilters({ search: '', category: '', selectedTags: [] })}
            className="text-sm font-medium text-blue-600 dark:text-blue-400 hover:underline"
          >
            Clear all filters
          </button>
        </div>
      )}
    </RecipeLayout>
  );
}
