# Download Click Analytics Events

## Summary

Added a shared download click analytics helper and wired it to every direct
installer download surface on the website. Installer clicks now push a
`download_click` event into the Google Tag Manager data layer with platform,
source page, button location, file, URL, version, and link text metadata. Normal
left-click navigation is delayed briefly with a GTM event callback/fallback timeout
so the analytics event is less likely to be dropped before the GitHub download
navigation starts.

## Files Changed

- `src/downloadAnalytics.ts` - Added the shared `trackDownloadClick` helper and
  the GTM data layer event payload shape plus the guarded link-click handler.
- `src/components/downloadLinks.ts` - Added stable `platformKey` values for
  Windows and Mac builds so analytics events can report platforms consistently.
- `src/components/DownloadPage.tsx` - Tracked the hero installer button and the
  release-card installer links on the download page.
- `src/App.tsx` - Tracked the homepage final CTA installer buttons.
- `src/components/PurchasePage.tsx` - Tracked the purchase-page installer links.
- `Memory/changelog/2026-06-28-download-click-analytics.md` - Documented this
  analytics instrumentation change.

## Reason

Download clicks need to appear in Google Analytics with enough context to tell
which installer button was clicked, such as Mac from the download page or
Windows from the homepage CTA.

## Verification

Code review only, following the root instruction that no verification beyond
code review is needed for this change. `npm run build` was not run.

## Known Risks

- The website now pushes `download_click` events, but Google Tag Manager still
  needs a Custom Event trigger and GA4 Event tag before the events appear in
  Google Analytics.
- Event reporting remains subject to the site's existing analytics consent flow
  and the user's browser/privacy settings.