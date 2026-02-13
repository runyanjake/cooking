import Link from 'next/link';
import type { Recipe } from '@/lib/recipes';

interface RecipePageLayoutProps {
  recipe: Recipe;
  children: React.ReactNode;
}

export default function RecipePageLayout({ recipe, children }: RecipePageLayoutProps) {
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
        <div className={`prose prose-lg dark:prose-invert max-w-none
          prose-p:text-gray-700 dark:prose-p:text-gray-300
          prose-headings:text-gray-900 dark:prose-headings:text-white
          prose-h1:text-2xl prose-h1:md:text-3xl prose-h1:font-bold prose-h1:mt-8 prose-h1:mb-4
          prose-h2:text-xl prose-h2:md:text-2xl prose-h2:font-semibold prose-h2:mt-6 prose-h2:mb-3
          prose-h3:text-lg prose-h3:md:text-xl prose-h3:font-semibold prose-h3:mt-5 prose-h3:mb-2
          prose-h4:text-base prose-h4:md:text-lg prose-h4:font-medium prose-h4:mt-4 prose-h4:mb-2
          prose-strong:text-gray-900 dark:prose-strong:text-white
          prose-blockquote:border-l-4 prose-blockquote:border-gray-300 dark:prose-blockquote:border-gray-600
          prose-blockquote:text-gray-600 dark:prose-blockquote:text-gray-400
          prose-code:text-gray-900 dark:prose-code:text-gray-100
          prose-code:bg-gray-100 dark:prose-code:bg-gray-800 prose-code:rounded prose-code:px-1.5 prose-code:py-0.5
          prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
          prose-ul:list-disc prose-ol:list-decimal
          prose-li:text-gray-700 dark:prose-li:text-gray-300
          prose-li:marker:text-gray-500 dark:prose-li:marker:text-gray-400
          prose-hr:border-gray-200 dark:prose-hr:border-gray-700
          prose-table:border-collapse
          prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600 prose-th:px-3 prose-th:py-2
          prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600 prose-td:px-3 prose-td:py-2
          prose-img:rounded-lg prose-img:shadow-md prose-img:mx-auto
        `}>
          {children}
        </div>
      </article>
    </div>
  );
}
