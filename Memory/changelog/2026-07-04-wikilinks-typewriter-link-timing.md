# Wiki-links Typewriter Link Timing

**Date:** 2026-07-04
**Agent:** Codex

## Summary

The homepage Wiki-links typewriter now slows down while it types each `[[...]]` Wiki-link token, making the bracket syntax easier to notice before the completed link resolves into styled text.

## Files Modified

- `src/App.tsx` - Added Wiki-link character detection to the typewriter timer and increased the per-character delay while typing Wiki-link tokens.
- `Memory/changelog/2026-07-04-wikilinks-typewriter-link-timing.md` - Documented the timing adjustment.

## Why

The Wiki-link syntax should be more readable during the typing animation without slowing the entire paragraph.

## Verification

- Code review only, per user instruction that no verifications are needed beyond code review.

## Risks

- Wiki-link tokens now take longer to type, slightly increasing each loop's full animation duration.