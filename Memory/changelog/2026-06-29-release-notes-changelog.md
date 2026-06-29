# Release Notes Changelog

**Date:** 2026-06-29

## Summary
Added a version history changelog to the release notes page. The page now keeps the existing current-release and release-facts panels, then adds a dedicated changelog section with one entry per documented public beta version.

## Files Changed
- `src/components/ReleaseNotesPage.tsx` - Added page-local changelog data and rendered the Version History section on the release notes page.
- `src/styles.css` - Added responsive release changelog, heading, metadata, and bullet-list styles using the existing theme variables.
- `Memory/changelog/2026-06-29-release-notes-changelog.md` - Documented this change.

## Reason
The release notes page needed a true changelog instead of only showing the current beta release details. Each documented release version now has its own visible section for visitors scanning product history.

## Verification
- Code review only, per the task instruction.

## Known Risks
- Historical entries are limited to versions documented in this website repository and git history. The GitHub release API was not accessible from this environment, so any private or unpublished release notes outside this repo were not imported.