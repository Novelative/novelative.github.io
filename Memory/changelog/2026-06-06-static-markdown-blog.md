# Static Markdown Blog

**Date:** 2026-06-06
**Agent:** Codex

## Summary

The blog page now loads posts from local Markdown files at build time instead of fetching posts from the Supabase-backed `/api/posts` endpoint. The existing blog presentation and Markdown renderer remain in place, but the data source is now static and bundled with the site.

## Files Modified

- `src/components/BlogPage.tsx` - Removed runtime API loading, switched to imported local post data, and updated empty/archive copy for static Markdown posts.
- `src/styles.css` - Removed the now-unused blog loading card styles from the old runtime fetch flow.
- `src/content/blogPosts.ts` - Added a build-time Markdown loader with simple front matter parsing, slug/title fallback handling, duplicate title-heading cleanup, and date sorting.
- `src/content/blog/README.md` - Documented where to add `.md` posts and which front matter fields are supported.
- `src/content/blog/posts/.gitkeep` - Added the post folder so it exists before the first blog post is created.
- `src/vite-env.d.ts` - Added Vite client types for `import.meta.glob`.
- `functions/api/posts.js` - Removed the Supabase-backed blog API endpoint.
- `Memory/changelog/2026-06-06-static-markdown-blog.md` - Documented this change.

## Why

The website is static, and the blog should be maintained like the rest of the site without Supabase or another third-party content service. Markdown files can now be added to the repository and published with the normal site build/deploy flow.

## Verification

- Code review only, per repository instruction for this request.

## Risks

- Posts are bundled at build time, so adding or changing Markdown files requires redeploying the site.
- The front matter parser intentionally supports simple `key: value` fields only; complex YAML structures are not supported.
