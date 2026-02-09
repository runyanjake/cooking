# Data Directory

This directory contains all content and reference data for the cooking website.

## Directory Structure

```
data/
├── README.md           # This file
├── authors.json        # Author profiles and information
├── taxonomy.json       # Categories, tags, and classification system
└── recipes/           # Recipe content
    ├── README.md
    ├── examples/
    ├── appetizers/
    ├── mains/
    ├── desserts/
    ├── sides/
    ├── beverages/
    └── breads/
```

## Reference Files

### authors.json

Contains author profiles with biographical information, social links, and specialties.

**Structure:**
```json
{
  "authors": [
    {
      "id": "pws",
      "name": "PWS",
      "fullName": "Paul Wilson Smith",
      "bio": "Short biography",
      "email": "email@example.com",
      "website": "https://...",
      "avatar": "/images/authors/pws.jpg",
      "social": {
        "github": "username"
      },
      "joinDate": "2026-01-01",
      "specialties": ["Italian cuisine", "Baking"],
      "favoriteIngredient": "Garlic"
    }
  ]
}
```

**Usage in recipes:**
- Reference the author by their `id` in the recipe frontmatter
- Example: `author: "pws"`
- The site will look up full author details from this file

### taxonomy.json

Defines the complete taxonomy system for organizing recipes.

**Contains:**
1. **Categories** - Main recipe classifications (appetizers, mains, desserts, etc.)
2. **Tags** - Organized by type:
   - `cuisine` - Italian, Mexican, Asian, etc.
   - `protein` - Chicken, beef, vegetarian, etc.
   - `dietary` - Gluten-free, vegan, keto, etc.
   - `meal-type` - Breakfast, lunch, dinner, etc.
   - `occasion` - Weeknight, holiday, party, etc.
   - `cooking-method` - Baking, grilling, slow-cooker, etc.
   - `speed` - Quick-meals, one-pot, make-ahead, etc.
   - `flavor-profile` - Spicy, sweet, savory, etc.
   - `special` - Chocolate, pasta, soup, etc.
3. **Difficulty** - Easy, medium, hard with descriptions

**Usage in recipes:**
- Use tag IDs from this file in recipe frontmatter
- Example: `tags: ["italian", "chicken", "comfort-food"]`
- Example: `category: "mains"`
- Example: `difficulty: "medium"`
- The site can validate tags against this taxonomy

## Benefits of Reference Files

### Consistency
- Ensures uniform spelling and naming across all recipes
- Prevents duplicate tags with slight variations
- Maintains standardized author information

### Validation
- Can validate recipe frontmatter against these schemas
- Catch typos and invalid values during build
- Provide helpful error messages

### UI Generation
- Generate filter dropdowns from taxonomy
- Display tag descriptions and icons
- Show author bios and links automatically

### Scalability
- Easy to add new authors, tags, or categories
- Central place to update descriptions and metadata
- Supports multiple authors and contributors

### SEO & Discovery
- Structured data for search engines
- Consistent taxonomy improves findability
- Tag descriptions enhance metadata

## Adding New Entries

### Adding an Author

1. Open `data/authors.json`
2. Add a new author object to the `authors` array
3. Ensure the `id` is unique and lowercase-hyphenated
4. Add avatar image to `/public/images/authors/`
5. Reference the author ID in recipe frontmatter

### Adding a Tag

1. Open `data/taxonomy.json`
2. Find the appropriate tag category (cuisine, protein, etc.)
3. Add a new tag object with `id`, `name`, and `description`
4. Use the tag ID in recipe frontmatter

### Adding a Category

1. Open `data/taxonomy.json`
2. Add a new category to the `categories` array
3. Create the corresponding folder in `data/recipes/`
4. Use the category ID in recipe frontmatter

## Best Practices

- Always reference tags/categories/authors by their `id`
- Keep IDs lowercase with hyphens (kebab-case)
- Write clear, helpful descriptions
- Add emojis to categories for visual interest
- Update both reference files and recipes together
- Validate changes before committing
