// Client-safe URL helpers (no fs imports)

interface RecipeLocation {
  category: string;
  slug: string;
}

// Rewrites a recipe-relative path like "./assets/hero.jpg" to its served URL
export function resolveRecipeAssetUrl(recipe: RecipeLocation, src: string): string {
  if (!src.startsWith('./')) return src;
  return `/recipes/${recipe.category}/${recipe.slug}/${src.slice(2)}`;
}

// Generated recipe card image, e.g. "card.png" or "front.png"
export function recipeCardImageUrl(recipe: RecipeLocation, fileName: string): string {
  return `/recipes/${recipe.category}/${recipe.slug}/card/${fileName}`;
}
