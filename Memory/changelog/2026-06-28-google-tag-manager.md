# Google Tag Manager Setup

## Summary

Added the Google Tag Manager container for the website and routed Google
Analytics measurement through the existing consent flow instead of loading a
separate Google Analytics script.

## Files Changed

- `index.html` - Added Google Consent Mode defaults before the Google Tag
  Manager head snippet, then added the GTM noscript iframe immediately after the
  opening body tag.
- `src/analyticsConsent.ts` - Removed the direct Google Analytics `gtag.js`
  loader so GTM can own Google Analytics tags while the existing privacy choices
  continue to update Google Consent Mode.
- `src/components/StaticPages.tsx` - Updated privacy copy to mention Google Tag
  Manager alongside Google Analytics.

## Reason

Google Tag Manager is being added so Google Analytics events can be managed from
the GTM container without editing the website for every analytics change.

## Verification

Code review only, following the root instruction that no verification beyond
code review is needed for this change. `npm run build` was not run.

## Known Risks

- Google Analytics measurement now depends on the GTM container containing the
  intended GA4 tag configuration.
- The standard GTM noscript iframe is present for no-JavaScript visitors and is
  not controlled by the React consent banner.