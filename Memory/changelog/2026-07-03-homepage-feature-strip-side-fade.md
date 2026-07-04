# Homepage Feature Strip Side Fade

**Date:** 2026-07-03
**Agent:** Codex

## Summary

The homepage feature strip no longer reads as a full-width website band. Its visible surface is now a centered marquee with side fade masks, theme-specific light and dark color variables, and a page-background outer section so the strip blends into the hero-to-Wiki-links transition without spanning the full viewport.

## Files Modified

- `src/styles.css` - Moved the visual band treatment into the centered marquee, added side fades, updated light-mode and dark-mode strip variables, and kept the reduced-motion fallback static and centered.
- `Memory/changelog/2026-07-03-homepage-feature-strip-side-fade.md` - Documented this feature-strip visual update.

## Why

The feature strip needed to fade out on the sides and stop appearing as a full-width website bar, while still adapting appropriately to both light and dark themes.

## Verification

- Code review only, per user instruction that no verifications are needed beyond code review.

## Risks

- The side fade masks also fade the marquee border and background at the edges by design, so the strip has a softer edge instead of a hard framed container.