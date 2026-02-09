'use client';

import { useState } from 'react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import type { RecipeSection } from '@/lib/parseRecipe';

interface RecipeTabsProps {
  sections: RecipeSection[];
  folderPath: string;
}

export default function RecipeTabs({ sections, folderPath }: RecipeTabsProps) {
  const tabOrder = ['Photos', 'Ingredients', 'Instructions', 'Notes', 'References'];
  const orderedSections = tabOrder
    .map(tabName => sections.find(s => s.title === tabName))
    .filter((s): s is RecipeSection => s !== undefined);

  const [activeTab, setActiveTab] = useState(orderedSections[0]?.title || '');

  if (orderedSections.length === 0) {
    return null;
  }

  const activeSection = orderedSections.find(s => s.title === activeTab);

  return (
    <div
      className="bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden"
      role="region"
      aria-label="Recipe sections"
    >
      <div className="border-b border-gray-200 dark:border-gray-700 bg-gray-50 dark:bg-gray-900">
        <nav className="flex overflow-x-auto" role="tablist" aria-label="Recipe section tabs">
          {orderedSections.map((section) => (
            <button
              key={section.title}
              onClick={() => setActiveTab(section.title)}
              role="tab"
              aria-selected={activeTab === section.title}
              aria-controls={`tab-panel-${section.title.toLowerCase()}`}
              id={`tab-${section.title.toLowerCase()}`}
              className={`flex-shrink-0 px-6 py-4 text-sm font-medium whitespace-nowrap transition-colors border-b-2 ${
                activeTab === section.title
                  ? 'border-blue-600 text-blue-600 dark:border-blue-400 dark:text-blue-400 bg-white dark:bg-gray-800'
                  : 'border-transparent text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-200 hover:bg-gray-100 dark:hover:bg-gray-800'
              }`}
            >
              {section.title}
            </button>
          ))}
        </nav>
      </div>

      <div className="p-8">
        {activeSection && (
          <div
            role="tabpanel"
            id={`tab-panel-${activeSection.title.toLowerCase()}`}
            aria-labelledby={`tab-${activeSection.title.toLowerCase()}`}
            className={`prose prose-lg dark:prose-invert max-w-none
            prose-headings:text-gray-900 dark:prose-headings:text-white
            prose-p:text-gray-700 dark:prose-p:text-gray-300
            prose-strong:text-gray-900 dark:prose-strong:text-white
            prose-ol:list-decimal prose-ol:pl-6 prose-ol:space-y-2
            prose-ul:list-disc prose-ul:pl-6 prose-ul:space-y-2
            prose-li:text-gray-700 dark:prose-li:text-gray-300
            prose-li:marker:text-gray-500 dark:prose-li:marker:text-gray-400
            prose-code:text-gray-900 dark:prose-code:text-gray-100
            prose-pre:bg-gray-100 dark:prose-pre:bg-gray-900
            prose-table:border-collapse
            prose-th:border prose-th:border-gray-300 dark:prose-th:border-gray-600
            prose-td:border prose-td:border-gray-300 dark:prose-td:border-gray-600
            ${activeSection.title === 'Photos' ? 'prose-img:w-full prose-img:max-w-2xl prose-img:mx-auto' : ''}
          `}>
            <ReactMarkdown
              remarkPlugins={[remarkGfm]}
              components={{
                ol: ({ children, ...props }) => (
                  <ol className="list-decimal pl-6 space-y-2 my-4" {...props}>
                    {children}
                  </ol>
                ),
                ul: ({ children, ...props }) => (
                  <ul className="list-disc pl-6 space-y-2 my-4" {...props}>
                    {children}
                  </ul>
                ),
                li: ({ children, ...props }) => (
                  <li className="text-gray-700 dark:text-gray-300" {...props}>
                    {children}
                  </li>
                ),
                img: ({ src, alt }) => {
                  // Convert relative paths to public URLs
                  const srcString = typeof src === 'string' ? src : '';
                  const imageSrc = srcString.startsWith('./')
                    ? `/recipes/${folderPath}/${srcString.replace('./', '')}`.replace(/\\/g, '/')
                    : srcString;
                  // Use img directly to avoid nesting issues with paragraphs
                  return (
                    <img
                      src={imageSrc}
                      alt={alt || 'Recipe image'}
                      className="rounded-lg shadow-md w-full max-w-2xl mx-auto my-6 block"
                      loading="lazy"
                    />
                  );
                },
                em: ({ children }) => {
                  if (activeSection.title === 'Photos') {
                    return (
                      <span className="block text-center text-sm text-gray-600 dark:text-gray-400 italic my-2">
                        {children}
                      </span>
                    );
                  }
                  return <em className="italic">{children}</em>;
                },
                h3: ({ children }) => (
                  <h3 className="text-lg font-semibold text-gray-900 dark:text-white mt-6 mb-3">
                    {children}
                  </h3>
                ),
                h4: ({ children }) => (
                  <h4 className="text-base font-semibold text-gray-900 dark:text-white mt-4 mb-2">
                    {children}
                  </h4>
                ),
                // Don't override <p> - let ReactMarkdown handle it to avoid hydration errors
                code: ({ inline, children, ...props }: any) => {
                  if (inline) {
                    return (
                      <code className="px-1.5 py-0.5 bg-gray-100 dark:bg-gray-800 text-gray-900 dark:text-gray-100 rounded text-sm" {...props}>
                        {children}
                      </code>
                    );
                  }
                  return (
                    <code className="block p-4 bg-gray-100 dark:bg-gray-900 rounded-lg overflow-x-auto" {...props}>
                      {children}
                    </code>
                  );
                },
              }}
            >
              {activeSection.content}
            </ReactMarkdown>
          </div>
        )}
      </div>
    </div>
  );
}
