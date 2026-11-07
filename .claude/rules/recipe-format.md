# Recipe Markdown Format

Recipes are plain `.md` files (not MDX) at `recipes/[category]/[slug]/[slug].md`, parsed with remark + remark-gfm + remark-directive in `lib/recipe-content.ts`.

## Frontmatter Fields

```yaml
---
title: "Recipe Title"
slug: "recipe-slug"
date: "YYYY-MM-DD"
lastUpdated: "YYYY-MM-DD"
category: "mains"           # free-form string (e.g. "mains", "soups", "desserts")
tags: ["tag1", "tag2"]      # free-form strings (e.g. ["italian", "chicken"])
cookTime: 45                # minutes
prepTime: 20                # minutes
servings: 4
author: "PWS"               # ID from public/authors.json
description: "Short description for SEO and previews"
featured: false
display: true               # set to false to hide without deleting
displayPhoto: "./assets/hero.jpg"
---
```

## Content Structure

The body uses [generic markdown directives](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444):

- **Container** `:::name` … `:::` wraps a section of ordinary markdown
- **Leaf** `::name` on its own line inserts a generated object

### Sections (each becomes a tab, in this order)

- `:::photos` — images; the image title becomes the caption: `![Alt text](./assets/hero.jpg "Caption")`
- `:::ingredients` — bullet lists, optionally grouped with `###` subheadings
- `:::instructions` — numbered steps, optionally grouped with `###` subheadings
- `:::notes` — tips, variations, storage (optional)
- `:::references` — credits and sources (optional)

Markdown before the first section renders as intro prose above the tabs; markdown after the last section renders as outro prose below. Prose between sections is an error.

### Recipe card (opt in)

- `::card` adds a Recipe Card tab with a printable 5×7 in PNG generated from `:::ingredients` and `:::instructions`. The tab always sits after Notes and before References, wherever the directive appears in the file
- To give the card a shorter version, use the container form. The outer fence needs **four** colons; any section left out falls back to the full one:

```md
::::card
:::instructions
1. Condensed step one.
2. Condensed step two.
:::
::::
```

The card uses one side when the text fits at 8pt or larger; otherwise it splits into a front (ingredients) and back (instructions). The build fails if even front/back doesn't fit — add a `::::card` with shorter content.

### Validation

Unknown directives (e.g. `:::ingrediants`), duplicate sections, and a leaf form of a section (`::notes`) fail the build with the file and line. `:word` inside prose (e.g. "Tip:Use") is left as literal text.

### Example

```md
---
title: "Lentils"
description: "A neutral lentil dish."
...
---

This recipe uses brown lentils (whole Masoor Dal)...

:::photos
![Lentils](./assets/hero.jpg "Finished lentils")
:::

:::ingredients
- 1 cup brown lentils
:::

:::instructions
1. Rinse lentils...
:::

:::notes
### Tips
- Try with different lentils!
:::

:::references
- Reference Recipe **[HERE](https://example.com)**
:::

::card
```

## Image Paths

Images use relative paths: `./assets/image.jpg`

These are rewritten at render time to `/recipes/[category]/[slug]/assets/image.jpg` (from frontmatter category and slug, not the folder name).
