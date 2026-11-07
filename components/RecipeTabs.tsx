'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';
import { MARKDOWN_BODY_CLASSES } from './markdown-styles';

export interface RecipeTab {
  id: string;
  title: string;
  content: ReactNode;
}

export default function RecipeTabs({ tabs }: { tabs: RecipeTab[] }) {
  const [activeId, setActiveId] = useState(tabs[0]?.id);
  const tabRefs = useRef<Record<string, HTMLButtonElement | null>>({});

  // Arrow keys move between tabs (WAI-ARIA tabs pattern)
  const handleKeyDown = (e: KeyboardEvent<HTMLButtonElement>, index: number) => {
    const offsets: Record<string, number> = { ArrowRight: 1, ArrowLeft: -1 };
    let next: number | undefined;
    if (e.key in offsets) next = (index + offsets[e.key] + tabs.length) % tabs.length;
    if (e.key === 'Home') next = 0;
    if (e.key === 'End') next = tabs.length - 1;
    if (next === undefined) return;
    e.preventDefault();
    setActiveId(tabs[next].id);
    tabRefs.current[tabs[next].id]?.focus();
  };

  if (tabs.length === 0) return null;

  return (
    <div className="not-prose bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden my-8">
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <div className="flex overflow-x-auto" role="tablist" aria-label="Recipe sections">
          {tabs.map((tab, index) => {
            const selected = tab.id === activeId;
            return (
              <button
                key={tab.id}
                ref={(el) => { tabRefs.current[tab.id] = el; }}
                onClick={() => setActiveId(tab.id)}
                onKeyDown={(e) => handleKeyDown(e, index)}
                role="tab"
                aria-selected={selected}
                aria-controls={`tab-panel-${tab.id}`}
                id={`tab-${tab.id}`}
                tabIndex={selected ? 0 : -1}
                className={`flex-shrink-0 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                  selected
                    ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-white dark:bg-gray-800'
                    : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
                }`}
              >
                {tab.title}
              </button>
            );
          })}
        </div>
      </div>

      {/* All panels stay in the HTML so content is indexable; only the active one is shown */}
      {tabs.map((tab) => (
        <div
          key={tab.id}
          role="tabpanel"
          id={`tab-panel-${tab.id}`}
          aria-labelledby={`tab-${tab.id}`}
          hidden={tab.id !== activeId}
          className={`p-8 ${MARKDOWN_BODY_CLASSES}`}
        >
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
            {tab.title}
          </h2>
          {tab.content}
        </div>
      ))}
    </div>
  );
}
