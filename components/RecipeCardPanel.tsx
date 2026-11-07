import type { RecipeCardImage as RecipeCardImageData } from '@/lib/recipe-card';
import RecipeCardImage from './RecipeCardImage';

interface RecipeCardPanelProps {
  title: string;
  images: RecipeCardImageData[];
}

export default function RecipeCardPanel({ title, images }: RecipeCardPanelProps) {
  const doubleSided = images.length > 1;

  return (
    <div className={doubleSided ? 'grid gap-6 xl:grid-cols-2' : ''}>
      {images.map((image) => (
        <figure key={image.fileName} className="!my-0">
          <RecipeCardImage
            src={image.url}
            alt={`${title} recipe card${doubleSided ? ` (${image.label.toLowerCase()})` : ''}`}
          />
        </figure>
      ))}
    </div>
  );
}
