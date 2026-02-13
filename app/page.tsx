import Image from 'next/image';
import Link from 'next/link';
import QuoteOfTheDay from '@/components/QuoteOfTheDay';

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          PWS Recipes
        </h1>
        <QuoteOfTheDay />
        <div className="flex gap-4 justify-center">
          <Link
            href="/recipes"
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors font-medium"
          >
            Cook Something!
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 border border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Why PWS Recipes?
          </Link>
        </div>
      </section>

      <section className="space-y-24 pt-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-3/5 relative aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/assets/want_to_cook.svg"
              alt="Person happily cooking a stew"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="w-full md:w-2/5 space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">You Want to Cook</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Cooking is fun, theraputic, and you need to eat stuff to survive. I&apos;ve collected and tweaked recipes over the years, but over time the bookmark folder has gotten big and recipe sites have gotten worse...
            </p>
            <Link
              href="/recipes"
              className="inline-block px-5 py-2.5 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors font-medium"
            >
              Browse Recipes
            </Link>
          </div>
        </div>

        <div className="flex flex-col md:flex-row-reverse items-center gap-12">
          <div className="w-full md:w-3/5 relative aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/assets/recipe_sites_suck.svg"
              alt="Online cookbook illustration"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="w-full md:w-2/5 space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">But Recipe Sites Suck!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Monetized recipe sites don't bother me, but I do mind when sites have overly aggressive ad integrations that block or move around the main content. Many modern sites share the same user-unfriendly plugins.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-3/5 relative aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/assets/online_cookbook.svg"
              alt="Organized recipe collection"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="w-full md:w-2/5 space-y-4 text-center md:text-left">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Welcome to my Self-Hosted Cookbook!</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Rather than make a physical cookbook, I have built this website to collect my recipes. This content-first website framework renders each page from a MDX markdown file, offering a friendly approach to frontend design for us backend engineers.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
