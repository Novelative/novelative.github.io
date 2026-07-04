# Homepage Section Removal

**Date:** 2026-07-01
**Agent:** Codex

## Summary

Removed the selected homepage sections for One Studio, Inside Each Project, For Writers, and Built in Beta. The Ownership & Trust section was simplified again by removing the local-first promise panel, removing the visible section title/description, and replacing the flat counters with higher-contrast ownership fact cards that reveal more detail on hover or keyboard focus.

## Files Modified

- `src/App.tsx` - Removed the selected homepage section renders and component/data blocks, cleaned the jump-link targets, removed the Ownership & Trust local-first promise list and visible heading copy, and expanded the remaining ownership facts with icons, short detail copy, and hover/focus detail text.
- `src/styles.css` - Removed styles for deleted sections and the old ownership promise panel, then added the simplified Ownership & Trust layout, improved high-contrast fact-card styling, hover/focus expansion, and responsive collapse rules.
- `Memory/changelog/2026-07-01-homepage-section-removal.md` - Documented this homepage simplification.

## Why

Browser review comments requested removing the selected content-heavy homepage sections, reducing the amount of text and visual weight in Ownership & Trust, removing the local-first promise card list, removing the section title/description, and improving the UI/UX of the ownership fact cards, increasing card/background contrast, and adding hover expansion for more information.

## Verification

- Code review only, per user instruction that no verifications are needed beyond code review.

## Risks

- The homepage is shorter and jumps more directly from the visual story-map section to Ownership & Trust, so some mid-page positioning copy is no longer present.
- The Ownership & Trust section now relies on four compact facts rather than a separate explanatory trust panel.
