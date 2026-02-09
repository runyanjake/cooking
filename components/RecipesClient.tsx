'use client';

import { useState, useMemo } from 'react';
import RecipeLayout from './RecipeLayout';
import { FilterState } from './RecipesSidebar';
import RecipeCard from './RecipeCard';
import type { Recipe } from '@/lib/recipes';

interface RecipesClientProps {
  recipes: Recipe[];
  categories: string[];
  tags: string[];
}

export default function RecipesClient({ recipes, categories, tags }: RecipesClientProps) {
  const [filters, setFilters] = useState<FilterState>({
    search: '',
    category: '',
    selectedTags: [],
  });

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
      onFilterChange={setFilters}
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
