import Link from 'next/link';
import type { RecipeMetadata } from '@/lib/recipes';

interface RecipeCardProps {
  recipe: RecipeMetadata & { folderPath: string };
}

export default function RecipeCard({ recipe }: RecipeCardProps) {
  return (
    <Link
      href={`/recipes/${recipe.category}/${recipe.slug}`}
      className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
    >
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 flex items-center justify-center text-4xl">
        📷
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {recipe.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500">
          <span className="flex items-center gap-1">
            ⏱️ {recipe.totalTime} min
          </span>
          <span className="flex items-center gap-1">
            👥 {recipe.servings} servings
          </span>
          <span className="flex items-center gap-1">
            {recipe.difficulty === 'easy' && '⭐'}
            {recipe.difficulty === 'medium' && '⭐⭐'}
            {recipe.difficulty === 'hard' && '⭐⭐⭐'}
          </span>
        </div>

        <div className="flex flex-wrap gap-1">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span className="px-2 py-1 text-xs text-gray-500 dark:text-gray-500">
              +{recipe.tags.length - 3}
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
