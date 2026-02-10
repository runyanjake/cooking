# Recipe Content Structure

This directory contains all recipe content for the cooking website.

## Folder Organization

```
public/recipes/
├── appetizers/
├── mains/
├── desserts/
├── sides/
├── beverages/
└── breads/
```

Each recipe follows this structure:
```
public/recipes/category/
└── recipe-slug/
    ├── recipe-slug.mdx
    └── assets/
        ├── hero.jpg
        ├── step1.jpg
        └── ...
```

**Note:** All recipe content (MDX files and images) lives together in `public/recipes/` for better organization and readability. This keeps everything for a recipe in one place.

## Recipe Format

### MDX File Structure

The `.mdx` file contains all recipe metadata and content in one place.

#### Frontmatter (Required)

All recipe metadata is stored in YAML frontmatter at the top of the MDX file:

```yaml
---
title: "Recipe Title"
slug: "recipe-slug"
date: "YYYY-MM-DD"
lastUpdated: "YYYY-MM-DD"
category: "mains"
tags: ["tag1", "tag2", "tag3"]
dietary: ["vegetarian", "gluten-free"]
cookTime: 45
prepTime: 20
totalTime: 65
difficulty: "easy"
servings: 4
author: "Author Name"
description: "Short description for SEO and previews"
featured: true
display: true
displayPhoto: "./assets/hero.jpg"
---
```

**Frontmatter Fields:**
- `title` - Display title of the recipe
- `slug` - URL-friendly identifier
- `date` - Publication date (YYYY-MM-DD)
- `lastUpdated` - Last modification date (YYYY-MM-DD)
- `category` - Main category (free-form string, e.g. "mains", "soups")
- `tags` - Array of tags (free-form strings, e.g. ["italian", "chicken"])
- `dietary` - Array of dietary tags (free-form strings, e.g. ["gluten-free"])
- `cookTime` - Active cooking time in minutes
- `prepTime` - Preparation time in minutes
- `totalTime` - Total time in minutes
- `difficulty` - Difficulty level: easy, medium, or hard
- `servings` - Number of servings
- `author` - Author ID (references `public/authors.json`)
- `description` - Brief description for SEO and cards
- `featured` - Boolean for homepage featuring
- `display` - Boolean to control visibility (set to false to hide recipe)
- `displayPhoto` - Relative path to display photo (e.g., "./assets/hero.jpg")

**Note:** Author IDs must match entries in `public/authors.json`. Categories, tags, dietary, and difficulty are free-form strings — there is no taxonomy registry file.

#### Content Sections

The following `## ` (h2) sections are parsed into tabs in the UI:

1. **## Photos** - Recipe images with captions
2. **## Ingredients** - Lists of ingredients (can use h3 subsections)
3. **## Instructions** - Step-by-step cooking instructions
4. **## Notes** - Tips, variations, storage info (optional)
5. **## References** - Sources, inspirations, credits (optional)

#### Example MDX Structure

```mdx
---
title: "Recipe Name"
slug: "recipe-name"
date: "2026-02-08"
lastUpdated: "2026-02-08"
category: "mains"
tags: ["italian", "chicken"]
dietary: ["gluten-free-option"]
cookTime: 45
prepTime: 20
totalTime: 65
difficulty: "medium"
servings: 4
author: "PWS"
description: "Short description for SEO and previews"
featured: false
display: true
displayPhoto: "./assets/hero.jpg"
---

# Recipe Name

Introduction paragraph about the recipe.

## Photos

![Hero image](./assets/hero.jpg)
*Caption describing the image*

![Step photo](./assets/step1.jpg)
*Another helpful image*

## Ingredients

### For the Main Component
- 2 cups ingredient one
- 1 tablespoon ingredient two
- Salt and pepper to taste

### For the Sauce
- 1 cup sauce base
- Seasonings

## Instructions

### Preparation
1. **Step name**: Detailed instruction with technique.
2. **Another step**: More details here.

### Cooking
3. **Heat and cook**: Continue with numbered steps.
4. **Finish**: Final steps.

## Notes

### Tips for Success
- Helpful tip one
- Helpful tip two

### Storage
- How to store leftovers
- Freezing instructions

### Variations
- How to adapt the recipe

## References

- Source credits
- Inspiration mentions
- Cookbook references
```

## Content Guidelines

### Writing Style
- Use clear, conversational language
- Include helpful tips and context
- Explain techniques for beginners
- Add timing and temperature details

### Photography
- Include hero shot (main finished dish)
- Add process shots for complex steps
- Use descriptive alt text for accessibility
- Optimize images (web-friendly sizes)

### Tags
Choose from these categories:
- **Cuisine**: italian, mexican, asian, american, mediterranean, etc.
- **Protein**: chicken, beef, pork, seafood, vegetarian, vegan
- **Meal Type**: breakfast, lunch, dinner, snack, appetizer
- **Occasion**: weeknight, holiday, party, comfort-food
- **Dietary**: gluten-free, dairy-free, low-carb, keto, paleo
- **Cooking Method**: baking, grilling, slow-cooker, instant-pot
- **Speed**: quick-meals, one-pot, make-ahead, no-cook

### Difficulty Levels
- **easy**: Beginner-friendly, simple techniques, common ingredients
- **medium**: Some cooking experience needed, multiple steps
- **hard**: Advanced techniques, precise timing, specialty equipment

## Adding New Recipes

1. Create recipe folder: `public/recipes/[category]/recipe-name/`
2. Create `recipe-name.mdx` with frontmatter and content
3. Create `assets/` subfolder for images
4. Add images to the `assets/` folder
5. Reference images in MDX using relative paths: `./assets/image.jpg`
6. Build locally to verify rendering
7. Commit and push (everything is tracked in git)

## Best Practices

- Keep slugs URL-friendly (lowercase, hyphens)
- Optimize images before adding (compress, resize)
- Test recipes before publishing
- Include metric and imperial measurements when possible
- Credit sources and inspirations
- Update featured flag sparingly (limit to 3-5 recipes)
