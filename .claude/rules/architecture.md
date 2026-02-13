# Component Architecture

## State and Data Flow

- **RecipeLayout** owns sidebar open/close state; passes `handleFilterChange` (memoised with `useCallback`) down to RecipesSidebar
- **RecipesSidebar** owns filter state (search, category, selectedTags) and reports changes via `useEffect` → `onFilterChange`
- **RecipesClient** owns filtered recipe list (memoised with `useMemo`) and passes `setFilters` as `onFilterChange`
- **RecipeCard** (MDX component) receives compiled children, splits by h2 into tab sections; custom `img` component in page.tsx rewrites `./` paths to `/recipes/[folderPath]/`

## Known Constraints

- `folderPath` in recipe metadata uses backslashes on Windows (from `path.join`) — always `.replace(/\\/g, '/')` before using in URLs
- Images in recipe MDX are wrapped in `<p>` by MDX compilation — use `<img>` not `<figure>` to avoid invalid HTML nesting (`<p><figure>` is invalid)
- `lib/recipes.ts` uses Node.js `fs` — server-side only; never import in client components
- Build warning about `<img>` vs `<Image />` in recipe pages is intentional — markdown images can't use Next.js Image component
- Never add redundant ARIA roles on semantic elements (`<main>`, `<aside>`, `<footer>` already carry implicit roles)
