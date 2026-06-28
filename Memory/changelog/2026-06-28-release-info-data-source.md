# Release Info Data Source

**Date:** 2026-06-28

## Summary
Moved website release-specific version, download, size, and release-note text into a single JSON data source at `src/content/releaseInfo.json`. The download page, release notes page, and shared download links now render from that data instead of duplicating release details in multiple components.

## Files Modified
- `src/content/releaseInfo.json` - Added the shared release data source.
- `src/components/downloadLinks.ts` - Reads installer URLs, filenames, versions, and sizes from release data.
- `src/components/DownloadPage.tsx` - Uses release data for hero platform info and latest-release copy.
- `src/components/ReleaseNotesPage.tsx` - Uses release data for release links, facts, heading, and summary.

## Reason
Release automation needs a single safe file to update after artifact publication. Keeping release values centralized reduces the chance that future releases update one website surface but leave another stale.

## Verification
Ran `npm run build` successfully.

## Known Risks
Future manual website edits should update `src/content/releaseInfo.json` rather than hardcoding release values in page components.
