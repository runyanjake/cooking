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

The markdown controls the page: every tab is written in the file, in the order it appears, and the renderer adds, removes and reorders nothing.

The body uses [generic markdown directives](https://talk.commonmark.org/t/generic-directives-plugins-syntax/444). Each top-level container `:::name` … `:::` is a tab:

- Any name works, so custom tabs need no code: `:::equipment`
- The title comes from the name (`:::wine-pairing` → "Wine Pairing"); a label overrides it: `:::notes[Chef Tips]`
- The body is ordinary markdown. An image's title becomes its caption: `![Alt text](./assets/hero.jpg "Caption")`

Standard tabs are `:::photos`, `:::ingredients`, `:::instructions`, `:::notes`, `:::references`, and `:::card`. Only `card` has reserved behaviour.

Markdown before the first tab renders as intro prose above the tabs; markdown after the last tab renders as outro prose below. Prose between tabs is an error.

### Recipe card

`:::card[Recipe Card]` is a tab showing a printable 5×7 in PNG. Its body lists the one or two sections to print, left to right. `::name` reuses another tab, from anywhere in the file:

```md
:::card[Recipe Card]
::ingredients
::instructions
:::
```

A `:::name` block inside it is written just for the card, and can be mixed with references. The outer fence then needs **four** colons:

```md
::::card[Recipe Card]
::ingredients
:::instructions
1. Condensed step one.
2. Condensed step two.
:::
::::
```

Only what's listed is printed; images, tables and code are left out. The card uses one side when the text fits at 8pt or larger; otherwise it splits into a front (first section) and back (second section). The build fails if even front/back doesn't fit — write shorter content inside `:::card`.

### Validation

Duplicate tab names, a top-level leaf directive (`::notes`), an invalid card body, and a card listing a missing tab or nothing printable fail the build with the file. Since any name is a valid tab, a typo like `:::ingrediants` shows up as a misspelled tab rather than an error, and a card listing `::ingredients` then fails the build. `:word` inside prose (e.g. "Tip:Use") is left as literal text.

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

:::card[Recipe Card]
::ingredients
::instructions
:::

:::references
- Reference Recipe **[HERE](https://example.com)**
:::
```

## Image Paths

Images use relative paths: `./assets/image.jpg`

These are rewritten at render time to `/recipes/[category]/[slug]/assets/image.jpg` (from frontmatter category and slug, not the folder name).
