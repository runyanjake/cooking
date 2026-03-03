# cooking

A content-first personal recipe site. No popups, no life stories — just recipes.

**Live site:** [recipes.whitney.rip](https://recipes.whitney.rip)

## Stack

- **Next.js 15** (App Router, SSG, standalone output)
- **TypeScript** + **Tailwind CSS**
- **MDX** with YAML frontmatter for recipe content
- **next-mdx-remote/rsc** + **remark-gfm** for server-side MDX compilation
- No database — recipes are MDX files on disk

## Project Structure

```
app/                          # Next.js App Router pages
  page.tsx                    # Homepage
  recipes/
    page.tsx                  # Recipe listing with search/filter
    [category]/[slug]/
      page.tsx                # Recipe detail page

components/                   # UI components
lib/
  recipes.ts                  # Recipe loader (reads from public/recipes/)

public/
  assets/                     # Site-level SVGs
  authors.json                # Author metadata
  recipes/                    # All recipe content (MDX + images colocated)
    [category]/
      [slug]/
        [slug].mdx
        assets/
          hero.jpg
```

## Adding a Recipe

1. Create a folder: `public/recipes/[category]/[recipe-slug]/`
2. Add `[recipe-slug].mdx` with frontmatter and content
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

Wrap recipe content in `<RecipeCard>` — `## ` headings inside it become tabs:

```mdx
Intro prose (rendered above the card).

<RecipeCard>

## Photos
![Finished dish](./assets/hero.jpg)
*Caption text*

## Ingredients
- 1 cup lentils

## Instructions
1. Rinse and cook.

## Notes
Optional tips.

## References
Optional credits.
</RecipeCard>
```

## Development

```bash
npm install
npm run dev       # http://localhost:3000
npm run build
npm run lint
```

## Docker

Build and run with Docker Compose (deploys behind a Traefik reverse proxy):

```bash
docker compose up -d --build
```

To rebuild from scratch:

```bash
docker compose down && docker system prune -f && docker compose up -d --build && docker logs -f recipes
```

The container runs on port 3000. Traefik handles TLS termination via Let's Encrypt.
