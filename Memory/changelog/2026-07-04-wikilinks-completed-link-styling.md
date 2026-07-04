# Wiki-links Completed Link Styling

**Date:** 2026-07-04
**Agent:** Codex

## Summary

The homepage Wiki-links typewriter now shows bracket syntax while each link is being typed, then removes the brackets once the completed `[[...]]` token is typed.

## Files Modified

- `src/App.tsx` - Updated the completed Wiki-link render to display only the linked text after the final closing bracket appears.
- `src/styles.css` - Simplified completed Wiki-link styling so it inherits the surrounding typewriter typography and differs only by color.
- `Memory/changelog/2026-07-04-wikilinks-completed-link-styling.md` - Documented the parser and styling update.

## Why

The demo should communicate Wiki-link syntax during typing without leaving bracket characters or pill styling on completed links.

## Verification

- Code review only, per user instruction that no verifications are needed beyond code review.

## Risks

- Completed Wiki-links now blend more tightly into the paragraph, so their affordance relies on color rather than a separate pill treatment.