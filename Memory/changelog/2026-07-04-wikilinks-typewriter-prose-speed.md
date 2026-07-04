# Wiki-links Typewriter Prose Speed

**Date:** 2026-07-04
**Agent:** Codex

## Summary

The homepage Wiki-links typewriter now keeps the slower Wiki-link typing speed while making the surrounding prose type faster.

## Files Modified

- `src/App.tsx` - Reduced the non-Wiki-link character delay from `24ms` to `12ms` while leaving the Wiki-link delay at `82ms`.
- `Memory/changelog/2026-07-04-wikilinks-typewriter-prose-speed.md` - Documented the timing refinement.

## Why

The surrounding paragraph should move more quickly while Wiki-link tokens remain slow enough for the bracket syntax to read clearly.

## Verification

- Code review only, per user instruction that no verifications are needed beyond code review.

## Risks

- The paragraph outside Wiki-links now types faster, so the contrast between prose and Wiki-link token speed is more noticeable.