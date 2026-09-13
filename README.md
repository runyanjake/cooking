# cooking

A content-first personal recipe site.

**Live site:** [recipes.whitney.rip](https://recipes.whitney.rip)

## Stack

- **Next.js**, **TypeScript** + **Tailwind CSS**
- **Markdown** with YAML frontmatter metadata, using directives (`:::ingredients`) for recipe sections.
- **remark** (+ gfm, directive) for server-side parsing; **satori** + **sharp** for printable recipe cards.
- No database — recipes are checked into the repo.

## Project Structure

```
app/
  page.tsx                    # Homepage
  recipes/
    page.tsx                  # Recipe listing with search/filter
    [category]/[slug]/
      page.tsx                # Recipe detail page

components/                   # UI components
lib/
  recipes.ts                  # Recipe loader (reads from recipes/)

recipes/                      # All recipe content (markdown + images colocated)
  [category]/
    [slug]/
      [slug].md
      assets/
        hero.jpg

public/
  assets/                     # Site-level data.
  authors.json                # Author metadata
```

## Adding a Recipe

1. Create a folder: `recipes/[category]/[recipe-slug]/`
2. Add `[recipe-slug].md` with frontmatter and content
3. Create an `assets/` subfolder and add images
4. Reference images with relative paths: `./assets/image.jpg`

### Frontmatter

```yaml
---
title: "Recipe Title"
slug: "recipe-slug"
date: "YYYY-MM-DD"
lastUpdated: "YYYY-MM-DD"
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
```

`display: false` hides a recipe without deleting it. Author IDs reference `public/authors.json`. Categories and tags are free-form strings — no taxonomy file to keep in sync.

### Content Structure

Each `:::section` block becomes a tab. Add `::card` for a printable 5×7 recipe card tab:

```md
Intro prose (rendered above the tabs).

:::photos
![Finished dish](./assets/hero.jpg "Caption text")
:::

:::ingredients
- 1 cup short grain rice
:::

:::instructions
1. Rinse and cook.
:::

:::notes
Optional tips.
:::

:::references
Optional credits.
:::

::card
```

If a recipe is too long for the card, it's split front/back automatically. To write a shorter card instead, use `::::card` (four colons) containing its own `:::ingredients` and/or `:::instructions`. See `.claude/rules/recipe-format.md` for the full format.

## Development

```bash
npm install
npm run dev       # 3000
npm run build
npm run lint
```

## Deployment

```bash
docker compose down && docker system prune -f && docker compose up -d --build && docker logs -f recipes
```

