# Cookie Consent Implementation

## Summary

Added a consent-gated cookie and tracking flow for the website. Google Analytics,
Reddit Pixel, and Lemon Squeezy affiliate tracking no longer load from the
static document head before the visitor makes a privacy choice.

## Files Changed

- `.env.example` - Documents the `VITE_REDDIT_PIXEL_ID` deployment setting used
  by the consent-gated Reddit Pixel loader.
- `index.html` - Removed eager Google Analytics and Lemon Squeezy affiliate
  scripts from the head.
- `src/analyticsConsent.ts` - Added local consent persistence, Google Consent
  Mode v2 defaults and updates, Global Privacy Control handling, consent-gated
  script loading, and best-effort cleanup for analytics and marketing cookies.
- `src/components/CookieConsent.tsx` - Added the banner and settings dialog for
  accept, reject, granular choices, and later preference changes. First-time
  visitors now see the banner after 50% scroll depth or a short fallback delay
  instead of immediately on page load.
- `src/App.tsx` - Wired the consent component into the app shell and added the
  footer entry point for reopening privacy choices.
- `src/components/StaticPages.tsx` - Updated privacy policy copy to disclose
  Google Analytics, Reddit Pixel, Lemon Squeezy affiliate measurement, optional
  consent, and Global Privacy Control treatment.
- `src/styles.css` - Added banner, dialog, toggle, footer button, and responsive
  styles using the existing site theme variables. The banner uses a wider,
  shorter desktop layout and stacks controls on mobile.

## Reason

The site uses analytics and advertising/affiliate measurement. Non-essential
analytics and marketing trackers need to be blocked until the user has a clear
choice, and users need a way to reject, customize, and change consent later.

## Verification

Code review only, following the root instruction that no verification beyond
code review is needed for this change. `npm run build` was not run.

## Known Risks

- Reddit Pixel will not load until `VITE_REDDIT_PIXEL_ID` is provided in the
  deployment environment.
- This is a technical compliance implementation based on researched regulatory
  and vendor guidance, not a substitute for review by a privacy attorney.
