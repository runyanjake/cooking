'use client';

import React, { useState, type ReactNode } from 'react';

interface Section {
  title: string;
  children: ReactNode[];
}

function extractText(node: ReactNode): string {
  if (typeof node === 'string') return node;
  if (typeof node === 'number') return String(node);
  if (Array.isArray(node)) return node.map(extractText).join('');
  if (React.isValidElement(node)) {
    const props = node.props as { children?: ReactNode };
    if (props.children) return extractText(props.children);
  }
  return '';
}

export default function RecipeCard({ children }: { children: ReactNode }) {
  const childArray = React.Children.toArray(children);
  const sections: Section[] = [];
  let currentSection: Section | null = null;

  for (const child of childArray) {
    if (React.isValidElement(child) && child.type === 'h2') {
      const title = extractText((child.props as { children?: ReactNode }).children);
      currentSection = { title, children: [] };
      sections.push(currentSection);
    } else if (currentSection) {
      currentSection.children.push(child);
    }
  }

  const tabOrder = ['Photos', 'Ingredients', 'Instructions', 'Notes', 'References'];
  const orderedSections = tabOrder
    .map(name => sections.find(s => s.title === name))
    .filter((s): s is Section => s !== undefined);

  const [activeTab, setActiveTab] = useState(orderedSections[0]?.title || '');

  if (orderedSections.length === 0) return null;

  const activeSection = orderedSections.find(s => s.title === activeTab);

  return (
    <div
      className="not-prose bg-white dark:bg-gray-800 rounded-lg shadow-lg border border-gray-200 dark:border-gray-700 overflow-hidden my-8"
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
            className={`max-w-none text-base leading-relaxed
              [&_h3]:text-lg [&_h3]:font-semibold [&_h3]:text-gray-900 dark:[&_h3]:text-white [&_h3]:mt-5 [&_h3]:mb-2
              [&_p]:text-gray-700 dark:[&_p]:text-gray-300 [&_p]:my-2
              [&_strong]:text-gray-900 dark:[&_strong]:text-white
              [&_ol]:list-decimal [&_ol]:pl-6 [&_ol]:space-y-2 [&_ol]:my-4
              [&_ul]:list-disc [&_ul]:pl-6 [&_ul]:space-y-2 [&_ul]:my-4
              [&_li]:text-gray-700 dark:[&_li]:text-gray-300
              [&_li]:marker:text-gray-500 dark:[&_li]:marker:text-gray-400
              [&_a]:text-blue-600 dark:[&_a]:text-blue-400 [&_a]:underline
              [&_code]:text-gray-900 dark:[&_code]:text-gray-100 [&_code]:bg-gray-100 dark:[&_code]:bg-gray-800 [&_code]:rounded [&_code]:px-1.5 [&_code]:py-0.5
              [&_pre]:bg-gray-100 dark:[&_pre]:bg-gray-900
              [&_table]:border-collapse
              [&_th]:border [&_th]:border-gray-300 dark:[&_th]:border-gray-600
              [&_td]:border [&_td]:border-gray-300 dark:[&_td]:border-gray-600
              ${activeSection.title === 'Photos'
                ? '[&_img]:w-full [&_img]:max-w-2xl [&_img]:mx-auto [&_em]:block [&_em]:text-center [&_em]:text-sm [&_em]:text-gray-600 dark:[&_em]:text-gray-400 [&_em]:italic [&_em]:my-2'
                : ''
              }
            `}
          >
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-6">
              {activeSection.title}
            </h2>
            {activeSection.children}
          </div>
        )}
      </div>
    </div>
  );
}
