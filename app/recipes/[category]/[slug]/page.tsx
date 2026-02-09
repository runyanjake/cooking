import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getRecipeByCategoryAndSlug, getAllRecipePaths } from '@/lib/recipes';

interface RecipePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllRecipePaths();
  return paths.map((path) => ({
    category: path.category,
    slug: path.slug,
  }));
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const recipe = getRecipeByCategoryAndSlug(category, slug);

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }

  return {
    title: `${recipe.title} - Cooking`,
    description: recipe.description,
    keywords: recipe.tags,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      type: 'article',
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { category, slug } = await params;
  const recipe = getRecipeByCategoryAndSlug(category, slug);

  if (!recipe) {
    notFound();
  }

  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8 space-y-4">
        <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
          <span className="capitalize">{recipe.category}</span>
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

        <div className="flex flex-wrap gap-4 text-sm text-gray-600 dark:text-gray-400">
          <div className="flex items-center gap-2">
            <span className="font-medium">Prep:</span>
            <span>{recipe.prepTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Cook:</span>
            <span>{recipe.cookTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Total:</span>
            <span>{recipe.totalTime} min</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Servings:</span>
            <span>{recipe.servings}</span>
          </div>
          <div className="flex items-center gap-2">
            <span className="font-medium">Difficulty:</span>
            <span className="capitalize">{recipe.difficulty}</span>
          </div>
        </div>

        <div className="flex flex-wrap gap-2">
          {recipe.tags.map((tag) => (
            <span
              key={tag}
              className="px-3 py-1 text-sm bg-gray-100 dark:bg-gray-800 text-gray-700 dark:text-gray-300 rounded-full"
            >
              {tag}
            </span>
          ))}
        </div>
      </header>

      <div className="prose dark:prose-invert max-w-none">
        <div className="bg-gray-50 dark:bg-gray-900 p-8 rounded-lg">
          <p className="text-gray-600 dark:text-gray-400">
            Recipe content will be rendered here from MDX
          </p>
          <pre className="text-xs mt-4 overflow-auto">
            {recipe.content.substring(0, 500)}...
          </pre>
        </div>
      </div>
    </article>
  );
}
