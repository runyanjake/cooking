# Cooking Site — Project Context

## What This Is

A personal recipe website. Content-first, no-nonsense. The name of the third homepage illustration (`recipe_sites_suck.svg`) sums up the philosophy: no popups, no life stories, just recipes.

## Tech Stack

- **Next.js 15** with App Router, TypeScript, Tailwind CSS
- **Markdown** (`.md`) for recipe content with YAML frontmatter; every tab is a markdown directive (`:::ingredients`, `:::card`)
- **unified + remark-gfm + remark-directive** to parse content server-side; `mdast-util-to-hast` + `hast-util-to-jsx-runtime` to render React
- **satori + sharp** to generate printable recipe card PNGs at build time
- **Static site generation (SSG)** — all pages are prerendered at build time
- **No database** — recipes are markdown files on disk

## Project Structure

```
app/                          # Next.js App Router pages
  page.tsx                    # Homepage (server component)
  layout.tsx                  # Root layout with Header/Footer
  recipes/
    page.tsx                  # Recipe listing (server, passes data to RecipesClient)
    [category]/[slug]/
      page.tsx                # Recipe detail (server, renders the markdown's tabs via RecipePageLayout)
      assets/[...file]/
        route.ts              # Serves recipe images from recipes/ (prerendered at build)
      card/[image]/
        route.ts              # Recipe card PNGs (card.png, or front.png + back.png)

components/
  Header.tsx / Footer.tsx     # Site chrome
  RecipesClient.tsx           # Recipe listing with filter state
  RecipeLayout.tsx            # Recipe listing layout: filter button, Sidebar + results
  Sidebar.tsx                 # Responsive sidebar shell (mobile drawer, desktop sticky column)
  RecipesSidebar.tsx          # Search + category/tag facet lists with result counts
  FacetGroup.tsx              # Collapsible sidebar facet section
  ActiveFilters.tsx           # Removable chips for active filters (above results)
  RecipeGridCard.tsx          # Recipe grid card for listing page
  RecipeTabs.tsx              # Tabbed recipe sections (client)
  RecipeMarkdown.tsx          # Renders a parsed markdown tree to React (server)
  markdown-styles.ts          # Shared body typography classes (recipe tabs, About page)
  RecipeCardPanel.tsx         # Recipe Card tab: card image previews (server)
  RecipeCardImage.tsx         # Card preview that enlarges to full screen on click (client)
  RecipePageLayout.tsx        # Recipe detail page layout (server component)

lib/
  recipes.ts                  # Recipe file loader with in-memory cache; reads from recipes/
  recipe-content.ts           # Parses a recipe body into intro / tabs / outro; validates directives
  recipe-content.test.ts      # Format tests; also parses every real recipe (npm test)
  recipe-card.tsx             # Card layout (measured with satori) and PNG rendering
  recipe-urls.ts              # Client-safe helper that maps ./assets/ paths to served URLs
  format.ts                   # Client-safe display formatting (capitalize categories/tags)

recipes/                      # ALL recipe content lives here (markdown + images together)
  [category]/
    recipe-slug/
      recipe-slug.md
      assets/
        hero.jpg
        ...

public/
  assets/                     # Site-level images (homepage SVGs)
  authors.json                # Author metadata
```

## Design Principles

- **Content first**: recipe pages are minimal — no sidebar, just the recipe
- **Server components by default**: only add `'use client'` when interactivity is needed
- **The markdown is the recipe**: tabs, their titles and order, and what the card prints are all written in the `.md` file. The renderer only turns what's written into the page; never add hardcoded tab names, ordering, or fallbacks
- **No taxonomy file**: categories and tags are derived directly from frontmatter across all recipes — no external registry to keep in sync. They stay lowercase in frontmatter and URLs; display them through `capitalize` from `lib/format.ts`
- **Content is top level**: markdown and images are colocated in `recipes/`; images are served by a statically prerendered route handler, so there's no copy step. `public/` is only for site branding and data
