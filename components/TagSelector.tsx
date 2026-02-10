'use client';

import { useState, useRef, useEffect } from 'react';

interface TagSelectorProps {
  availableTags: string[];
  selectedTags: string[];
  onToggleTag: (tag: string) => void;
}

export default function TagSelector({ availableTags, selectedTags, onToggleTag }: TagSelectorProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [searchTerm, setSearchTerm] = useState('');
  const dropdownRef = useRef<HTMLDivElement>(null);

  // Close dropdown when clicking outside
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (dropdownRef.current && !dropdownRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };

    if (isOpen) {
      document.addEventListener('mousedown', handleClickOutside);
      return () => document.removeEventListener('mousedown', handleClickOutside);
    }
  }, [isOpen]);

  const filteredTags = availableTags.filter((tag) =>
    tag.toLowerCase().includes(searchTerm.toLowerCase())
  );

  return (
    <div className="relative" ref={dropdownRef}>
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="w-full px-3 py-2 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-800 text-gray-700 dark:text-gray-300 hover:bg-gray-50 dark:hover:bg-gray-700 transition-colors flex items-center justify-between"
        aria-expanded={isOpen}
        aria-haspopup="true"
        aria-controls="tag-selector-dropdown"
        aria-label="Add tags to filter"
      >
        <span>Add Tags</span>
        <span className="text-gray-400" aria-hidden="true">{isOpen ? '▲' : '▼'}</span>
      </button>

      {isOpen && (
        <div
          id="tag-selector-dropdown"
          className="mt-1 bg-white dark:bg-gray-800 border border-gray-300 dark:border-gray-600 rounded-lg max-h-48 flex flex-col"
          role="dialog"
          aria-label="Tag selection"
        >
          {/* Search input */}
          <div className="p-2 border-b border-gray-200 dark:border-gray-700">
            <label htmlFor="tag-search" className="sr-only">Search tags</label>
            <input
              id="tag-search"
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="Search tags..."
              className="w-full px-2 py-1.5 text-sm border border-gray-300 dark:border-gray-600 rounded bg-white dark:bg-gray-900 text-gray-900 dark:text-white placeholder-gray-400 dark:placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-blue-500"
              aria-describedby="tag-search-description"
            />
            <span id="tag-search-description" className="sr-only">
              Filter available tags by name
            </span>
          </div>

          {/* Tag list */}
          <div className="overflow-y-auto p-2" role="group" aria-label="Available tags">
            {filteredTags.length > 0 ? (
              <div className="space-y-0.5">
                {filteredTags.map((tag) => (
                  <label
                    key={tag}
                    className="flex items-center gap-2 px-2 py-1.5 rounded hover:bg-gray-100 dark:hover:bg-gray-700 cursor-pointer transition-colors"
                  >
                    <input
                      type="checkbox"
                      checked={selectedTags.includes(tag)}
                      onChange={() => onToggleTag(tag)}
                      className="rounded border-gray-300 dark:border-gray-600 text-blue-600 focus:ring-blue-500"
                      aria-label={`${selectedTags.includes(tag) ? 'Deselect' : 'Select'} ${tag} tag`}
                    />
                    <span className="text-sm text-gray-700 dark:text-gray-300">{tag}</span>
                    {selectedTags.includes(tag) && (
                      <span className="ml-auto text-xs text-blue-600 dark:text-blue-400" aria-hidden="true">✓</span>
                    )}
                  </label>
                ))}
              </div>
            ) : (
              <div className="text-center py-4 text-sm text-gray-500 dark:text-gray-400">
                No tags found
              </div>
            )}
          </div>

          {/* Footer */}
          <div className="p-2 border-t border-gray-200 dark:border-gray-700 flex items-center justify-between text-xs text-gray-500 dark:text-gray-400">
            <span aria-live="polite" aria-atomic="true">
              {selectedTags.length} {selectedTags.length === 1 ? 'tag' : 'tags'} selected
            </span>
            <button
              onClick={() => setIsOpen(false)}
              className="px-2 py-1 text-blue-600 dark:text-blue-400 hover:underline"
              aria-label="Close tag selector"
            >
              Done
            </button>
          </div>
        </div>
      )}
    </div>
  );
}
