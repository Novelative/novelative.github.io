# Release Notes Page Recreation

**Date:** 2026-05-07
**Agent:** Codex

## Summary

The old static `release-notes.html` page was recreated in the new React/Vite website as a standalone route component. The new page preserves the old content structure: a changelog hero, the current `Novelative v0.1.5-beta` release summary, Windows and macOS GitHub release links, release facts, and support cards for download sources, install help, and product updates.

The manual route map in `src/App.tsx` now recognizes `/release-notes` and `/release-notes.html`. Legacy `.html` aliases were also added for the already-recreated home, download, purchase, and blog pages so old static-site links resolve into the new React pages.

## Files Modified

- `src/components/ReleaseNotesPage.tsx` - Added the release notes route component and page-local release data.
- `src/App.tsx` - Imported the release notes component, added the `releaseNotes` route state, set the page title, rendered the route, and added legacy aliases for recreated pages.
- `src/styles.css` - Added release notes hero, current release, facts, card grid, link, and responsive styles.
- `Memory/changelog/2026-05-07-release-notes-page-recreation.md` - Documented the recreated page and routing aliases.

## Why

The old static site still had `release-notes.html`, and the new site linked to `/release-notes` from the footer, purchase page, and download page. Without a React route, that URL fell through to the homepage. Recreating it completes the remaining old page migration except for the features page, which the user explicitly excluded.

## Verification

- Ran `npm run build` successfully.
- Checked `/release-notes` and `/release-notes.html` return `200` from the local Vite server.
- Captured a local browser screenshot of `/release-notes` for visual review.

## Risks

The features page remains intentionally unrecreated. `/features` and `/features.html` still need a dedicated implementation later.
