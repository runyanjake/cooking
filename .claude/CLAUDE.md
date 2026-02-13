# Cooking Site — Project Context

## What This Is

A personal recipe website. Content-first, no-nonsense. The name of the third homepage illustration (`recipe_sites_suck.svg`) sums up the philosophy: no popups, no life stories, just recipes.

## Tech Stack

- **Next.js 15** with App Router, TypeScript, Tailwind CSS
- **MDX** for recipe content with YAML frontmatter
- **next-mdx-remote/rsc + remark-gfm** for compiling MDX content server-side
- **Static site generation (SSG)** — all pages are prerendered at build time
- **No database** — recipes are MDX files on disk

## Project Structure

```
app/                          # Next.js App Router pages
  page.tsx                    # Homepage (server component)
  layout.tsx                  # Root layout with Header/Footer
  recipes/
    page.tsx                  # Recipe listing (server, passes data to RecipesClient)
    [category]/[slug]/
      page.tsx                # Recipe detail (server, passes data to RecipePageClient)

components/
  Header.tsx / Footer.tsx     # Site chrome
  RecipesClient.tsx           # Recipe listing with filter state
  RecipeLayout.tsx            # Sidebar layout (mobile drawer, desktop persistent)
  RecipesSidebar.tsx          # Search + category + tag filters
  SelectedTags.tsx            # Active tag chips
  TagSelector.tsx             # Tag dropdown picker
  RecipeGridCard.tsx          # Recipe grid card for listing page
  RecipeCard.tsx              # MDX component — splits h2 children into tab sections
  RecipePageClient.tsx        # Recipe detail page wrapper (server component)

lib/
  recipes.ts                  # Recipe file loader with in-memory cache; reads from public/recipes/

public/
  assets/                     # Site-level images (homepage SVGs)
  authors.json                # Author metadata
  recipes/                    # ALL recipe content lives here (MDX + images together)
    [category]/
      recipe-slug/
        recipe-slug.mdx
        assets/
          hero.jpg
          ...
```

## Design Principles

- **Content first**: recipe pages are minimal — no sidebar, just the recipe
- **Server components by default**: only add `'use client'` when interactivity is needed
- **No taxonomy file**: categories and tags are derived directly from frontmatter across all recipes — no external registry to keep in sync
- **Single content location**: MDX and images are colocated in `public/recipes/` so they can be served directly without a copy step
