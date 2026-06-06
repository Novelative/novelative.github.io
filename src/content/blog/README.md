# Blog Posts

Create blog posts as Markdown files in `src/content/blog/posts`.

Each post can include front matter at the top:

```md
---
title: "Writing Better Character Arcs"
slug: "writing-better-character-arcs"
date: "2026-06-06"
excerpt: "A short summary shown in blog cards."
---

Your Markdown post content starts here.
```

## Supported Fields

- `title` - The post title. If omitted, the first `# Heading` or file name is used.
- `slug` - Optional URL slug. If omitted, the title or file name is used.
- `date` - Publication date. Also accepts `created_at`.
- `excerpt` - Optional card and article summary. If omitted, one is generated from the content.

Posts are imported at build time, so redeploy the site after adding or editing `.md` files.
