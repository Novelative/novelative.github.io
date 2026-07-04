# Wiki-links Typing Loop

**Date:** 2026-07-04
**Agent:** Codex

## Summary

The homepage Wiki-links demo typing animation now restarts after it finishes, with a 5.2 second idle pause before clearing and replaying the text.

## Files Modified

- `src/App.tsx` - Updated the Wiki-links typing effect to schedule a delayed restart after the full sample text is visible.
- `Memory/changelog/2026-07-04-wikilinks-typing-loop.md` - Documented the animation timing change.

## Why

The section needed its text animation to loop while still letting visitors read the completed sample before it restarts.

## Verification

- Code review only, per user instruction that no verifications are needed beyond code review.

## Risks

- The timer-driven animation now continues looping after the section first enters view, so it will keep updating while the homepage remains mounted.