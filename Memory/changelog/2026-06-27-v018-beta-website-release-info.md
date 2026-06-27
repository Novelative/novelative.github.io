# v0.1.8 Beta Website Release Info

**Date:** 2026-06-27

## Summary
Updated release-specific website content for `v0.1.8-beta`. The download page now shows the Windows `v0.1.8-beta` release date and summary while keeping the macOS download on the latest published Mac build. The release notes page now links the Windows release button to the `v0.1.8-beta` GitHub release and clearly states that macOS remains on `v0.1.7-beta` until a Mac build is published.

## Files Modified
- `src/components/DownloadPage.tsx` - Updated visible Windows version, release date, hero version display, and release summary copy.
- `src/components/ReleaseNotesPage.tsx` - Updated Windows release link, current release heading, release summary, and latest-build facts.
- `src/components/downloadLinks.ts` - Keeps public download URLs aligned with the published installer filenames.

## Reason
Only the Windows release artifacts were built and published from this Windows release machine. The public site needed to reflect the new Windows release without pointing visitors to non-existent Mac `v0.1.8-beta` release pages.

## Verification
Ran `npm audit` after dependency remediation and confirmed zero vulnerabilities. Ran `npm run build` successfully.

## Known Risks
The website should be updated again after the Mac `v0.1.8-beta` release is built and published.
