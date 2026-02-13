import Link from 'next/link';
import type { Recipe } from '@/lib/recipes';

interface RecipePageClientProps {
  recipe: Recipe;
  children: React.ReactNode;
}

export default function RecipePageClient({ recipe, children }: RecipePageClientProps) {
  return (
    <div>
      <article className="max-w-4xl mx-auto">
        {/* Back navigation */}
        <nav aria-label="Breadcrumb">
          <Link
            href="/recipes"
            className="inline-flex items-center gap-2 mb-6 text-sm text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-white transition-colors"
            aria-label="Back to recipes list"
          >
            <span aria-hidden="true">←</span>
            <span>Back to Recipes</span>
          </Link>
        </nav>

        <header className="mb-8 space-y-4">
          <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
            <Link
              href={`/recipes?category=${encodeURIComponent(recipe.category)}`}
              className="capitalize hover:text-gray-900 dark:hover:text-white transition-colors"
            >
              {recipe.category}
            </Link>
            <span>•</span>
            <time dateTime={recipe.date}>
              Published {new Date(recipe.date).toLocaleDateString('en-US', {
                year: 'numeric',
                month: 'long',
                day: 'numeric',
              })}
            </time>
            {recipe.lastUpdated !== recipe.date && (
              <>
                <span>•</span>
                <time dateTime={recipe.lastUpdated}>
                  Updated {new Date(recipe.lastUpdated).toLocaleDateString('en-US', {
                    year: 'numeric',
                    month: 'long',
                    day: 'numeric',
                  })}
                </time>
              </>
            )}
          </div>

          <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
            {recipe.title}
          </h1>

          <p className="text-xl text-gray-600 dark:text-gray-400">
            {recipe.description}
          </p>

          <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400" role="list" aria-label="Recipe timing and details">
            <div className="flex items-center gap-2" role="listitem">
              <span className="font-medium">Prep:</span>
              <span>{recipe.prepTime} min</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <span className="font-medium">Cook:</span>
              <span>{recipe.cookTime} min</span>
            </div>
            <div className="flex items-center gap-2" role="listitem">
              <span className="font-medium">Servings:</span>
              <span>{recipe.servings}</span>
            </div>
          </div>

          <div className="flex flex-wrap gap-2" role="list" aria-label="Recipe tags">
            {recipe.tags.map((tag) => (
              <Link
                key={tag}
                href={`/recipes?tags=${encodeURIComponent(tag)}`}
                role="listitem"
                className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full hover:bg-gray-200 dark:hover:bg-gray-700 transition-colors"
              >
                {tag}
              </Link>
            ))}
          </div>
        </header>

        {/* MDX content: intro prose + RecipeCard + outro prose */}
        <div className="prose prose-lg dark:prose-invert max-w-none prose-p:text-gray-700 dark:prose-p:text-gray-300">
          {children}
        </div>
      </article>
    </div>
  );
}
