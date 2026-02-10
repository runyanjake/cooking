'use client';

import { useState, useMemo, useEffect, useCallback, useRef } from 'react';
import { useSearchParams, useRouter, usePathname } from 'next/navigation';
import RecipeLayout from './RecipeLayout';
import RecipeCard from './RecipeCard';
import type { Recipe } from '@/lib/recipes';
import type { FilterState } from '@/lib/types';

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

  const filteredRecipes = useMemo(() => {
    return recipes.filter((recipe) => {
      if (filters.search) {
        const searchLower = filters.search.toLowerCase();
        const matchesSearch =
          recipe.title.toLowerCase().includes(searchLower) ||
          recipe.description.toLowerCase().includes(searchLower) ||
          recipe.tags.some((tag) => tag.toLowerCase().includes(searchLower));
        if (!matchesSearch) return false;
      }

      if (filters.category && recipe.category !== filters.category) {
        return false;
      }

      if (filters.selectedTags.length > 0) {
        const hasAllTags = filters.selectedTags.every((tag) => recipe.tags.includes(tag));
        if (!hasAllTags) return false;
      }

      return true;
    });
  }, [recipes, filters]);

  return (
    <RecipeLayout
      categories={categories}
      tags={tags}
      filters={filters}
      onFilterChange={updateFilters}
      showFilters={true}
    >
      <div className="mb-4 text-sm text-gray-600 dark:text-gray-400">
        {filteredRecipes.length === recipes.length
          ? `Showing all ${recipes.length} recipes`
          : `Showing ${filteredRecipes.length} of ${recipes.length} recipes`}
      </div>

      {filteredRecipes.length > 0 ? (
        <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
          {filteredRecipes.map((recipe) => (
            <RecipeCard key={recipe.slug} recipe={recipe} />
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <div className="text-6xl mb-4">🔍</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white mb-2">
            No recipes found
          </h3>
          <p className="text-gray-600 dark:text-gray-400">
            Try adjusting your filters or search terms
          </p>
        </div>
      )}
    </RecipeLayout>
  );
}
