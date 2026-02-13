import type { Metadata } from 'next';

export const metadata: Metadata = {
  title: 'About - PWS Recipes',
  description: 'Learn more about the PWS recipe collection',
};

export default function AboutPage() {
  return (
    <div className="max-w-3xl space-y-8">
      <div className="space-y-4">
        <h1 className="text-4xl font-bold text-gray-900 dark:text-white">
          About PWS Recipes
        </h1>
        <p className="text-lg text-gray-600 dark:text-gray-400">
          Explore recipes in a user-friendly manner on a website that prioritizes your cooking experience over monetizing your clicks.
        </p>
      </div>

      <div className="prose dark:prose-invert max-w-none">
        <section className="space-y-4">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            The PWS Mission
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            We believe that cooking should be accessible, enjoyable, and creative. Our goal while collecting and organizing these recipes is to make knowledge readily available and keep your cooking experience a cathartic and fun one.
          </p>
        </section>

        <section className="space-y-4 pt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Content Structure
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Each recipe is organized in its own folder with:
          </p>
          <ul className="list-disc list-inside space-y-2 text-gray-600 dark:text-gray-400 ml-4">
            <li>MDX file with recipe content and instructions</li>
            <li>metadata.json for tags and organization</li>
            <li>Assets folder for images and other media</li>
          </ul>
        </section>

        <section className="space-y-4 pt-6">
          <h2 className="text-2xl font-semibold text-gray-900 dark:text-white">
            Technology
          </h2>
          <p className="text-gray-600 dark:text-gray-400">
            Built with modern web technologies including Next.js, React, TypeScript, and Tailwind CSS to ensure fast performance.
          </p>
        </section>
      </div>
    </div>
  );
}
