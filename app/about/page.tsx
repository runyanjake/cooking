import type { Metadata } from 'next';
import { MARKDOWN_BODY_CLASSES } from '@/components/markdown-styles';

export const metadata: Metadata = {
  title: 'About - PWS Recipes',
  description: 'Learn more about the PWS recipe collection',
};

export default function AboutPage() {
  return (
    <article className="max-w-4xl mx-auto">
      <header className="mb-8 space-y-4">
        <h1 className="text-4xl md:text-5xl font-bold text-gray-900 dark:text-white">
          About PWS Recipes
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400">
          Explore recipes in a user-friendly manner on a website that prioritizes your cooking experience over monetizing your clicks.
        </p>
      </header>

      <div className={`space-y-8 ${MARKDOWN_BODY_CLASSES}
        [&_h2]:text-2xl [&_h2]:font-bold [&_h2]:text-gray-900 dark:[&_h2]:text-white [&_h2]:mb-3
      `}>
        <section>
          <h2>The PWS Mission</h2>
          <p>
            We believe that cooking should be accessible, enjoyable, and creative. Our goal while collecting and organizing these recipes is to make knowledge readily available and keep your cooking experience a cathartic and fun one.
          </p>
        </section>

        <section>
          <h2>Content Structure</h2>
          <p>
            Each recipe is organized in its own folder with:
          </p>
          <ul>
            <li>Markdown file with metadata frontmatter, recipe content, and instructions</li>
            <li>Assets folder for images and other media</li>
          </ul>
        </section>

        <section>
          <h2>Technology</h2>
          <p>
            Built with modern web technologies including Next.js, React, TypeScript, and Tailwind CSS to ensure fast performance.
          </p>
        </section>
      </div>
    </article>
  );
}
