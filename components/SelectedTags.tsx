'use client';

interface SelectedTagsProps {
  tags: string[];
  onRemove: (tag: string) => void;
  onClear: () => void;
}

export default function SelectedTags({ tags, onRemove, onClear }: SelectedTagsProps) {
  if (tags.length === 0) {
    return null;
  }

  return (
    <div className="space-y-2" role="region" aria-label="Selected tags">
      <div className="flex items-center justify-between">
        <span className="text-xs font-medium text-gray-700 dark:text-gray-300" id="selected-tags-heading">
          Selected Tags ({tags.length})
        </span>
        <button
          onClick={onClear}
          className="text-xs text-blue-600 dark:text-blue-400 hover:underline"
          aria-label={`Clear all ${tags.length} selected tags`}
        >
          Clear all
        </button>
      </div>
      <div className="flex flex-wrap gap-1.5" role="list" aria-labelledby="selected-tags-heading">
        {tags.map((tag) => (
          <button
            key={tag}
            onClick={() => onRemove(tag)}
            className="inline-flex items-center gap-1 px-2 py-1 text-xs bg-blue-100 dark:bg-blue-900 text-blue-800 dark:text-blue-200 rounded-full hover:bg-blue-200 dark:hover:bg-blue-800 transition-colors"
            role="listitem"
            aria-label={`Remove ${tag} tag`}
          >
            <span>{tag}</span>
            <span className="text-blue-600 dark:text-blue-300" aria-hidden="true">×</span>
          </button>
        ))}
      </div>
    </div>
  );
}
