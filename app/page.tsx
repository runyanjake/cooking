import Image from 'next/image';
import Link from 'next/link';

export default function Home() {
  return (
    <div className="space-y-12">
      <section className="text-center space-y-6">
        <h1 className="text-5xl font-bold text-gray-900 dark:text-white">
          Welcome to Cooking
        </h1>
        <p className="text-xl text-gray-600 dark:text-gray-400 max-w-2xl mx-auto">
          Discover delicious recipes, cooking tips, and culinary inspiration for every occasion.
        </p>
        <div className="flex gap-4 justify-center">
          <Link
            href="/recipes"
            className="px-6 py-3 bg-gray-900 dark:bg-white text-white dark:text-gray-900 rounded-lg hover:bg-gray-700 dark:hover:bg-gray-200 transition-colors font-medium"
          >
            Browse Recipes
          </Link>
          <Link
            href="/about"
            className="px-6 py-3 border border-gray-900 dark:border-white text-gray-900 dark:text-white rounded-lg hover:bg-gray-100 dark:hover:bg-gray-800 transition-colors font-medium"
          >
            Learn More
          </Link>
        </div>
      </section>

      <section className="space-y-24 pt-16">
        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-3/5 relative aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/assets/want_to_cook.svg"
              alt="Person deciding what to cook"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="w-full md:w-2/5 space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Easy Recipes</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Step-by-step instructions for home cooks of all skill levels. Whether you&apos;re a beginner or an experienced cook, every recipe is written with clarity in mind.
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
              src="/assets/online_cookbook.svg"
              alt="Online cookbook illustration"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="w-full md:w-2/5 space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">Beautiful Photos</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              High-quality images accompany every recipe to inspire your cooking journey. See exactly what you&apos;re making before you start.
            </p>
          </div>
        </div>

        <div className="flex flex-col md:flex-row items-center gap-12">
          <div className="w-full md:w-3/5 relative aspect-[3/2] rounded-2xl overflow-hidden shadow-lg">
            <Image
              src="/assets/recipe_sites_suck.svg"
              alt="Organized recipe collection"
              fill
              className="object-cover"
              unoptimized
            />
          </div>
          <div className="w-full md:w-2/5 space-y-4">
            <h2 className="text-3xl font-bold text-gray-900 dark:text-white">No Nonsense</h2>
            <p className="text-lg text-gray-600 dark:text-gray-400">
              Just recipes. Find what you need quickly by browsing categories, filtering by tags, or searching by ingredient.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
