# Homepage Feature Strip

**Date:** 2026-07-03
**Agent:** Codex

## Summary

The homepage post-hero story-shift section now removes the paragraph cards and shows the feature names as a full-width sliding strip. The strip repeats the feature labels for continuous motion and falls back to a static wrapped band when reduced motion is enabled.

## Files Modified

- `src/App.tsx` - Replaced the story-shift paragraph render with a feature-only marquee strip.
- `src/styles.css` - Removed the paragraph/card story-shift styling and added the sliding feature band, repeated track animation, and reduced-motion fallback.
- `Memory/changelog/2026-07-03-homepage-feature-strip.md` - Documented this homepage section follow-up.

## Why

The compact paragraph cards still felt too text-heavy below the hero. The section now acts as a quick feature-name pass instead of a copy block.

## Verification

- Code review only, per user instruction that no verifications are needed beyond code review.

## Risks

- The post-hero section now carries less positioning copy, so visitors see feature names without the previous explanatory statements.