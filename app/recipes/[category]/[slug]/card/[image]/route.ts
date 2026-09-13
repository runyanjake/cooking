import { getAllRecipes, getRecipeByCategoryAndSlug } from '@/lib/recipes';
import { getRecipeCardImages, renderRecipeCardImage } from '@/lib/recipe-card';

// Printable recipe card PNGs, generated at build time for recipes that opt in with ::card
export const dynamic = 'force-static';
export const dynamicParams = false;

export async function generateStaticParams() {
  const params = await Promise.all(
    getAllRecipes().map(async (recipe) => {
      const images = await getRecipeCardImages(recipe);
      return (images ?? []).map((image) => ({
        category: recipe.category,
        slug: recipe.slug,
        image: image.fileName,
      }));
    })
  );
  return params.flat();
}

export async function GET(
  _request: Request,
  { params }: { params: Promise<{ category: string; slug: string; image: string }> }
) {
  const { category, slug, image } = await params;
  const recipe = getRecipeByCategoryAndSlug(category, slug);
  const png = recipe && await renderRecipeCardImage(recipe, image);

  if (!png) {
    return new Response('Not found', { status: 404 });
  }

  return new Response(new Uint8Array(png), {
    headers: { 'Content-Type': 'image/png' },
  });
}
