import fs from 'fs';
import path from 'path';
import matter from 'gray-matter';

const recipesDirectory = path.join(process.cwd(), 'data/recipes');

// Cache to avoid repeated file system walks
let recipesCache: Recipe[] | null = null;

export interface RecipeMetadata {
  title: string;
  slug: string;
  date: string;
  lastUpdated: string;
  category: string;
  tags: string[];
  dietary: string[];
  cookTime: number;
  prepTime: number;
  totalTime: number;
  difficulty: string;
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

export function getRecipesByCategory(category: string): Recipe[] {
  const allRecipes = getOrPopulateRecipes();
  return allRecipes.filter((recipe) => recipe.category === category);
}

export function getRecipesByTag(tag: string): Recipe[] {
  const allRecipes = getOrPopulateRecipes();
  return allRecipes.filter((recipe) => recipe.tags.includes(tag));
}

export function getFeaturedRecipes(): Recipe[] {
  const allRecipes = getOrPopulateRecipes();
  return allRecipes.filter((recipe) => recipe.featured);
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

export function getRecipeBySlug(slug: string): Recipe | undefined {
  const allRecipes = getOrPopulateRecipes();
  return allRecipes.find((recipe) => recipe.slug === slug);
}

export function getRecipeByCategoryAndSlug(category: string, slug: string): Recipe | undefined {
  const allRecipes = getOrPopulateRecipes();
  return allRecipes.find((recipe) => recipe.category === category && recipe.slug === slug);
}

export function searchRecipes(query: string): Recipe[] {
  const allRecipes = getOrPopulateRecipes();
  const lowerQuery = query.toLowerCase();

  return allRecipes.filter((recipe) => {
    return (
      recipe.title.toLowerCase().includes(lowerQuery) ||
      recipe.description.toLowerCase().includes(lowerQuery) ||
      recipe.tags.some((tag) => tag.toLowerCase().includes(lowerQuery))
    );
  });
}

export function getAllRecipePaths(): Array<{ category: string; slug: string }> {
  const allRecipes = getOrPopulateRecipes();
  return allRecipes.map((recipe) => ({
    category: recipe.category,
    slug: recipe.slug,
  }));
}
