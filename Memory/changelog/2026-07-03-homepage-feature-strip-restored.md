# Homepage Feature Strip Restored

**Date:** 2026-07-03
**Agent:** Codex

## Summary

Reapplied the homepage post-hero feature strip after the section was back in its older paragraph-card form. The large scroll-reveal paragraphs were removed again, and the feature names now render as a centered sliding marquee with side fades, light/dark theme variables, mirrored repeated content, and a reduced-motion static fallback.

## Files Modified

- `src/App.tsx` - Replaced the paragraph-based `StoryShiftSection` with the feature-name marquee markup.
- `src/styles.css` - Replaced the tall story-shift paragraph styles with the centered side-faded marquee, theme variables, seamless loop animation, and reduced-motion fallback.
- `Memory/changelog/2026-07-03-homepage-feature-strip-restored.md` - Documented this restoration.

## Why

The homepage needed the earlier paragraph-removal and sliding-feature-band work reapplied.

## Verification

- Code review only, per user instruction that no verifications are needed beyond code review.

## Risks

- The post-hero section no longer includes the explanatory paragraph copy, so it depends on short feature names to communicate the transition.