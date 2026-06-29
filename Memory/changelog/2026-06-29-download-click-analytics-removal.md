# Download Click Analytics Retained

## Summary

A previous removal pass was interrupted and then reversed. The website-side
download click analytics implementation is being kept.

## Current State

- `src/downloadAnalytics.ts` remains present.
- Direct installer links on the homepage, download page, and purchase page still
  call the shared download tracking helper.
- The site still pushes `download_click` events to the Google Tag Manager data
  layer.

## Verification

Code review only, following the root instruction that no verification beyond
code review is needed for this change. `npm run build` was not run.

## Known Risks

- Google Tag Manager and Google Analytics still need to be configured to consume
  the `download_click` data layer event.