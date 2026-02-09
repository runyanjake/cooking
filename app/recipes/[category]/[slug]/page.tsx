import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getRecipeByCategoryAndSlug, getAllRecipePaths } from '@/lib/recipes';
import { parseRecipeSections } from '@/lib/parseRecipe';
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

  const sections = parseRecipeSections(recipe.content);

  return (
    <RecipePageClient
      recipe={recipe}
      sections={sections}
    />
  );
}
