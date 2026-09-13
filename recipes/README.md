# Recipe Content Structure

This directory contains all recipe content for the cooking website.

## Folder Organization

```
recipes/
├── appetizers/
├── mains/
├── desserts/
├── sides/
├── beverages/
└── breads/
```

Each recipe follows this structure:
```
recipes/category/
└── recipe-slug/
    ├── recipe-slug.md
    └── assets/
        ├── hero.jpg
        ├── step1.jpg
        └── ...
```

**Note:** All recipe content (markdown files and images) lives together in the top-level `recipes/` folder for better organization and readability. This keeps everything for a recipe in one place.

## Recipe Format

### File Structure

The `.md` file contains all recipe metadata and content in one place.

#### Frontmatter (Required)

All recipe metadata is stored in YAML frontmatter at the top of the file:

```yaml
---
title: "Recipe Title"
slug: "recipe-slug"
date: "YYYY-MM-DD"
lastUpdated: "YYYY-MM-DD"
category: "mains"
tags: ["tag1", "tag2", "tag3"]
cookTime: 45
prepTime: 20
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
- `cookTime` - Active cooking time in minutes
- `prepTime` - Preparation time in minutes
- `servings` - Number of servings
- `author` - Author ID (references `public/authors.json`)
- `description` - Brief description for SEO and cards
- `featured` - Boolean for homepage featuring
- `display` - Boolean to control visibility (set to false to hide recipe)
- `displayPhoto` - Relative path to display photo (e.g., "./assets/hero.jpg")

**Note:** Author IDs must match entries in `public/authors.json`. Categories and tags are free-form strings — there is no taxonomy registry file.

#### Content Sections

Content is plain markdown, divided into sections with directives. Each `:::name` … `:::` block becomes a tab:

1. **`:::photos`** - Recipe images; the image title is the caption: `![Alt](./assets/hero.jpg "Caption")`
2. **`:::ingredients`** - Lists of ingredients (can use `###` subsections)
3. **`:::instructions`** - Step-by-step cooking instructions (can use `###` subsections)
4. **`:::notes`** - Tips, variations, storage info (optional)
5. **`:::references`** - Sources, inspirations, credits (optional)

Markdown before the first section is intro prose; markdown after the last is outro prose.

#### Recipe Card (optional)

Add `::card` on its own line for a **Recipe Card** tab: a 5×7 in, 300 DPI PNG built from the ingredients and instructions, ready to download or print. Long recipes are split into a front and back automatically.

To put a shorter version on the card, use the container form with **four** colons. Leave out a section to use the full one:

```md
::::card
:::ingredients
- 2 cups flour
- 1 cup sugar
:::
::::
```

#### Example Recipe

```md
---
title: "Recipe Name"
slug: "recipe-name"
date: "2026-02-08"
lastUpdated: "2026-02-08"
category: "mains"
tags: ["italian", "chicken"]
cookTime: 45
prepTime: 20
servings: 4
author: "PWS"
description: "Short description for SEO and previews"
featured: false
display: true
displayPhoto: "./assets/hero.jpg"
---

Introduction paragraph about the recipe.

:::photos
![Hero image](./assets/hero.jpg "Caption describing the image")

![Step photo](./assets/step1.jpg "Another helpful image")
:::

:::ingredients
### For the Main Component
- 2 cups ingredient one
- 1 tablespoon ingredient two

### For the Sauce
- 1 cup sauce base
:::

:::instructions
### Preparation
1. **Step name**: Detailed instruction with technique.
2. **Another step**: More details here.

### Cooking
1. **Heat and cook**: Continue with numbered steps.
:::

:::notes
### Storage
- How to store leftovers
:::

:::references
- Source credits
:::

::card
```

Typos in directive names (e.g. `:::ingrediants`) fail the build with the file and line number.

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

## Adding New Recipes

1. Create recipe folder: `recipes/[category]/recipe-name/`
2. Create `recipe-name.md` with frontmatter and content
3. Create `assets/` subfolder for images
4. Add images to the `assets/` folder
5. Reference images using relative paths: `./assets/image.jpg`
6. Build locally to verify rendering
7. Commit and push (everything is tracked in git)

## Best Practices

- Keep slugs URL-friendly (lowercase, hyphens)
- Optimize images before adding (compress, resize)
- Test recipes before publishing
- Include metric and imperial measurements when possible
- Credit sources and inspirations
- Update featured flag sparingly (limit to 3-5 recipes)
