# StorySpoon M2 — StoryBook Drop

This patch adds:
- Tailwind UI skin + brand colors (Peacock/ Phoenix/ Saffron/ Cream)
- Markdown StoryBook pipeline (front matter + sections)
- Library grid + Reader page with voice-control buttons
- Router integration
- Sample recipe: `web/content/masala_chai.md`

## Install
From repo root:
```bash
pnpm -F storyspoon-web add react-router-dom gray-matter marked classnames
pnpm -F storyspoon-web add -D tailwindcss postcss autoprefixer
# If tailwind.config.js wasn't generated before, it's included in this drop.
```

Ensure you import `./src/styles/globals.css` in `web/src/main.tsx` (already done).

Start dev:
```bash
pnpm dev
```

## Add your manuscript
Place your cookbook markdown into `web/content/*.md` with this structure:

---
id: unique-id
title: Recipe Title
author: Your Name
cuisine: Indian Fusion
difficulty: Easy
prepTime: 5
cookTime: 7
tags: [chai, tea]
cover: /covers/my_cover.jpg
story: |
  A short paragraph of background.
---

## Ingredients
- item one
- item two

## Steps
1. do this
2. do that

## Notes
anything optional

The Library will auto-index via `import.meta.glob`.
