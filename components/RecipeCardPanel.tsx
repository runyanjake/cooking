import type { RecipeCardImage } from '@/lib/recipe-card';
import PrintCardButton from './PrintCardButton';

interface RecipeCardPanelProps {
  title: string;
  images: RecipeCardImage[];
}

const buttonClass =
  'inline-flex items-center gap-2 rounded-lg border border-gray-300 dark:border-gray-600 px-4 py-2 text-sm font-medium text-gray-800 dark:text-gray-200 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors';

export default function RecipeCardPanel({ title, images }: RecipeCardPanelProps) {
  const doubleSided = images.length > 1;

  return (
    <div className="space-y-6">
      <div className={doubleSided ? 'grid gap-6 xl:grid-cols-2' : ''}>
        {images.map((image) => (
          <figure key={image.fileName} className="!my-0">
            <img
              src={image.url}
              alt={`${title} recipe card${doubleSided ? ` (${image.label.toLowerCase()})` : ''}`}
              width={2100}
              height={1500}
              loading="lazy"
              className="h-auto w-full rounded-md border border-gray-200 dark:border-gray-700 bg-white shadow-sm"
            />
          </figure>
        ))}
      </div>

      <div className="flex flex-wrap gap-3">
        {images.map((image) => (
          <a key={image.fileName} href={image.url} download={image.downloadName} className={buttonClass}>
            <svg className="h-4 w-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" aria-hidden="true">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 4v12m0 0l-4-4m4 4l4-4M4 20h16" />
            </svg>
            {doubleSided ? `Download ${image.label.toLowerCase()}` : 'Download PNG'}
          </a>
        ))}
        <PrintCardButton imageUrls={images.map((image) => image.url)} className={buttonClass} />
      </div>
    </div>
  );
}
