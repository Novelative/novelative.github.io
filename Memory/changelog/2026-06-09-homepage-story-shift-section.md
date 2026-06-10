# Homepage Story Shift Section

**Date:** 2026-06-09
**Agent:** Codex

## Summary

The homepage now removes the JumpNav from the visible flow, comments out the CoreViews render, and places a new scroll-animated narrative section directly below the hero. The new section introduces the "stuck in the past" message and supporting Novelative positioning copy as three same-size text blocks with later center-screen blur reveals, tall scroll spacing, readable base text, a one-time clipped primary-color glow behind the text, and a smaller muted feature list under the final paragraph with bullet separators and a slow theme-color pulse.

## Files Modified

- `src/App.tsx` - Replaced the homepage JumpNav/CoreViews render with `StoryShiftSection`, kept the old renders commented out, and added individually triggered scroll reveal text blocks with separate base, clipped sweep, and itemized final feature-list layers.
- `src/styles.css` - Added layout, tall per-paragraph spacing, shared typography, background, visible base text, a clipped behind-text glow overlay, smaller explicitly muted feature-list styling, bullet separators, a six-second feature color pulse, and responsive styling for the new section.
- `Memory/changelog/2026-06-09-homepage-story-shift-section.md` - Documented this homepage update.

## Why

The homepage needed a stronger narrative transition immediately after the hero, while removing the shortcut nav and hiding the CoreViews section below it.

## Verification

- Not run, per user instruction that no verifications are needed.

## Risks

- The old `JumpNav` and `CoreViews` implementations remain in the file for easy restoration, but they are not currently rendered on the homepage.
