import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';
import { parseRecipeContent, type RecipeContent } from './recipe-content';

const recipesDirectory = path.join(process.cwd(), 'recipes');

// Cache to avoid repeated file system walks
let recipesCache: Recipe[] | null = null;
const contentCache = new Map<string, RecipeContent>();

export interface RecipeMetadata {
  title: string;
  slug: string;
  date: string;
  lastUpdated: string;
  category: string;
  tags: string[];
  cookTime: number;
  prepTime: number;
  servings: number;
  author: string;
  description: string;
  featured: boolean;
  display: boolean;
  displayPhoto: string;
}

export interface Recipe extends RecipeMetadata {
  filePath: string;
  folderPath: string;
  content: string;
}

function findRecipeFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findRecipeFiles(filePath, fileList);
    } else if (file.endsWith('.md') && file.toLowerCase() !== 'readme.md') {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function getOrPopulateRecipes(): Recipe[] {
  if (recipesCache !== null) {
    return recipesCache;
  }

  const recipes = findRecipeFiles(recipesDirectory)
    .map((filePath) => {
      const fileContents = fs.readFileSync(filePath, 'utf8');
      const { data, content } = matter(fileContents);

      const folderPath = path.dirname(filePath);
      const relativePath = path.relative(recipesDirectory, folderPath);

      return {
        ...(data as RecipeMetadata),
        filePath,
        folderPath: relativePath,
        content,
      };
    })
    .filter((recipe) => recipe.display !== false);

  const sortedRecipes = recipes.sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime());

  recipesCache = sortedRecipes;
  return sortedRecipes;
}

// Parsed section structure of a recipe's markdown body; throws RecipeFormatError on bad syntax
export function getRecipeContent(recipe: Recipe): RecipeContent {
  let content = contentCache.get(recipe.filePath);
  if (!content) {
    content = parseRecipeContent(recipe.content, path.relative(process.cwd(), recipe.filePath));
    contentCache.set(recipe.filePath, content);
  }
  return content;
}

export function getAllRecipes(): Recipe[] {
  return getOrPopulateRecipes();
}

export function getAllCategories(): string[] {
  const allRecipes = getOrPopulateRecipes();
  const categories = new Set(allRecipes.map((recipe) => recipe.category));
  return Array.from(categories).sort();
}

// Tags ordered by how many recipes use them, then alphabetically
export function getAllTags(): string[] {
  const allRecipes = getOrPopulateRecipes();
  const counts = new Map<string, number>();
  for (const tag of allRecipes.flatMap((recipe) => recipe.tags)) {
    counts.set(tag, (counts.get(tag) ?? 0) + 1);
  }
  // Most-used first, so collapsed tag lists show the most useful tags
  return Array.from(counts.keys()).sort((a, b) => counts.get(b)! - counts.get(a)! || a.localeCompare(b));
}

export function getRecipeByCategoryAndSlug(category: string, slug: string): Recipe | undefined {
  const allRecipes = getOrPopulateRecipes();
  return allRecipes.find((recipe) => recipe.category === category && recipe.slug === slug);
}

export function getAllRecipePaths(): Array<{ category: string; slug: string }> {
  const allRecipes = getOrPopulateRecipes();
  return allRecipes.map((recipe) => ({
    category: recipe.category,
    slug: recipe.slug,
  }));
}

const ASSET_CONTENT_TYPES: Record<string, string> = {
  '.jpg': 'image/jpeg',
  '.jpeg': 'image/jpeg',
  '.png': 'image/png',
  '.webp': 'image/webp',
  '.avif': 'image/avif',
  '.gif': 'image/gif',
  '.svg': 'image/svg+xml',
};

function findAssetFiles(dir: string, fileList: string[] = []): string[] {
  if (!fs.existsSync(dir)) return fileList;
  for (const file of fs.readdirSync(dir)) {
    const filePath = path.join(dir, file);
    if (fs.statSync(filePath).isDirectory()) {
      findAssetFiles(filePath, fileList);
    } else if (path.extname(file).toLowerCase() in ASSET_CONTENT_TYPES) {
      fileList.push(filePath);
    }
  }
  return fileList;
}

// Every servable file under each recipe's assets/ folder, as route params
export function getAllRecipeAssetPaths(): Array<{ category: string; slug: string; file: string[] }> {
  return getOrPopulateRecipes().flatMap((recipe) => {
    const assetsDir = path.join(recipesDirectory, recipe.folderPath, 'assets');
    return findAssetFiles(assetsDir).map((filePath) => ({
      category: recipe.category,
      slug: recipe.slug,
      file: path.relative(assetsDir, filePath).split(path.sep),
    }));
  });
}

export function readRecipeAsset(
  category: string,
  slug: string,
  file: string[]
): { data: Buffer; contentType: string } | undefined {
  const recipe = getRecipeByCategoryAndSlug(category, slug);
  if (!recipe) return undefined;

  const assetsDir = path.join(recipesDirectory, recipe.folderPath, 'assets');
  const filePath = path.resolve(assetsDir, ...file);
  const contentType = ASSET_CONTENT_TYPES[path.extname(filePath).toLowerCase()];
  if (!filePath.startsWith(assetsDir + path.sep) || !contentType || !fs.existsSync(filePath)) {
    return undefined;
  }

  return { data: fs.readFileSync(filePath), contentType };
}
