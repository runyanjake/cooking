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

      <section className="grid md:grid-cols-3 gap-8 pt-12">
        <div className="text-center space-y-3">
          <div className="text-4xl">🍳</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Easy Recipes</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Step-by-step instructions for home cooks of all skill levels
          </p>
        </div>
        <div className="text-center space-y-3">
          <div className="text-4xl">📸</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Beautiful Photos</h3>
          <p className="text-gray-600 dark:text-gray-400">
            High-quality images to inspire your cooking journey
          </p>
        </div>
        <div className="text-center space-y-3">
          <div className="text-4xl">🏷️</div>
          <h3 className="text-xl font-semibold text-gray-900 dark:text-white">Organized</h3>
          <p className="text-gray-600 dark:text-gray-400">
            Find recipes by tags, ingredients, and dietary preferences
          </p>
        </div>
      </section>
    </div>
  );
}
