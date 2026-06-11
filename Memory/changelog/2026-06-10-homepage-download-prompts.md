# Homepage Download Prompts

Date: 2026-06-10

## Summary

The homepage now includes three compact call-to-action sections that point guests to the download page. The prompts appear after the story-shift section, after the visualize story map, and after the ownership/trust section so visitors have multiple natural paths to the beta download page before the final installer CTA.

## Files Changed

- `src/App.tsx` - Added reusable homepage download prompt content, inserted three prompt sections into the homepage flow, and linked each CTA button to `/download`.
- `src/styles.css` - Added full-width prompt section styling, a surface-tone variant, desktop grid layout, and mobile stacking rules.
- `Memory/changelog/2026-06-10-homepage-download-prompts.md` - Documented this homepage update.

## Reason

Guests should see more download-page handoffs throughout the homepage instead of relying only on the hero button, header button, and final download section.

## Verification

Not run per instruction: "No verifications are needed."

## Known Risks

- The added sections increase homepage length.
- The CTA copy should be revisited if the download page release positioning changes.
