import { notFound } from 'next/navigation';
import type { Metadata } from 'next';
import { getRecipeByCategoryAndSlug, getAllRecipePaths, getRecipeContent } from '@/lib/recipes';
import { SECTION_NAMES, type SectionName } from '@/lib/recipe-content';
import { getRecipeCardImages } from '@/lib/recipe-card';
import RecipePageLayout from '@/components/RecipePageLayout';
import RecipeMarkdown from '@/components/RecipeMarkdown';
import RecipeTabs, { type RecipeTab } from '@/components/RecipeTabs';
import RecipeCardPanel from '@/components/RecipeCardPanel';

interface RecipePageProps {
  params: Promise<{
    category: string;
    slug: string;
  }>;
}

const SECTION_TITLES: Record<SectionName, string> = {
  photos: 'Photos',
  ingredients: 'Ingredients',
  instructions: 'Instructions',
  notes: 'Notes',
  references: 'References',
};

export const dynamicParams = false;

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

  const content = getRecipeContent(recipe);

  const tabs: RecipeTab[] = SECTION_NAMES.flatMap((name) => {
    const section = content.sections[name];
    return section
      ? [{ id: name, title: SECTION_TITLES[name], content: <RecipeMarkdown content={section} recipe={recipe} /> }]
      : [];
  });

  const cardImages = await getRecipeCardImages(recipe);
  if (cardImages) {
    tabs.push({
      id: 'card',
      title: 'Recipe Card',
      content: <RecipeCardPanel title={recipe.title} images={cardImages} />,
    });
  }

  return (
    <RecipePageLayout recipe={recipe}>
      <RecipeMarkdown content={content.intro} recipe={recipe} />
      <RecipeTabs tabs={tabs} />
      <RecipeMarkdown content={content.outro} recipe={recipe} />
    </RecipePageLayout>
  );
}
