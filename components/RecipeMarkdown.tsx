import type { Root } from 'mdast';
import { toHast } from 'mdast-util-to-hast';
import { toJsxRuntime } from 'hast-util-to-jsx-runtime';
import { Fragment, jsx, jsxs } from 'react/jsx-runtime';
import { resolveRecipeAssetUrl } from '@/lib/recipe-urls';

interface RecipeMarkdownProps {
  content: Root;
  recipe: { category: string; slug: string };
}

// Renders a parsed markdown tree, rewriting ./assets/ image paths to served URLs
export default function RecipeMarkdown({ content, recipe }: RecipeMarkdownProps) {
  return toJsxRuntime(toHast(content), {
    Fragment,
    jsx,
    jsxs,
    components: {
      img: ({ src, alt }) => (
        <img
          src={resolveRecipeAssetUrl(recipe, typeof src === 'string' ? src : '')}
          alt={alt || 'Recipe image'}
          className="rounded-lg shadow-md w-full max-w-2xl mx-auto block"
          loading="lazy"
        />
      ),
      a: ({ href, children }) => (
        <a
          href={href}
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
        >
          {children}
        </a>
      ),
    },
  });
}
