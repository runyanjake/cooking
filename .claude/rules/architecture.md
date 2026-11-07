# Component Architecture

## State and Data Flow

- **RecipeLayout** owns sidebar open/close state; passes `handleFilterChange` (memoised with `useCallback`) down to RecipesSidebar
- **Sidebar** is the generic shell: a modal drawer below `lg`, a sticky column at `lg`+. While open it locks page scroll, closes on Escape/overlay/resize to `lg`, and moves focus in (restoring it on close). Its body has `overscroll-contain` so drawer scrolling never chains to the page. `onClose` must be stable (`useCallback`) since its effects depend on it
- **RecipesSidebar** owns local UI state (debounced search input, tag filter text, show-more toggles) and reports filter changes via `onFilterChange`
- **RecipesClient** owns filter state (synced to the URL), the filtered recipe list, and facet counts (all memoised with `useMemo`). Each facet's counts apply every filter except its own; options with zero results are hidden
- **ActiveFilters** renders removable chips for the active filters above the results grid
- **Recipe page** gets the parsed `RecipeContent` from `getRecipeContent` (cached), renders each section with **RecipeMarkdown** (server), and passes them as tabs to **RecipeTabs** (client). All panels are in the HTML; inactive ones are `hidden`
- **Recipe card**: `getRecipeCardImages` computes the layout once per recipe; the page and the `card/[image]` route both use it, so the tab always matches the generated files. Layout measures real block heights with satori's `onNodeDetected`, so fitting is exact, not estimated

## Known Constraints

- Recipe image URLs are `/recipes/[category]/[slug]/assets/...` (from frontmatter, not the folder on disk). Use `resolveRecipeAssetUrl` from `lib/recipe-urls.ts` — never build them from `folderPath`, which can differ from category/slug and uses backslashes on Windows
- Recipe detail and asset routes set `dynamicParams = false`; everything is prerendered and the runtime image doesn't ship `recipes/`
- Paragraphs containing only images are converted to `<figure>` elements during parsing (caption from the image title), so there's no `<p><figure>` nesting
- Card fonts are read from `node_modules/@fontsource/*` at build time; satori needs woff/ttf (not woff2) and doesn't support variable fonts
- `lib/recipes.ts` uses Node.js `fs` — server-side only; never import in client components
- Build warnings about `<img>` vs `<Image />` in RecipeMarkdown and RecipeCardImage are intentional
- The About page is hand-written JSX, not markdown; it shares body typography with recipe tabs through `MARKDOWN_BODY_CLASSES`. Change spacing there rather than per page. Class strings must live in `components/` or `app/` — Tailwind doesn't scan `lib/`
- Never add redundant ARIA roles on semantic elements (`<main>`, `<aside>`, `<footer>` already carry implicit roles)
