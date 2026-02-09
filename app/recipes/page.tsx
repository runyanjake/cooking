import type { Metadata } from 'next';
import { getAllRecipes, getAllCategories, getAllTags } from '@/lib/recipes';
import RecipesClient from '@/components/RecipesClient';

export const metadata: Metadata = {
  title: 'Recipes - Cooking',
  description: 'Browse our collection of delicious recipes',
};

export default function RecipesPage() {
  const recipes = getAllRecipes();
  const categories = getAllCategories();
  const tags = getAllTags();

  return (
    <div className="space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          Recipes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore our collection of {recipes.length} delicious recipes
        </p>
      </div>

      <RecipesClient recipes={recipes} categories={categories} tags={tags} />
    </div>
  );
}
