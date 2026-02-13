import Link from 'next/link';
import Image from 'next/image';
import type { RecipeMetadata } from '@/lib/recipes';

interface RecipeCardProps {
  recipe: RecipeMetadata & { folderPath: string };
}

export default function RecipeGridCard({ recipe }: RecipeCardProps) {
  // Convert relative path to public URL
  const imageSrc = recipe.displayPhoto && recipe.displayPhoto.startsWith('./')
    ? `/recipes/${recipe.folderPath}/${recipe.displayPhoto.replace('./', '')}`.replace(/\\/g, '/')
    : recipe.displayPhoto || null;

  return (
    <Link
      href={`/recipes/${recipe.category}/${recipe.slug}`}
      className="group block bg-white dark:bg-gray-800 border border-gray-200 dark:border-gray-700 rounded-lg overflow-hidden hover:shadow-lg transition-shadow"
      aria-label={`View recipe: ${recipe.title}`}
    >
      <div className="aspect-video bg-gray-200 dark:bg-gray-700 relative overflow-hidden">
        {imageSrc ? (
          <Image
            src={imageSrc}
            alt={`${recipe.title} - Recipe photo`}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
            unoptimized
          />
        ) : (
          <div className="flex items-center justify-center h-full text-4xl text-gray-400 dark:text-gray-600">
            🍽️
          </div>
        )}
      </div>

      <div className="p-4 space-y-2">
        <h3 className="text-lg font-semibold text-gray-900 dark:text-white group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors">
          {recipe.title}
        </h3>

        <p className="text-sm text-gray-600 dark:text-gray-400 line-clamp-2">
          {recipe.description}
        </p>

        <div className="flex items-center gap-3 text-xs text-gray-500 dark:text-gray-500" role="list" aria-label="Recipe details">
          <span className="flex items-center gap-1" role="listitem">
            <span aria-hidden="true">👥</span>
            <span className="sr-only">Servings: </span>
            {recipe.servings} servings
          </span>
        </div>

        <div className="flex flex-wrap gap-1" role="list" aria-label="Recipe tags">
          {recipe.tags.slice(0, 3).map((tag) => (
            <span
              key={tag}
              role="listitem"
              className="px-2 py-1 text-xs bg-gray-100 dark:bg-gray-700 text-gray-700 dark:text-gray-300 rounded"
            >
              {tag}
            </span>
          ))}
          {recipe.tags.length > 3 && (
            <span role="listitem" className="px-2 py-1 text-xs text-gray-500 dark:text-gray-500">
              +{recipe.tags.length - 3} more
            </span>
          )}
        </div>
      </div>
    </Link>
  );
}
