# Recipe MDX Format

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

Content after frontmatter is compiled as MDX using `next-mdx-remote/rsc`. The `<RecipeCard>` JSX component wraps recipe sections and renders them as tabs in the UI.

- Markdown **before** `<RecipeCard>` renders as intro prose above the recipe card
- Markdown **after** `</RecipeCard>` renders as outro prose below the recipe card
- **Important**: a blank line after `<RecipeCard>` is required for MDX to parse the content inside as markdown

### `<RecipeCard>` Sections

`## ` (H2) headings inside `<RecipeCard>` define tabs:

- `## Photos` — images with italic captions (`*caption text*`)
- `## Ingredients` — bullet lists, optionally grouped with h3 subheadings
- `## Instructions` — numbered steps, optionally grouped with h3 subheadings
- `## Notes` — tips, variations, storage (optional)
- `## References` — credits and sources (optional)

### Example

```mdx
---
title: "Lentils"
description: "A neutral lentil dish."
...
---

This recipe uses brown lentils (whole Masoor Dal)...

<RecipeCard>

## Photos
![Hero](./assets/hero.jpg)
*Finished lentils*

## Ingredients
- 1 cup brown lentils
...

## Instructions
1. Rinse lentils...
...

## Notes
### Tips
- Try with different lentils!

## References
- Reference Recipe **[HERE](https://example.com)**

</RecipeCard>
```

## Image Paths

Images use relative paths: `./assets/image.jpg`

These are rewritten at render time to `/recipes/[category]/[slug]/assets/image.jpg`.

## Italic Captions in Photos Section

Italic text (`*caption*`) in the `## Photos` section renders as a styled block caption beneath images. In all other sections, italic renders normally.
