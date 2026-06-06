# Purchase Page Download Section

**Date:** 2026-06-06
**Agent:** Codex

## Summary

The purchase page now includes a compact purchase/download section after the pricing cards. It gives buyers direct Windows/macOS installer links, the purchase-to-activation flow, and links to install, license, and release-note support.

## Files Modified

- `src/components/PurchasePage.tsx` - Imported shared download build data and added the purchase/download handoff section.
- `src/styles.css` - Added purchase download section layout, installer button styling, support links, and responsive collapse rules.
- `Memory/changelog/2026-06-06-purchase-page-download-section.md` - Documented this feature addition.

## Why

Purchasers should not have to leave the purchase page and hunt for the installer after checkout. Reusing the existing download URLs keeps the purchase page aligned with the main download page while making the post-purchase next step obvious.

## Verification

- Code review only, per workspace instruction.

## Risks

- The section depends on the shared `downloadBuilds` URLs staying current with the public release installers.
