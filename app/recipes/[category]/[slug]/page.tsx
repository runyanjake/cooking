import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { compileMDX } from 'next-mdx-remote/rsc';
import remarkGfm from 'remark-gfm';
import { getRecipeByCategoryAndSlug, getAllRecipePaths } from '@/lib/recipes';
import RecipeCard from '@/components/RecipeCard';
import RecipePageClient from '@/components/RecipePageClient';

interface RecipePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

export async function generateStaticParams() {
  const paths = getAllRecipePaths();
  return paths.map((path) => ({
    category: path.category,
    slug: path.slug,
  }));
}

export async function generateMetadata({ params }: RecipePageProps): Promise<Metadata> {
  const { category, slug } = await params;
  const recipe = getRecipeByCategoryAndSlug(category, slug);

  if (!recipe) {
    return {
      title: 'Recipe Not Found',
    };
  }

  return {
    title: `${recipe.title} - Cooking`,
    description: recipe.description,
    keywords: recipe.tags,
    openGraph: {
      title: recipe.title,
      description: recipe.description,
      type: 'article',
    },
  };
}

export default async function RecipePage({ params }: RecipePageProps) {
  const { category, slug } = await params;
  const recipe = getRecipeByCategoryAndSlug(category, slug);

  if (!recipe) {
    notFound();
  }

  const folderPath = recipe.folderPath;

  const { content } = await compileMDX({
    source: recipe.content,
    components: {
      RecipeCard,
      img: ({ src, alt }: { src?: string; alt?: string }) => {
        const srcString = typeof src === 'string' ? src : '';
        const imageSrc = srcString.startsWith('./')
          ? `/recipes/${folderPath}/${srcString.replace('./', '')}`.replace(/\\/g, '/')
          : srcString;
        return (
          <img
            src={imageSrc}
            alt={alt || 'Recipe image'}
            className="rounded-lg shadow-md w-full max-w-2xl mx-auto my-6 block"
            loading="lazy"
          />
        );
      },
      a: ({ href, children, ...props }: React.AnchorHTMLAttributes<HTMLAnchorElement>) => (
        <a
          href={href}
          className="text-blue-600 dark:text-blue-400 hover:underline"
          target={href?.startsWith('http') ? '_blank' : undefined}
          rel={href?.startsWith('http') ? 'noopener noreferrer' : undefined}
          {...props}
        >
          {children}
        </a>
      ),
    },
    options: {
      mdxOptions: {
        remarkPlugins: [remarkGfm],
      },
    },
  });

  return (
    <RecipePageClient recipe={recipe}>
      {content}
    </RecipePageClient>
  );
}
