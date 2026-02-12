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

## Content Sections

Content uses `## ` (h2) headings to define tabs rendered in the UI:

- `## Photos` — images with italic captions (`*caption text*`)
- `## Ingredients` — bullet lists, optionally grouped with h3 subheadings
- `## Instructions` — numbered steps, optionally grouped with h3 subheadings
- `## Notes` — tips, variations, storage (optional)
- `## References` — credits and sources (optional)

## Image Paths

Images use relative paths: `./assets/image.jpg`

These are rewritten at render time to `/recipes/[category]/[slug]/assets/image.jpg`.

## Italic Captions in Photos Section

Italic text (`*caption*`) in the `## Photos` section renders as a styled block caption beneath images. In all other sections, italic renders normally.
