'use client';

import { useRef, useState, type KeyboardEvent, type ReactNode } from 'react';

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
          className="p-8 max-w-none text-base leading-relaxed
            [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_h3]:mt-5 [&_h3]:mb-2
            [&_p]:text-gray-700 dark:[&_p]:text-gray-300 [&_p]:my-2
            [&_strong]:text-gray-900 dark:[&_strong]:text-white
            [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4
            [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4
            [&_li]:text-gray-700 dark:[&_li]:text-gray-300
            [&_li]:marker:text-gray-500 dark:[&_li]:marker:text-gray-400
            [&_code]:text-gray-900 dark:[&_code]:text-gray-100 [&_code]:bg-gray-100 dark:[&_code]:bg-gray-800 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5
            [&_pre]:bg-gray-100 dark:[&_pre]:bg-gray-900
            [&_table]:border-collapse
            [&_th]:border [&_th]:border-gray-300 dark:[&_th]:border-gray-600
            [&_td]:border [&_td]:border-gray-300 dark:[&_td]:border-gray-600
            [&_figure]:my-6
            [&_figcaption]:mt-2 [&_figcaption]:text-center [&_figcaption]:text-sm [&_figcaption]:italic [&_figcaption]:text-gray-600 dark:[&_figcaption]:text-gray-400"
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
