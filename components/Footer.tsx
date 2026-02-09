import Link from 'next/link';

export default function Footer() {
  return (
    <footer className="border-t border-gray-200 dark:border-gray-800 mt-auto">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
        <div className="flex justify-center items-center gap-4 text-sm text-gray-600 dark:text-gray-400">
          <span>&copy; {new Date().getFullYear()} PWS</span>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <Link href="/about" className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors">
            About
          </Link>
          <span className="text-gray-300 dark:text-gray-700">•</span>
          <a
            href="https://github.com/runyanjake/cooking"
            target="_blank"
            rel="noopener noreferrer"
            className="hover:text-gray-900 dark:hover:text-gray-200 transition-colors"
          >
            GitHub
          </a>
        </div>
      </div>
    </footer>
  );
}
