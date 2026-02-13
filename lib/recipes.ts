import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const recipesDirectory = path.join(process.cwd(), 'public/recipes');

// Cache to avoid repeated file system walks
let recipesCache: Recipe[] | null = null;

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

function findMDXFiles(dir: string, fileList: string[] = []): string[] {
  const files = fs.readdirSync(dir);

  files.forEach((file) => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);

    if (stat.isDirectory()) {
      findMDXFiles(filePath, fileList);
    } else if (file.endsWith('.mdx')) {
      fileList.push(filePath);
    }
  });

  return fileList;
}

function getOrPopulateRecipes(): Recipe[] {
  if (recipesCache !== null) {
    return recipesCache;
  }

  const mdxFiles = findMDXFiles(recipesDirectory);

  const recipes = mdxFiles
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

export function getAllRecipes(): Recipe[] {
  return getOrPopulateRecipes();
}

export function getAllCategories(): string[] {
  const allRecipes = getOrPopulateRecipes();
  const categories = new Set(allRecipes.map((recipe) => recipe.category));
  return Array.from(categories).sort();
}

export function getAllTags(): string[] {
  const allRecipes = getOrPopulateRecipes();
  const tags = new Set(allRecipes.flatMap((recipe) => recipe.tags));
  return Array.from(tags).sort();
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
