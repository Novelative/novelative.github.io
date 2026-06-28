# v0.1.7 Beta Website Release Info

## Summary

Updated the public website's release-specific content for `v0.1.7-beta` without adding new page sections or changing page layout. The download page now shows the June 20, 2026 release date, the current Windows installer size, and a short release summary. The release notes page now points to the `v0.1.7-beta` GitHub release URLs and summarizes the beta's main focus areas.

## Files Changed

- `src/components/DownloadPage.tsx` - Updated visible version, date, hero size, and release summary copy.
- `src/components/ReleaseNotesPage.tsx` - Updated current release version, release date copy, summary copy, and GitHub release links.
- `src/components/downloadLinks.ts` - Updated Windows displayed size and macOS public ARM installer filename/link.
- `Memory/changelog/2026-06-20-v017-beta-website-release-info.md` - Documented this release-content update.

## Reason

The site needed to reflect the new `v0.1.7-beta` public release while keeping the update limited to existing download and release notes surfaces.

## Verification

- Code review only, per the task instruction.

## Known Risks

- The macOS `v0.1.7-beta` user release was not live at edit time; the website now points to the expected `Novelative-Setup-arm64.dmg` asset name documented in the release runbook.
